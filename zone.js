import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, onSnapshot,
  serverTimestamp, query, orderBy, limit, Timestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase-config.js?v=4.6.0";
import { REWARD_ITEMS } from "./reward-data.js?v=4.6.0";
import { DEFAULT_CHARACTER } from "./character-system.js?v=4.6.0";

const firebaseApp=initializeApp(firebaseConfig);
const auth=getAuth(firebaseApp);
const db=getFirestore(firebaseApp);
const $=id=>document.getElementById(id);

const ZONE_ID="thai_social_zone_v4_1";
const ZONE_VERSION="4.6.0";
const WORLD={width:2200,height:1400};
const WALK_BOUNDS={left:150,right:2050,top:250,bottom:1240};
const PLAYER_SPEED=330;
const POSITION_SEND_MS=180;
const PRESENCE_HEARTBEAT_MS=30000;
const ONLINE_STALE_MS=95000;
const USER_CHAT_TTL_MS=24*60*60*1000;
const BUBBLE_MS=9000;
const DAY_NIGHT_MS=3*60*60*1000;

const canvas=$("zoneCanvas"),ctx=canvas.getContext("2d",{alpha:false});
let cssW=1,cssH=1,dpr=1,zoom=1;
let uid=null,profile=null,blocked=true;
let players=new Map(),messages=[],messagesByUid=new Map();
let positionsUnsub=null,messagesUnsub=null,moderationUnsub=null,rankingUnsub=null;
let heartbeat=null,clockTimer=null,expiryTimer=null;
let lastFrame=performance.now(),lastPositionSend=0,lastChatAt=0;
let camera={x:0,y:0};
const me={x:1100,y:760,direction:"down",moving:false};
const keys=new Set();
const touchDirs={up:false,down:false,left:false,right:false};

const GM_RANK={tierId:"master",tierName:"GAME MASTER",rating:999999};
const GM_ITEMS=[
  {icon:"👑",name:"GM Crown"},
  {icon:"🪄",name:"GM Staff"},
  {icon:"🛡️",name:"Guardian Aura"}
];

const esc=v=>String(v??"")
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
  .replaceAll('"',"&quot;");

function isGM(){return uid===ADMIN_UID}
function isGMPlayer(p){return p?.uid===ADMIN_UID||p?.isAdmin===true}
function equipped(character){return {...DEFAULT_CHARACTER.equipped,...(character?.equipped||{})}}
function itemById(id){return REWARD_ITEMS.find(x=>x.id===id)||null}
function equippedItems(character){
  return Object.entries(equipped(character)).map(([slot,id])=>({slot,item:itemById(id)})).filter(x=>x.item);
}
function rankMeta(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase();
  const map={
    bronze:{letter:"B",color:"#9a6b46"},silver:{letter:"S",color:"#84919c"},
    gold:{letter:"G",color:"#d5a21d"},platinum:{letter:"P",color:"#3b9c98"},
    diamond:{letter:"D",color:"#537bd2"},master:{letter:"M",color:"#7749b7"}
  };
  return {id,...(map[id]||map.bronze)};
}
function rankShieldHTML(rank){
  const r=rankMeta(rank);
  return `<span class="rank-shield rank-${r.id}"><span class="rank-shield-letter">${r.letter}</span></span>`;
}
function showGate(title,text,help=""){
  blocked=true;
  $("zoneApp").classList.add("hidden");
  $("zoneGate").classList.remove("hidden");
  $("zoneGateTitle").textContent=title;
  $("zoneGateText").textContent=text;
  const box=$("zoneGateHelp");
  if(help){box.innerHTML=help;box.classList.remove("hidden")}
  else{box.innerHTML="";box.classList.add("hidden")}
}
function hideGate(){
  blocked=false;
  $("zoneGate").classList.add("hidden");
  $("zoneApp").classList.remove("hidden");
}
function chatStatus(text,error=false){
  $("zoneChatStatus").textContent=text;
  $("zoneChatStatus").classList.toggle("error",error);
}
function connectionState(state,text){
  $("zoneConnectionBadge").dataset.state=state;
  $("zoneConnectionBadge").querySelector("strong").textContent=text;
}

function moderationState(m){
  const now=Date.now(),ban=m?.bannedUntil?.toDate?.(),kick=m?.kickedUntil?.toDate?.();
  return {
    banned:!!ban&&ban.getTime()>now,bannedUntil:ban,
    kicked:!!kick&&kick.getTime()>now,kickedUntil:kick
  };
}
async function checkModeration(){
  if(isGM())return true;
  try{
    const snap=await getDoc(doc(db,"zone_moderation",uid));
    if(!snap.exists())return true;
    const m=snap.data(),state=moderationState(m);
    if(state.banned){
      showGate("ถูกระงับการเข้า 2D Zone",`แบนถึง ${state.bannedUntil.toLocaleString("th-TH")}${m.banReason?` · ${m.banReason}`:""}`);
      return false;
    }
    if(state.kicked){
      showGate("ถูก GM เตะออกจาก 2D Zone",`กลับเข้าได้หลัง ${state.kickedUntil.toLocaleTimeString("th-TH")}`);
      return false;
    }
    return true;
  }catch(error){
    showGate("ตรวจสอบสิทธิ์ Zone ไม่สำเร็จ",error.message||String(error),
      `<strong>Firebase:</strong> ตรวจว่า firestore.rules เวอร์ชัน V${ZONE_VERSION} ถูก Publish แล้ว`);
    return false;
  }
}
function listenModeration(){
  if(isGM())return;
  moderationUnsub?.();
  moderationUnsub=onSnapshot(doc(db,"zone_moderation",uid),snap=>{
    if(!snap.exists())return;
    const m=snap.data(),state=moderationState(m);
    if(state.banned||state.kicked){
      stopRealtime();
      showGate(
        state.banned?"คุณถูก GM แบนจาก 2D Zone":"คุณถูก GM เตะออกจาก 2D Zone",
        state.banned?`แบนถึง ${state.bannedUntil.toLocaleString("th-TH")}`:`กลับเข้าได้หลัง ${state.kickedUntil.toLocaleTimeString("th-TH")}`
      );
    }
  },error=>console.warn("moderation:",error));
}

async function loadProfile(){
  if(isGM()){
    profile={uid,studentId:"GM",fullName:"GM",rank:GM_RANK,character:{gender:"male",equipped:{}},zone:{}};
    me.x=1100;me.y=760;return true;
  }
  try{
    const snap=await getDoc(doc(db,"users",uid));
    if(!snap.exists()){showGate("ไม่พบข้อมูล User","กรุณากลับไปลงทะเบียนใหม่");return false}
    profile={uid,...snap.data()};
    if(!["male","female"].includes(profile.character?.gender)){
      showGate("กรุณาเลือกตัวละครก่อน","กลับหน้า User แล้วเลือกตัวละครชายหรือหญิงก่อนเข้า 2D Zone");
      return false;
    }
    const z=profile.zone||{};
    me.x=Math.max(WALK_BOUNDS.left,Math.min(WALK_BOUNDS.right,Number(z.x)||1100));
    me.y=Math.max(WALK_BOUNDS.top,Math.min(WALK_BOUNDS.bottom,Number(z.y)||760));
    me.direction=["up","down","left","right"].includes(z.direction)?z.direction:"down";
    return true;
  }catch(error){
    showGate("โหลดข้อมูล User ไม่สำเร็จ",error.message||String(error));
    return false;
  }
}

async function syncPublicProfile(){
  try{
    const gm=isGM();
    await setDoc(doc(db,"public_profiles",uid),{
      uid,studentId:gm?"GM":profile.studentId,fullName:gm?"GM":profile.fullName,
      isAdmin:gm,role:gm?"GM":"USER",rank:gm?GM_RANK:(profile.rank||null),
      character:gm?{gender:"male",equipped:{}}:{gender:profile.character?.gender||"male",equipped:equipped(profile.character)},
      educationLevel:gm?"":(profile.educationLevel||""),classroom:gm?"":(profile.classroom||""),
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("public profile:",error)}
}
async function publishPresence(){
  try{
    const gm=isGM();
    await setDoc(doc(db,"presence",uid),{
      uid,studentId:gm?"GM":profile.studentId,fullName:gm?"GM":profile.fullName,
      isAdmin:gm,rank:gm?GM_RANK:(profile.rank||null),area:"zone",online:true,lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("presence:",error)}
}
async function publishPosition(force=false){
  if(blocked||!profile)return;
  const now=performance.now();
  if(!force&&now-lastPositionSend<POSITION_SEND_MS)return;
  lastPositionSend=now;
  const gm=isGM();
  try{
    await setDoc(doc(db,"zone_positions",uid),{
      uid,studentId:gm?"GM":profile.studentId,isAdmin:gm,role:gm?"GM":"USER",
      rank:gm?GM_RANK:(profile.rank||null),
      character:gm?{gender:"male",equipped:{}}:{gender:profile.character?.gender||"male",equipped:equipped(profile.character)},
      zoneId:ZONE_ID,x:Math.round(me.x*10)/10,y:Math.round(me.y*10)/10,
      direction:me.direction,moving:me.moving,online:true,updatedAt:serverTimestamp()
    },{merge:true});
    connectionState("online","REALTIME");
  }catch(error){
    connectionState("error","SYNC ERROR");
    console.warn("position:",error);
  }
}

function listenPositions(){
  positionsUnsub?.();
  positionsUnsub=onSnapshot(collection(db,"zone_positions"),snap=>{
    const now=Date.now(),seen=new Set();
    snap.docs.forEach(d=>{
      const data={uid:d.id,...d.data()};
      if(data.zoneId!==ZONE_ID||!data.online)return;
      const dt=data.updatedAt?.toDate?.();
      if(dt&&now-dt.getTime()>ONLINE_STALE_MS)return;
      seen.add(d.id);
      if(d.id===uid)return;
      const x=Number(data.x)||1100,y=Number(data.y)||760;
      const old=players.get(d.id);
      if(old){
        Object.assign(old,data,{targetX:x,targetY:y});
      }else{
        players.set(d.id,{...data,currentX:x,currentY:y,targetX:x,targetY:y});
      }
    });
    for(const id of [...players.keys()])if(!seen.has(id))players.delete(id);
    $("zoneOnlineCount").textContent=players.size+1;
    connectionState("online","REALTIME");
  },error=>{
    connectionState("error","FIREBASE ERROR");
    console.warn("zone positions:",error);
  });
}

function isChatVisible(m,now=Date.now()){
  if(m?.isGM===true||m?.uid===ADMIN_UID)return true;
  const created=m?.createdAt?.toDate?.();
  return !!created&&now-created.getTime()<USER_CHAT_TTL_MS;
}
function refreshMessages(){
  const now=Date.now();
  const visible=messages.filter(m=>m.zoneId===ZONE_ID&&isChatVisible(m,now));
  const latest=new Map();
  for(const m of visible)if(!latest.has(m.uid))latest.set(m.uid,m);
  messagesByUid=latest;
  renderChatHistory(visible);
}
function listenMessages(){
  messagesUnsub?.();
  const q=query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(120));
  messagesUnsub=onSnapshot(q,snap=>{
    messages=snap.docs.map(d=>({id:d.id,...d.data()}));
    refreshMessages();
    chatStatus("พร้อมพูดคุย");
  },error=>{
    chatStatus("โหลดแชตไม่สำเร็จ",true);
    console.warn("chat listen:",error);
  });
}
function renderChatHistory(preFiltered=null){
  const rows=(preFiltered||messages.filter(m=>m.zoneId===ZONE_ID&&isChatVisible(m))).slice(0,80);
  if(!$("zoneChatHistoryList"))return;
  $("zoneChatHistoryList").innerHTML=rows.length?rows.map(m=>{
    const gm=m.isGM===true||m.uid===ADMIN_UID;
    const dt=m.createdAt?.toDate?.();
    return `<article class="simple-zone-chat-message ${gm?"gm":""}">
      <div class="simple-zone-chat-avatar">${gm?"GM":esc(String(m.studentId||"?").slice(-2))}</div>
      <div><div class="simple-zone-chat-meta"><strong>${gm?"GM":esc(m.studentId||"USER")}</strong><time>${dt?dt.toLocaleString("th-TH"):"-"}</time></div><p>${esc(m.text||"")}</p></div>
    </article>`;
  }).join(""):`<div class="empty">ยังไม่มีข้อความ</div>`;
}
async function archiveMessage(messageId,data){
  try{
    await setDoc(doc(db,"zone_chat_archive",messageId),{
      ...data,messageId,createdAt:serverTimestamp(),archivedAt:serverTimestamp()
    });
  }catch(error){
    console.warn("chat archive:",error);
  }
}
async function sendMessage(text){
  const clean=String(text||"").trim().slice(0,120);
  if(blocked||!clean||!profile)return;
  if(Date.now()-lastChatAt<700){chatStatus("ส่งข้อความเร็วเกินไป");return}
  lastChatAt=Date.now();
  const gm=isGM();
  const payload={uid,studentId:gm?"GM":profile.studentId,text:clean,zoneId:ZONE_ID,isGM:gm,createdAt:serverTimestamp()};
  if(!gm)payload.expiresAt=Timestamp.fromMillis(Date.now()+USER_CHAT_TTL_MS);
  chatStatus("กำลังส่ง...");
  try{
    const ref=doc(collection(db,"zone_messages"));
    await setDoc(ref,payload);
    archiveMessage(ref.id,{uid,studentId:gm?"GM":profile.studentId,text:clean,zoneId:ZONE_ID,isGM:gm});
    chatStatus("ส่งแล้ว");
    setTimeout(()=>chatStatus("พร้อมพูดคุย"),1200);
  }catch(error){
    chatStatus("ส่งไม่ได้ · ตรวจ Firebase Rules",true);
    console.warn("send chat:",error);
  }
}

$("zoneChatForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const input=$("zoneChatInput"),text=input.value;
  if(!text.trim())return;
  input.value="";
  await sendMessage(text);
  input.focus({preventScroll:true});
});
$("openZoneChatHistory").onclick=()=>{renderChatHistory();$("zoneChatHistoryModal").classList.remove("hidden")};
$("closeZoneChatHistory").onclick=()=>$("zoneChatHistoryModal").classList.add("hidden");

function directionPressed(dir){
  const map={up:["w","arrowup"],down:["s","arrowdown"],left:["a","arrowleft"],right:["d","arrowright"]};
  return touchDirs[dir]||map[dir].some(k=>keys.has(k));
}
function bindHold(id,dir){
  const el=$(id);if(!el)return;
  el.style.touchAction="none";
  el.addEventListener("pointerdown",e=>{e.preventDefault();touchDirs[dir]=true;el.setPointerCapture?.(e.pointerId)});
  const stop=()=>{touchDirs[dir]=false;publishPosition(true)};
  ["pointerup","pointercancel","pointerleave","lostpointercapture"].forEach(ev=>el.addEventListener(ev,stop));
}
bindHold("moveUpButton","up");
bindHold("moveDownButton","down");
bindHold("moveLeftButton","left");
bindHold("moveRightButton","right");

window.addEventListener("keydown",e=>{
  if(document.activeElement===$("zoneChatInput"))return;
  const k=e.key.toLowerCase();
  if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k)){e.preventDefault();keys.add(k)}
  if(k==="enter")$("zoneChatInput").focus({preventScroll:true});
});
window.addEventListener("keyup",e=>{
  const k=e.key.toLowerCase();
  keys.delete(k);
  if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k))publishPosition(true);
});

function updateMovement(dt){
  if(blocked)return;
  let dx=(directionPressed("right")?1:0)-(directionPressed("left")?1:0);
  let dy=(directionPressed("down")?1:0)-(directionPressed("up")?1:0);
  const len=Math.hypot(dx,dy);
  me.moving=len>0;
  if(!len)return;
  dx/=len;dy/=len;
  me.x=Math.max(WALK_BOUNDS.left,Math.min(WALK_BOUNDS.right,me.x+dx*PLAYER_SPEED*dt));
  me.y=Math.max(WALK_BOUNDS.top,Math.min(WALK_BOUNDS.bottom,me.y+dy*PLAYER_SPEED*dt));
  if(Math.abs(dx)>Math.abs(dy))me.direction=dx<0?"left":"right";
  else me.direction=dy<0?"up":"down";
  publishPosition(false);
}
function smoothRemote(dt){
  const f=1-Math.pow(0.001,dt);
  for(const p of players.values()){
    p.currentX+=(p.targetX-p.currentX)*f;
    p.currentY+=(p.targetY-p.currentY)*f;
  }
}
function resizeCanvas(){
  const rect=canvas.getBoundingClientRect();
  cssW=Math.max(1,rect.width);cssH=Math.max(1,rect.height);
  dpr=Math.min(2.5,window.devicePixelRatio||1);
  canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);
  canvas.style.width=`${cssW}px`;canvas.style.height=`${cssH}px`;
  zoom=Math.max(.62,Math.min(1.15,Math.min(cssW/1350,cssH/820)));
  ctx.imageSmoothingEnabled=false;
}
function updateCamera(dt){
  const viewW=cssW/zoom,viewH=cssH/zoom;
  const tx=Math.max(0,Math.min(WORLD.width-viewW,me.x-viewW/2));
  const ty=Math.max(0,Math.min(WORLD.height-viewH,me.y-viewH/2));
  const f=1-Math.pow(0.0003,dt);
  camera.x+=(tx-camera.x)*f;camera.y+=(ty-camera.y)*f;
}
function screenToWorld(clientX,clientY){
  const r=canvas.getBoundingClientRect();
  return {x:(clientX-r.left)/zoom+camera.x,y:(clientY-r.top)/zoom+camera.y};
}
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}

function worldTimeState(now=Date.now()){
  const block=Math.floor(now/DAY_NIGHT_MS),day=block%2===0,next=(block+1)*DAY_NIGHT_MS;
  return {day,period:day?"day":"night",label:day?"กลางวัน":"กลางคืน",icon:day?"☀️":"🌙",remaining:next-now};
}
function countdown(ms){
  const s=Math.max(0,Math.floor(ms/1000));
  return `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor(s%3600/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}
function updateClock(){
  const t=worldTimeState();
  $("zoneWorldPeriod").textContent=t.label;
  $("zoneWorldCountdown").textContent=`เปลี่ยนใน ${countdown(t.remaining)}`;
  $("zoneWorldIcon").textContent=t.icon;
  $("zoneWorld").dataset.period=t.period;
}

function drawTree(c,x,y,day){
  c.fillStyle=day?"#6b4b2b":"#493521";c.fillRect(x-10,y,20,70);
  c.fillStyle=day?"#3f8a4d":"#174e3b";
  for(const [ox,oy,r] of [[0,-15,48],[-32,10,37],[34,12,40],[0,28,42]]){c.beginPath();c.arc(x+ox,y+oy,r,0,Math.PI*2);c.fill()}
}
function drawHouse(c,x,y,w,h,roof,wall,day){
  c.fillStyle="rgba(0,0,0,.15)";rr(c,x+12,y+h-6,w,18,8);c.fill();
  c.fillStyle=wall;rr(c,x,y+65,w,h-65,12);c.fill();
  c.fillStyle=roof;c.beginPath();c.moveTo(x-25,y+80);c.lineTo(x+w/2,y);c.lineTo(x+w+25,y+80);c.lineTo(x+w,y+105);c.lineTo(x,y+105);c.closePath();c.fill();
  c.fillStyle=day?"#9fd6ef":"#ffd278";
  for(let i=0;i<3;i++){rr(c,x+35+i*(w-105)/2,y+120,45,48,5);c.fill()}
  c.fillStyle="#4e3426";rr(c,x+w/2-28,y+h-70,56,70,5);c.fill();
}
function drawLamp(c,x,y,day){
  c.fillStyle="#503923";c.fillRect(x-3,y,6,55);
  c.fillStyle=day?"#e8a83b":"#ffcf60";rr(c,x-11,y-18,22,24,7);c.fill();
  if(!day){c.fillStyle="rgba(255,205,86,.12)";c.beginPath();c.arc(x,y-7,42,0,Math.PI*2);c.fill()}
}
function drawWorldBackground(){
  const t=worldTimeState(),day=t.day;
  const bg=ctx.createLinearGradient(0,0,0,WORLD.height);
  if(day){bg.addColorStop(0,"#82cfee");bg.addColorStop(.48,"#b8e3ee");bg.addColorStop(.49,"#70a766");bg.addColorStop(1,"#4e8b53")}
  else{bg.addColorStop(0,"#0a263b");bg.addColorStop(.48,"#17465c");bg.addColorStop(.49,"#315c4a");bg.addColorStop(1,"#244936")}
  ctx.fillStyle=bg;ctx.fillRect(0,0,WORLD.width,WORLD.height);

  if(day){
    ctx.fillStyle="#ffe16a";ctx.beginPath();ctx.arc(1760,150,55,0,Math.PI*2);ctx.fill();
  }else{
    ctx.fillStyle="#ffe7a7";ctx.beginPath();ctx.arc(1760,150,46,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,.75)";
    for(let i=0;i<75;i++)ctx.fillRect((i*173)%WORLD.width,45+(i*79)%330,2,2);
  }

  drawHouse(ctx,120,170,360,270,"#2d5971","#8b4a32",day);
  drawHouse(ctx,1720,170,360,270,"#784131","#9b663f",day);
  drawHouse(ctx,150,1010,330,230,"#345f52","#836047",day);
  drawHouse(ctx,1720,1010,330,230,"#4c466d","#8e5e42",day);

  ctx.fillStyle=day?"#c7b894":"#66716c";rr(ctx,420,390,1360,650,60);ctx.fill();
  ctx.strokeStyle=day?"rgba(102,81,55,.16)":"rgba(255,255,255,.08)";ctx.lineWidth=2;
  for(let x=460;x<1750;x+=72){ctx.beginPath();ctx.moveTo(x,400);ctx.lineTo(x-60,1030);ctx.stroke()}
  for(let y=430;y<1030;y+=65){ctx.beginPath();ctx.moveTo(430,y);ctx.lineTo(1770,y);ctx.stroke()}

  ctx.fillStyle=day?"#59a9bd":"#2a6678";ctx.beginPath();ctx.ellipse(1100,1120,260,95,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=day?"#79a34f":"#456c45";
  for(const [x,y] of [[900,1110],[1030,1140],[1180,1105],[1300,1140]]){ctx.beginPath();ctx.ellipse(x,y,32,13,0,0,Math.PI*2);ctx.fill()}

  [[520,300],[680,310],[1520,300],[1680,310],[520,1110],[1600,1110],[700,1190],[1500,1190]].forEach(([x,y])=>drawTree(ctx,x,y,day));
  [[560,480],[1640,480],[560,950],[1640,950]].forEach(([x,y])=>drawLamp(ctx,x,y,day));

  ctx.fillStyle=day?"#4d654a":"#cbd8d3";ctx.font="800 24px system-ui";ctx.textAlign="center";
  ctx.fillText("SOCIAL PLAZA",1100,430);
}
function itemColor(item){
  const key=String(item?.visual||item?.id||"");
  let h=0;for(const ch of key)h=(h*31+ch.charCodeAt(0))%360;
  return `hsl(${h} 48% 45%)`;
}
function drawRankShield(c,x,y,rank){
  const r=rankMeta(rank);c.save();c.translate(x,y);c.fillStyle=r.color;
  c.beginPath();c.moveTo(-11,-9);c.lineTo(11,-9);c.lineTo(9,7);c.lineTo(0,15);c.lineTo(-9,7);c.closePath();c.fill();
  c.fillStyle="#fff";c.font="900 10px system-ui";c.textAlign="center";c.fillText(r.letter,0,3);c.restore();
}
function drawGMCharacter(c,p,x,y){
  c.save();c.translate(x,y);
  c.strokeStyle="rgba(255,208,77,.72)";c.lineWidth=6;c.beginPath();c.ellipse(0,-35,48,73,0,0,Math.PI*2);c.stroke();
  c.fillStyle="#511b3b";c.beginPath();c.moveTo(-38,-48);c.lineTo(38,-48);c.lineTo(54,36);c.lineTo(0,18);c.lineTo(-54,36);c.closePath();c.fill();
  c.fillStyle="#f0c84e";c.beginPath();c.moveTo(-25,-88);c.lineTo(-20,-117);c.lineTo(-7,-101);c.lineTo(0,-126);c.lineTo(10,-101);c.lineTo(23,-116);c.lineTo(25,-88);c.closePath();c.fill();
  c.fillStyle="#edc49e";c.beginPath();c.arc(0,-72,23,0,Math.PI*2);c.fill();
  c.fillStyle="#2b2020";c.beginPath();c.arc(0,-80,24,Math.PI,Math.PI*2);c.fill();
  c.strokeStyle="#f0c84e";c.lineWidth=5;c.beginPath();c.moveTo(30,-35);c.lineTo(48,32);c.stroke();c.fillStyle="#55d9ff";c.beginPath();c.arc(50,34,8,0,Math.PI*2);c.fill();
  drawName(c,p,true);c.restore();
}
function drawStudentCharacter(c,p,x,y){
  const char=p.character||{},eq=equipped(char),gender=char.gender==="female"?"female":"male";
  const top=itemById(eq.top),head=itemById(eq.head),back=itemById(eq.back),hand=itemById(eq.hand),pet=itemById(eq.pet),aura=itemById(eq.aura);
  c.save();c.translate(x,y);
  if(aura){c.strokeStyle=itemColor(aura);c.lineWidth=5;c.globalAlpha=.58;c.beginPath();c.ellipse(0,-34,43,67,0,0,Math.PI*2);c.stroke();c.globalAlpha=1}
  if(back){c.font="31px system-ui";c.textAlign="center";c.fillText(back.icon||"🎒",-29,-20)}
  c.fillStyle="rgba(0,0,0,.18)";c.beginPath();c.ellipse(0,30,28,9,0,0,Math.PI*2);c.fill();

  c.fillStyle="#e8bd98";c.fillRect(-13,6,9,30);c.fillRect(5,6,9,30);
  c.fillStyle="#263442";rr(c,-18,29,17,9,5);c.fill();rr(c,2,29,17,9,5);c.fill();
  c.fillStyle="#315b82";rr(c,-21,-5,42,21,6);c.fill();

  c.fillStyle=top?itemColor(top):"#f3f0e8";rr(c,-23,-48,46,46,12);c.fill();
  c.fillStyle="#eabf99";rr(c,-33,-40,10,42,6);c.fill();rr(c,23,-40,10,42,6);c.fill();

  if(gender==="female"){c.fillStyle="#2d211e";c.beginPath();c.ellipse(0,-74,28,37,0,0,Math.PI*2);c.fill()}
  c.fillStyle="#efc6a0";c.beginPath();c.arc(0,-74,23,0,Math.PI*2);c.fill();
  c.fillStyle="#2d211e";c.beginPath();c.arc(0,-82,24,Math.PI,Math.PI*2);c.fill();
  if(gender==="female"){c.fillRect(16,-82,10,38);c.fillStyle="#3c6fa3";c.beginPath();c.arc(23,-87,7,0,Math.PI*2);c.fill()}
  c.fillStyle="#232323";c.fillRect(7,-76,4,4);

  if(head){c.font="27px system-ui";c.textAlign="center";c.fillText(head.icon||"🧢",0,-104)}
  if(hand){c.font="27px system-ui";c.fillText(hand.icon||"✨",39,-17)}
  if(pet){c.font="30px system-ui";c.fillText(pet.icon||"🐾",55,12)}
  drawName(c,p,false);
  c.restore();
}
function drawName(c,p,gm){
  const label=gm?"GM":String(p.studentId||"USER");
  c.font="800 14px system-ui";
  const w=Math.max(gm?78:105,c.measureText(label).width+48);
  c.fillStyle=gm?"rgba(92,22,49,.95)":"rgba(10,28,39,.88)";rr(c,-w/2,-145,w,30,9);c.fill();
  c.strokeStyle=gm?"#e8bd43":"rgba(255,255,255,.08)";c.lineWidth=2;c.stroke();
  c.fillStyle="#fff";c.textAlign="center";c.fillText(label,0,-125);drawRankShield(c,-w/2+17,-131,gm?GM_RANK:p.rank);
  drawBubble(c,p);
}
function drawBubble(c,p){
  const m=messagesByUid.get(p.uid);if(!m?.text)return;
  const dt=m.createdAt?.toDate?.();if(dt&&Date.now()-dt.getTime()>BUBBLE_MS)return;
  const text=String(m.text).slice(0,120);c.font="600 14px system-ui";const maxW=230,lines=[];let line="";
  for(const ch of [...text]){const t=line+ch;if(c.measureText(t).width>maxW&&line){lines.push(line);line=ch}else line=t}
  if(line)lines.push(line);
  const show=lines.slice(0,3),bw=Math.max(110,Math.min(255,Math.max(...show.map(x=>c.measureText(x).width))+26)),bh=18+show.length*20,by=-169-bh;
  c.fillStyle=p.isAdmin?"#fff3c9":"rgba(255,255,255,.97)";rr(c,-bw/2,by,bw,bh,13);c.fill();
  c.strokeStyle=p.isAdmin?"#d6a12d":"rgba(28,55,70,.16)";c.lineWidth=2;c.stroke();
  c.fillStyle="#17364a";c.textAlign="center";show.forEach((ln,i)=>c.fillText(ln,0,by+24+i*20));
}
function drawFrame(){
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle="#102c3d";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.setTransform(dpr*zoom,0,0,dpr*zoom,-camera.x*dpr*zoom,-camera.y*dpr*zoom);
  drawWorldBackground();

  const drawList=[...players.values()].map(p=>({...p,x:p.currentX,y:p.currentY}));
  drawList.push({
    uid,studentId:isGM()?"GM":profile.studentId,isAdmin:isGM(),rank:isGM()?GM_RANK:profile.rank,
    character:isGM()?{gender:"male",equipped:{}}:{gender:profile.character?.gender,equipped:equipped(profile.character)},
    x:me.x,y:me.y,direction:me.direction
  });
  drawList.sort((a,b)=>a.y-b.y);
  for(const p of drawList){
    if(isGMPlayer(p))drawGMCharacter(ctx,p,p.x,p.y);
    else drawStudentCharacter(ctx,p,p.x,p.y);
  }
}
function loop(now){
  const dt=Math.min(.04,(now-lastFrame)/1000);lastFrame=now;
  updateMovement(dt);smoothRemote(dt);updateCamera(dt);drawFrame();requestAnimationFrame(loop);
}

canvas.addEventListener("click",e=>{
  const pt=screenToWorld(e.clientX,e.clientY);let selected=null,best=999;
  for(const p of players.values()){
    const d=Math.hypot(p.currentX-pt.x,p.currentY-pt.y);
    if(d<65&&d<best){selected=p;best=d}
  }
  if(selected)openPlayerCard(selected);
});
function openPlayerCard(p){
  const gm=isGMPlayer(p);
  $("zonePlayerCardId").textContent=gm?"GM":String(p.studentId||"USER");
  $("zonePlayerCardShield").innerHTML=rankShieldHTML(gm?GM_RANK:p.rank);
  $("zonePlayerCardRank").textContent=gm?"GAME MASTER":`${p.rank?.tierName||"Bronze"} · ${Number(p.rank?.rating||0)} Rating`;
  $("zonePlayerCardItemTitle").textContent=gm?"GM EXCLUSIVE":"ไอเท็มที่กำลังสวม";
  const list=gm?GM_ITEMS:equippedItems(p.character).map(x=>x.item);
  $("zonePlayerCardItems").innerHTML=list.length?list.map(item=>`<div><span>${item.icon||"✨"}</span><small>${esc(item.name||"Item")}</small></div>`).join(""):`<div class="empty">ยังไม่ได้สวมไอเท็ม</div>`;
  $("zonePlayerCard").classList.remove("hidden");
}
$("closeZonePlayerCard").onclick=()=>$("zonePlayerCard").classList.add("hidden");

function listenRankingNotice(){
  rankingUnsub?.();
  rankingUnsub=onSnapshot(doc(db,"system_settings","ranking"),snap=>{
    if(!snap.exists()){$("zoneSystemNotice").classList.add("hidden");return}
    const data=snap.data(),next=data.nextResetAt?.toDate?.();
    if(next&&next.getTime()>Date.now()){
      $("zoneSystemNotice").textContent=`🏆 รีแรงค์ ${next.toLocaleString("th-TH")}${data.notice?` · ${data.notice}`:""}`;
      $("zoneSystemNotice").classList.remove("hidden");
    }else $("zoneSystemNotice").classList.add("hidden");
  },()=>{});
}

async function leaveZone(){
  clearInterval(heartbeat);clearInterval(clockTimer);clearInterval(expiryTimer);
  positionsUnsub?.();messagesUnsub?.();moderationUnsub?.();rankingUnsub?.();
  try{await updateDoc(doc(db,"zone_positions",uid),{online:false,updatedAt:serverTimestamp()})}catch{}
  try{await setDoc(doc(db,"presence",uid),{online:false,lastSeenAt:serverTimestamp()},{merge:true})}catch{}
  if(!isGM()){
    try{await updateDoc(doc(db,"users",uid),{zone:{zoneId:ZONE_ID,x:Math.round(me.x),y:Math.round(me.y),direction:me.direction,lastSeenAt:new Date().toISOString()}})}catch{}
  }
}
function stopRealtime(){
  blocked=true;keys.clear();Object.keys(touchDirs).forEach(k=>touchDirs[k]=false);
  clearInterval(heartbeat);positionsUnsub?.();messagesUnsub?.();
}

window.addEventListener("resize",resizeCanvas);
window.addEventListener("pagehide",leaveZone);
$("leaveZoneButton").addEventListener("click",()=>leaveZone());

onAuthStateChanged(auth,async user=>{
  if(!user){showGate("กรุณา Login ก่อน","2D Zone ใช้บัญชีที่ลงทะเบียนแล้ว");return}
  uid=user.uid;
  if(!(await loadProfile()))return;
  if(!(await checkModeration()))return;

  hideGate();
  $("zoneMyStudentId").textContent=isGM()?"GM":String(profile.studentId||"-");
  $("zoneChatIdentity").textContent=isGM()?"GM":String(profile.studentId||"-");
  $("zoneMyShield").innerHTML=rankShieldHTML(isGM()?GM_RANK:profile.rank);
  if(isGM()){
    $("openAdminPanel").classList.remove("hidden");
    $("leaveZoneButton").href="./admin.html";
    $("zoneChatInput").placeholder="GM พิมพ์ข้อความหรือประกาศ...";
  }

  resizeCanvas();updateClock();clockTimer=setInterval(updateClock,1000);
  listenModeration();listenPositions();listenMessages();listenRankingNotice();
  expiryTimer=setInterval(refreshMessages,60000);
  await syncPublicProfile();await publishPresence();await publishPosition(true);
  heartbeat=setInterval(async()=>{await publishPresence();await publishPosition(true)},PRESENCE_HEARTBEAT_MS);
  requestAnimationFrame(loop);
});
