import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc,
  collection, onSnapshot, serverTimestamp, query, orderBy, limit, where,
  runTransaction
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase-config.js?v=4.0.0";
import { REWARD_ITEMS, RARITY_META } from "./reward-data.js?v=4.0.0";
import { DEFAULT_CHARACTER } from "./character-system.js?v=4.0.0";

window.__ZONE_V40_BOOTED__ = true;

const firebaseApp=initializeApp(firebaseConfig);
const auth=getAuth(firebaseApp);
const db=getFirestore(firebaseApp);
const $=id=>document.getElementById(id);

const ZONE_VERSION="4.0.0";
const ZONE_ID="thai_social_zone_v4";
const WORLD={width:3000,height:900};
const WALK_Y=700;
const PLAYER_SPEED=250;

// Stabilized network settings:
// position = max ~4 writes/sec only while moving
// presence/public profile are NOT written every movement.
const POSITION_SEND_MS=260;
const PRESENCE_HEARTBEAT_MS=30000;
const ONLINE_STALE_MS=95000;
const BUBBLE_MS=9000;

// Shared global day/night: toggles exactly every 3 hours.
const WORLD_PERIOD_MS=3*60*60*1000;

const canvas=$("zoneCanvas");
const ctx=canvas.getContext("2d");
const profileCanvas=$("zoneProfileCanvas");
const profileCtx=profileCanvas.getContext("2d");

let uid=null;
let profile=null;
let players=new Map();
let messagesByUid=new Map();
let positionsUnsub=null;
let messagesUnsub=null;
let moderationUnsub=null;
let heartbeat=null;
let clockTimer=null;
let blocked=false;
let lastFrame=performance.now();
let lastPositionSend=0;
let lastChatAt=0;
let movingLeft=false;
let movingRight=false;
let lastWorldPeriod=null;

const me={x:520,y:WALK_Y,direction:"right",moving:false};

const esc=v=>String(v??"")
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
  .replaceAll('"',"&quot;");

function setBootStep(step,status,text){
  const row=document.querySelector(`[data-step="${step}"]`);
  if(!row)return;
  row.dataset.status=status;
  const em=row.querySelector("em");
  if(em)em.textContent=text;
}

setBootStep("script","ok",`V${ZONE_VERSION} พร้อม`);

function showGate(title,text,kind="info",help=""){
  blocked=true;
  $("zoneApp").classList.add("hidden");
  $("zoneGate").classList.remove("hidden");
  $("zoneGate").dataset.state=kind;
  $("zoneGateTitle").textContent=title;
  $("zoneGateText").textContent=text;

  const box=$("zoneGateErrorHelp");
  if(help){
    box.classList.remove("hidden");
    box.innerHTML=help;
  }else{
    box.classList.add("hidden");
    box.innerHTML="";
  }
}

function showPermissionHelp(error){
  const code=error?.code||"";
  const message=error?.message||"";
  showGate(
    "Firebase Rules ยังไม่ตรงกับ 2D Zone V4.0",
    `ระบบถูก Firebase ปฏิเสธสิทธิ์ (${code||"permission-denied"})`,
    "rules",
    `<strong>วิธีแก้</strong>
     <p>ไปที่ Firebase → Firestore Database → Rules → วางไฟล์ <code>firestore.rules</code> จาก V4.0 ทั้งหมด → Publish แล้วรอประมาณ 10–30 วินาที จากนั้น Reload หน้า Zone</p>
     <small>${esc(message)}</small>`
  );
  setBootStep("rules","error","Permission denied");
}

function rankMeta(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase();
  const map={
    bronze:{name:"Bronze",letter:"B",color:"#9b6b43"},
    silver:{name:"Silver",letter:"S",color:"#8795a5"},
    gold:{name:"Gold",letter:"G",color:"#d6a51d"},
    platinum:{name:"Platinum",letter:"P",color:"#3ca7a7"},
    diamond:{name:"Diamond",letter:"D",color:"#557fd8"},
    master:{name:"Master",letter:"M",color:"#7b4bc4"}
  };
  return {id,...(map[id]||map.bronze)};
}

function rankShieldHTML(rank){
  const r=rankMeta(rank);
  return `<span class="rank-shield rank-${r.id}"><span class="rank-shield-letter">${r.letter}</span></span>`;
}

function equipped(character){
  return {...DEFAULT_CHARACTER.equipped,...(character?.equipped||{})};
}
function itemById(id){return REWARD_ITEMS.find(x=>x.id===id)||null}
function equippedItems(character){
  return Object.entries(equipped(character))
    .map(([slot,id])=>({slot,item:itemById(id)}))
    .filter(x=>x.item);
}

function moderationState(m){
  const now=Date.now();
  const bannedUntil=m?.bannedUntil?.toDate?.();
  const kickedUntil=m?.kickedUntil?.toDate?.();
  return {
    banned:!!bannedUntil&&bannedUntil.getTime()>now,
    bannedUntil,
    kicked:!!kickedUntil&&kickedUntil.getTime()>now,
    kickedUntil
  };
}

function worldTimeState(now=Date.now()){
  const block=Math.floor(now/WORLD_PERIOD_MS);
  const isDay=block%2===0;
  const next=(block+1)*WORLD_PERIOD_MS;
  return {
    period:isDay?"day":"night",
    isDay,
    icon:isDay?"☀️":"🌙",
    label:isDay?"กลางวัน":"กลางคืน",
    nextChangeAt:next,
    remaining:Math.max(0,next-now)
  };
}

function formatCountdown(ms){
  const total=Math.max(0,Math.floor(ms/1000));
  const h=String(Math.floor(total/3600)).padStart(2,"0");
  const m=String(Math.floor((total%3600)/60)).padStart(2,"0");
  const s=String(total%60).padStart(2,"0");
  return `${h}:${m}:${s}`;
}

function updateWorldClock(){
  const state=worldTimeState();
  $("zoneWorldPeriod").textContent=state.label;
  $("zoneWorldCountdown").textContent=`เปลี่ยนใน ${formatCountdown(state.remaining)}`;
  $("zoneWorldIcon").textContent=state.icon;
  $("zoneWorld").dataset.period=state.period;

  if(lastWorldPeriod!==state.period){
    lastWorldPeriod=state.period;
    document.documentElement.dataset.worldPeriod=state.period;
  }
}

function startWorldClock(){
  clearInterval(clockTimer);
  updateWorldClock();
  clockTimer=setInterval(updateWorldClock,1000);
}

async function checkModerationBeforeEntry(){
  try{
    const snap=await getDoc(doc(db,"zone_moderation",uid));
    setBootStep("rules","ok","Rules พร้อม");
    if(!snap.exists())return true;

    const data=snap.data();
    const state=moderationState(data);

    if(state.banned){
      showGate(
        "ถูกระงับการเข้า 2D Zone",
        `GM แบนถึง ${state.bannedUntil.toLocaleString("th-TH")}${data.banReason?` · ${data.banReason}`:""}`,
        "banned"
      );
      return false;
    }
    if(state.kicked){
      showGate(
        "ถูก GM เตะออกจาก Zone",
        `กลับเข้าใหม่ได้หลัง ${state.kickedUntil.toLocaleTimeString("th-TH")}${data.kickReason?` · ${data.kickReason}`:""}`,
        "kicked"
      );
      return false;
    }
    return true;
  }catch(error){
    if(error?.code==="permission-denied")showPermissionHelp(error);
    else showGate("ตรวจสอบ Zone ไม่สำเร็จ",error?.message||String(error),"error");
    return false;
  }
}

function stopRealtime(){
  blocked=true;
  movingLeft=false;
  movingRight=false;
  clearInterval(heartbeat);
  if(positionsUnsub){positionsUnsub();positionsUnsub=null}
  if(messagesUnsub){messagesUnsub();messagesUnsub=null}
}

function listenModeration(){
  if(moderationUnsub)moderationUnsub();

  moderationUnsub=onSnapshot(doc(db,"zone_moderation",uid),snap=>{
    if(!snap.exists())return;
    const data=snap.data();
    const state=moderationState(data);

    if(state.banned){
      stopRealtime();
      showGate(
        "คุณถูก GM แบนจาก 2D Zone",
        `แบนถึง ${state.bannedUntil.toLocaleString("th-TH")}${data.banReason?` · เหตุผล: ${data.banReason}`:""}`,
        "banned"
      );
    }else if(state.kicked){
      stopRealtime();
      showGate(
        "คุณถูก GM เตะออกจาก 2D Zone",
        `กลับเข้าใหม่ได้หลัง ${state.kickedUntil.toLocaleTimeString("th-TH")}${data.kickReason?` · ${data.kickReason}`:""}`,
        "kicked"
      );
    }
  },error=>{
    if(error?.code==="permission-denied")showPermissionHelp(error);
  });
}

async function loadProfile(){
  setBootStep("profile","loading","กำลังอ่านข้อมูล");
  try{
    const snap=await getDoc(doc(db,"users",uid));
    if(!snap.exists()){
      showGate("ไม่พบข้อมูล User","กรุณากลับไปลงทะเบียนใหม่","profile");
      setBootStep("profile","error","ไม่พบข้อมูล");
      return false;
    }

    profile={uid,...snap.data()};
    if(!["male","female"].includes(profile.character?.gender)){
      showGate(
        "กรุณาเลือกตัวละครก่อน",
        "กลับหน้า User แล้วเลือกตัวละครชายหรือหญิงก่อนเข้า 2D Zone",
        "setup"
      );
      setBootStep("profile","error","ยังไม่เลือกตัวละคร");
      return false;
    }

    const z=profile.zone||{};
    me.x=Math.max(90,Math.min(WORLD.width-90,Number(z.x)||520));
    me.direction=z.direction==="left"?"left":"right";
    setBootStep("profile","ok",String(profile.studentId||"พร้อม"));
    return true;
  }catch(error){
    if(error?.code==="permission-denied")showPermissionHelp(error);
    else showGate("โหลดข้อมูล User ไม่สำเร็จ",error?.message||String(error),"profile");
    setBootStep("profile","error","เกิดข้อผิดพลาด");
    return false;
  }
}

async function syncPublicProfile(){
  if(blocked||!uid||!profile)return;
  try{
    await setDoc(doc(db,"public_profiles",uid),{
      uid,
      studentId:profile.studentId,
      fullName:profile.fullName,
      rank:profile.rank||null,
      character:{
        gender:profile.character?.gender||"male",
        equipped:equipped(profile.character)
      },
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){
    console.warn("syncPublicProfile:",error);
  }
}

async function publishPresence(){
  if(blocked||!uid||!profile)return;
  try{
    await setDoc(doc(db,"presence",uid),{
      uid,
      studentId:profile.studentId,
      fullName:profile.fullName,
      rank:profile.rank||null,
      area:"zone",
      online:true,
      lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch(error){
    console.warn("presence:",error);
  }
}

async function publishPosition(force=false){
  if(blocked||!uid||!profile)return;
  const now=performance.now();
  if(!force&&now-lastPositionSend<POSITION_SEND_MS)return;
  lastPositionSend=now;

  try{
    await setDoc(doc(db,"zone_positions",uid),{
      uid,
      studentId:String(profile.studentId||""),
      rank:profile.rank||null,
      character:{
        gender:profile.character?.gender||"male",
        equipped:equipped(profile.character)
      },
      zoneId:ZONE_ID,
      x:Math.round(me.x*10)/10,
      y:WALK_Y,
      direction:me.direction,
      moving:me.moving,
      online:true,
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){
    if(error?.code==="permission-denied"&&!blocked)showPermissionHelp(error);
    else console.warn("position:",error);
  }
}

function listenPositions(){
  if(positionsUnsub)positionsUnsub();

  const q=query(collection(db,"zone_positions"),where("zoneId","==",ZONE_ID));
  positionsUnsub=onSnapshot(q,snap=>{
    const now=Date.now();
    players.clear();

    snap.docs.forEach(d=>{
      const p={uid:d.id,...d.data()};
      if(!p.online)return;
      const dt=p.updatedAt?.toDate?.();
      if(dt&&now-dt.getTime()>ONLINE_STALE_MS)return;
      players.set(d.id,p);
    });

    $("zoneOnlineCount").textContent=Math.max(1,players.size);
    setBootStep("world","ok",`${Math.max(1,players.size)} online`);
    $("zoneConnectionBadge").dataset.state="online";
  },error=>{
    $("zoneConnectionBadge").dataset.state="error";
    if(error?.code==="permission-denied")showPermissionHelp(error);
    else showGate("Realtime Zone ขัดข้อง",error?.message||String(error),"error");
  });
}

function listenMessages(){
  if(messagesUnsub)messagesUnsub();

  const q=query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(60));
  messagesUnsub=onSnapshot(q,snap=>{
    const latest=new Map();
    snap.docs.forEach(d=>{
      const m={id:d.id,...d.data()};
      if(m.zoneId!==ZONE_ID)return;
      if(!latest.has(m.uid))latest.set(m.uid,m);
    });
    messagesByUid=latest;
  },error=>{
    if(error?.code==="permission-denied")showPermissionHelp(error);
    else console.warn("messages:",error);
  });
}

async function sendMessage(text){
  const clean=String(text||"").trim().slice(0,120);
  if(blocked||!clean||!uid||!profile)return;
  if(Date.now()-lastChatAt<900)return;
  lastChatAt=Date.now();

  try{
    await addDoc(collection(db,"zone_messages"),{
      uid,
      studentId:String(profile.studentId||""),
      text:clean,
      zoneId:ZONE_ID,
      createdAt:serverTimestamp()
    });
  }catch(error){
    if(error?.code==="permission-denied")showPermissionHelp(error);
    else console.warn("chat:",error);
  }
}

$("zoneChatForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const input=$("zoneChatInput");
  const text=input.value;
  input.value="";
  await sendMessage(text);
  input.focus({preventScroll:true});
});

function startMove(dir){
  if(blocked)return;
  if(dir==="left"){movingLeft=true;me.direction="left"}
  if(dir==="right"){movingRight=true;me.direction="right"}
}

function stopMove(dir){
  if(dir==="left")movingLeft=false;
  if(dir==="right")movingRight=false;
  me.moving=movingLeft||movingRight;
  publishPosition(true);
}

function bindHold(button,dir){
  button.style.touchAction="none";
  button.addEventListener("pointerdown",e=>{
    e.preventDefault();
    button.setPointerCapture?.(e.pointerId);
    startMove(dir);
  });
  const stop=()=>stopMove(dir);
  button.addEventListener("pointerup",stop);
  button.addEventListener("pointercancel",stop);
  button.addEventListener("pointerleave",stop);
  button.addEventListener("lostpointercapture",stop);
}

bindHold($("moveLeftButton"),"left");
bindHold($("moveRightButton"),"right");

window.addEventListener("keydown",e=>{
  if(document.activeElement===$("zoneChatInput"))return;
  const k=e.key.toLowerCase();
  if(k==="a"||k==="arrowleft"){e.preventDefault();startMove("left")}
  if(k==="d"||k==="arrowright"){e.preventDefault();startMove("right")}
  if(k==="enter")$("zoneChatInput").focus({preventScroll:true});
});
window.addEventListener("keyup",e=>{
  const k=e.key.toLowerCase();
  if(k==="a"||k==="arrowleft")stopMove("left");
  if(k==="d"||k==="arrowright")stopMove("right");
});

function update(dt){
  if(blocked)return;
  let dx=0;
  if(movingLeft)dx-=1;
  if(movingRight)dx+=1;
  me.moving=dx!==0;
  if(!dx)return;

  me.x=Math.max(70,Math.min(WORLD.width-70,me.x+dx*PLAYER_SPEED*dt));
  publishPosition(false);
}

function resizeCanvas(){
  const rect=canvas.getBoundingClientRect();
  const dpr=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.max(1,Math.round(rect.width*dpr));
  canvas.height=Math.max(1,Math.round(rect.height*dpr));
}

function cameraX(){
  const scale=canvas.clientHeight/WORLD.height;
  const visibleW=canvas.clientWidth/Math.max(.01,scale);
  return Math.max(0,Math.min(WORLD.width-visibleW,me.x-visibleW/2));
}

function rr(c,x,y,w,h,r){
  c.beginPath();
  c.roundRect(x,y,w,h,r);
}

function drawThaiHouse(c,x,y,w,h,wall,roof,label,day){
  c.save();
  c.fillStyle=day?"rgba(67,51,33,.20)":"rgba(0,0,0,.24)";
  rr(c,x+18,y+h-8,w-5,22,8);c.fill();

  c.fillStyle=wall;rr(c,x,y+70,w,h-70,10);c.fill();
  c.fillStyle="#d6a765";
  for(let px=x+25;px<x+w-20;px+=65)c.fillRect(px,y+85,9,h-95);

  c.fillStyle=roof;
  c.beginPath();
  c.moveTo(x-30,y+90);c.lineTo(x+w*.5,y);c.lineTo(x+w+30,y+90);
  c.lineTo(x+w,y+112);c.lineTo(x,y+112);c.closePath();c.fill();

  c.strokeStyle="rgba(255,255,255,.12)";c.lineWidth=4;
  for(let i=0;i<8;i++){
    const px=x+30+i*(w-60)/7;
    c.beginPath();c.moveTo(x+w*.5,y+8);c.lineTo(px,y+103);c.stroke();
  }

  for(let i=0;i<3;i++){
    const wx=x+48+i*(w-120)/2;
    c.fillStyle=day?"#9bd1ef":"#f5c562";
    c.fillRect(wx,y+135,50,48);
    c.strokeStyle="#70452d";c.lineWidth=5;c.strokeRect(wx,y+135,50,48);
  }

  c.fillStyle="#4d2f24";rr(c,x+w*.44,y+166,58,h-170,5);c.fill();
  c.fillStyle="rgba(17,34,43,.9)";rr(c,x+w*.5-78,y+215,156,38,8);c.fill();
  c.fillStyle="#ffe3a0";c.font="700 16px system-ui";c.textAlign="center";c.fillText(label,x+w*.5,y+240);
  c.restore();
}

function drawMarketStall(c,x,y,w,h,awning,label,isShop=false,day=false){
  c.save();
  if(isShop){c.shadowColor="#ffd25b";c.shadowBlur=day?14:25}
  c.fillStyle="#553725";rr(c,x,y+35,w,h-35,8);c.fill();
  c.fillStyle=awning;
  c.beginPath();c.moveTo(x-10,y+35);c.lineTo(x+18,y);c.lineTo(x+w-18,y);c.lineTo(x+w+10,y+35);c.closePath();c.fill();
  c.fillStyle="#e9eee5";
  for(let i=0;i<6;i++)c.fillRect(x+15+i*(w-30)/6,y+4,(w-30)/12,30);
  c.fillStyle="#b87931";c.fillRect(x+12,y+h-35,w-24,24);

  ["#f1b746","#7bbc55","#df704e","#b878d0","#58a5c9"].forEach((color,i)=>{
    c.fillStyle=color;c.beginPath();c.arc(x+55+i*47,y+h-48,17,0,Math.PI*2);c.fill();
  });

  c.shadowBlur=0;
  c.fillStyle=isShop?"#fff1a6":"#fff1c8";
  c.font=isShop?"900 18px system-ui":"700 15px system-ui";
  c.textAlign="center";c.fillText(label,x+w/2,y+82);

  if(isShop){
    c.strokeStyle="#ffd65c";c.lineWidth=3;rr(c,x-10,y-10,w+20,h+20,14);c.stroke();
  }
  c.restore();
}

function drawLantern(c,x,y,day){
  c.save();
  c.fillStyle=day?"rgba(255,170,55,.05)":"rgba(255,163,59,.14)";
  c.beginPath();c.arc(x,y,46,0,Math.PI*2);c.fill();
  c.strokeStyle="#34251e";c.lineWidth=5;c.beginPath();c.moveTo(x,y-55);c.lineTo(x,y-20);c.stroke();
  c.fillStyle="#e65d3b";rr(c,x-17,y-20,34,42,10);c.fill();
  c.fillStyle=day?"#f4b74a":"#ffd46f";rr(c,x-10,y-13,20,28,7);c.fill();
  c.restore();
}

function drawWorld(){
  const time=worldTimeState();
  const day=time.isDay;
  const scale=canvas.clientHeight/WORLD.height;
  const cam=cameraX();

  ctx.save();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.scale(canvas.width/canvas.clientWidth,canvas.height/canvas.clientHeight);
  ctx.scale(scale,scale);
  ctx.translate(-cam,0);

  const sky=ctx.createLinearGradient(0,0,0,590);
  if(day){
    sky.addColorStop(0,"#6bc5f1");
    sky.addColorStop(.56,"#aee0f2");
    sky.addColorStop(1,"#d9f0d1");
  }else{
    sky.addColorStop(0,"#06182b");
    sky.addColorStop(.52,"#0d3555");
    sky.addColorStop(1,"#21586d");
  }
  ctx.fillStyle=sky;ctx.fillRect(0,0,WORLD.width,WORLD.height);

  if(day){
    ctx.fillStyle="rgba(255,228,88,.18)";ctx.beginPath();ctx.arc(1510,120,95,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ffe064";ctx.beginPath();ctx.arc(1510,120,54,0,Math.PI*2);ctx.fill();

    ctx.fillStyle="rgba(255,255,255,.75)";
    for(const [x,y,w] of [[300,120,150],[900,180,190],[2020,110,170],[2600,185,150]]){
      ctx.beginPath();ctx.ellipse(x,y,w*.35,28,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(x+w*.25,y-8,w*.25,35,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(x+w*.5,y+3,w*.32,25,0,0,Math.PI*2);ctx.fill();
    }
  }else{
    ctx.fillStyle="rgba(255,245,190,.11)";ctx.beginPath();ctx.arc(1510,120,95,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff1bd";ctx.beginPath();ctx.arc(1510,120,56,0,Math.PI*2);ctx.fill();

    ctx.fillStyle="rgba(255,255,235,.82)";
    for(let x=55;x<WORLD.width;x+=83){
      const y=45+((x*37)%265);ctx.fillRect(x,y,2+(x%3),2+(x%2));
    }
  }

  ctx.fillStyle=day?"#2d6a3d":"#08291f";
  for(let x=-40;x<WORLD.width;x+=86){
    const h=80+Math.abs((x*13)%65);
    ctx.beginPath();ctx.arc(x,420-h*.45,65,0,Math.PI*2);ctx.fill();
    ctx.fillRect(x-13,420-h*.25,26,h*.4);
  }

  ctx.fillStyle=day?"#6f9d58":"#263c35";ctx.fillRect(0,520,WORLD.width,380);
  ctx.fillStyle=day?"#b5a78b":"#4b5860";ctx.fillRect(0,625,WORLD.width,220);

  ctx.strokeStyle=day?"rgba(93,78,58,.17)":"rgba(255,255,255,.075)";
  ctx.lineWidth=3;
  for(let x=0;x<WORLD.width;x+=95){ctx.beginPath();ctx.moveTo(x,630);ctx.lineTo(x+35,840);ctx.stroke()}
  for(let y=650;y<845;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.width,y);ctx.stroke()}

  drawThaiHouse(ctx,120,340,420,250,"#8d3d2f","#244f68","LEARNING HOUSE",day);
  drawMarketStall(ctx,650,465,320,155,"#e6a33b","TOKEN SHOP",true,day);
  drawThaiHouse(ctx,1070,315,440,275,"#6b3e2e","#5a3572","CODING HOUSE",day);
  drawMarketStall(ctx,1710,470,310,150,"#5aa174","MARKET",false,day);
  drawThaiHouse(ctx,2200,335,390,255,"#8a4c2b","#1d5872","PVP INN",day);
  drawThaiHouse(ctx,2650,355,300,235,"#63422f","#33536a","RANK HALL",day);

  [570,1010,1580,2070,2600].forEach(x=>drawLantern(ctx,x,500,day));

  ctx.fillStyle=day?"#337448":"#163f2e";
  for(let x=15;x<WORLD.width;x+=140){
    ctx.beginPath();ctx.arc(x,575,34,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+30,585,28,0,Math.PI*2);ctx.fill();
  }

  const list=[...players.values()].sort((a,b)=>Number(a.x||0)-Number(b.x||0));
  if(!list.some(p=>p.uid===uid)){
    list.push({
      uid,
      studentId:profile?.studentId,
      rank:profile?.rank,
      character:{gender:profile?.character?.gender,equipped:equipped(profile?.character)},
      x:me.x,
      direction:me.direction
    });
  }

  for(const p of list)drawCharacter(ctx,p,Number(p.x||0),WALK_Y,1,true);
  ctx.restore();
}

function drawRankShield(c,x,y,rank){
  const r=rankMeta(rank);
  c.save();c.translate(x,y);c.fillStyle=r.color;
  c.beginPath();c.moveTo(-11,-8);c.lineTo(11,-8);c.lineTo(9,6);c.lineTo(0,14);c.lineTo(-9,6);c.closePath();c.fill();
  c.fillStyle="#fff";c.font="900 10px system-ui";c.textAlign="center";c.fillText(r.letter,0,2);c.restore();
}

function drawCharacter(c,p,x,y,scale=1,drawName=true){
  const char=p.character||{};
  const eq=equipped(char);
  const gender=char.gender==="female"?"female":"male";
  const isMe=p.uid===uid;
  const facing=p.direction==="left"?-1:1;

  c.save();c.translate(x,y);c.scale(scale,scale);

  const back=itemById(eq.back);
  const aura=itemById(eq.aura);
  const head=itemById(eq.head);
  const face=itemById(eq.face);
  const top=itemById(eq.top);
  const hand=itemById(eq.hand);
  const shoes=itemById(eq.shoes);
  const pet=itemById(eq.pet);

  if(aura?.visual==="gold_aura"){
    c.strokeStyle="rgba(255,217,70,.76)";c.lineWidth=7;c.shadowColor="#ffd84d";c.shadowBlur=18;
    c.beginPath();c.ellipse(0,-38,48,78,0,0,Math.PI*2);c.stroke();c.shadowBlur=0;
  }
  if(aura?.visual==="master_halo"){
    c.strokeStyle="#62d9ff";c.lineWidth=6;c.shadowColor="#62d9ff";c.shadowBlur=14;
    c.beginPath();c.ellipse(0,-103,40,12,0,0,Math.PI*2);c.stroke();c.shadowBlur=0;
  }
  if(aura?.visual==="throne"){
    c.fillStyle="#54234c";rr(c,-65,-102,130,145,38);c.fill();
    c.strokeStyle="#e6bd44";c.lineWidth=6;c.stroke();
  }

  if(back?.visual==="backpack"){
    c.fillStyle="#315f89";rr(c,-36,-54,72,72,18);c.fill();
  }else if(back?.visual==="royal_cape"){
    c.fillStyle="#6d2458";c.beginPath();c.moveTo(-35,-58);c.lineTo(35,-58);c.lineTo(48,39);c.lineTo(0,23);c.lineTo(-48,39);c.closePath();c.fill();
    c.strokeStyle="#e9c148";c.lineWidth=5;c.stroke();
  }else if(back?.visual==="dragon_wings"){
    c.fillStyle="#b33a75";c.shadowColor="#f06a9a";c.shadowBlur=14;
    c.beginPath();c.moveTo(-18,-56);c.lineTo(-80,-105);c.lineTo(-63,-45);c.lineTo(-108,-18);c.lineTo(-49,-2);c.lineTo(-20,28);c.closePath();c.fill();
    c.beginPath();c.moveTo(18,-56);c.lineTo(80,-105);c.lineTo(63,-45);c.lineTo(108,-18);c.lineTo(49,-2);c.lineTo(20,28);c.closePath();c.fill();
    c.shadowBlur=0;
  }

  c.fillStyle="rgba(0,0,0,.24)";c.beginPath();c.ellipse(0,28,27,9,0,0,Math.PI*2);c.fill();
  c.save();c.scale(facing,1);

  c.fillStyle="#e8bd98";c.fillRect(-13,8,9,28);c.fillRect(5,8,9,28);
  c.fillStyle=shoes?.visual==="shoe_white"?"#f7f7f5":"#202a35";
  rr(c,-17,30,16,9,4);c.fill();rr(c,2,30,16,9,4);c.fill();

  c.fillStyle="#315b82";rr(c,-20,-3,40,20,7);c.fill();

  let topColor="#f3f0e8";
  if(top?.visual==="shirt_blue")topColor="#3381b8";
  if(top?.visual==="cyber_jacket")topColor="#142d42";
  c.fillStyle=topColor;rr(c,-22,-45,44,48,13);c.fill();

  if(top?.visual==="cyber_jacket"){
    c.strokeStyle="#29d8e4";c.lineWidth=3;c.stroke();
  }
  if(top?.visual==="thai_sash"){
    c.strokeStyle="#e5524b";c.lineWidth=8;c.beginPath();c.moveTo(-12,-43);c.lineTo(14,1);c.stroke();
    c.strokeStyle="#f0c94e";c.lineWidth=3;c.stroke();
  }

  c.fillStyle="#eabf99";rr(c,-31,-39,10,42,6);c.fill();rr(c,21,-39,10,42,6);c.fill();

  if(gender==="female"){
    c.fillStyle="#2c211d";c.beginPath();c.ellipse(0,-72,27,35,0,0,Math.PI*2);c.fill();
  }

  c.fillStyle="#efc6a0";c.beginPath();c.arc(0,-72,23,0,Math.PI*2);c.fill();
  c.fillStyle="#2c211d";c.beginPath();c.arc(0,-80,24,Math.PI,Math.PI*2);c.fill();
  if(gender==="male"){c.fillRect(-23,-82,8,17);c.fillRect(15,-84,8,19)}
  else{c.fillRect(-24,-80,8,35);c.fillRect(16,-80,8,37)}

  c.fillStyle="#252225";c.fillRect(7,-74,4,4);

  if(face?.visual==="glasses"){
    c.strokeStyle="#27384a";c.lineWidth=3;
    c.beginPath();c.arc(-8,-73,8,0,Math.PI*2);c.stroke();
    c.beginPath();c.arc(9,-73,8,0,Math.PI*2);c.stroke();
    c.beginPath();c.moveTo(0,-73);c.lineTo(2,-73);c.stroke();
  }

  if(head?.visual==="cap"){
    c.fillStyle="#316ca0";rr(c,-25,-101,50,17,8);c.fill();c.fillRect(14,-91,24,6);
  }else if(head?.visual==="gold_crown"){
    c.fillStyle="#e6b82f";c.beginPath();c.moveTo(-25,-94);c.lineTo(-24,-117);c.lineTo(-9,-101);c.lineTo(0,-124);c.lineTo(11,-101);c.lineTo(26,-116);c.lineTo(25,-94);c.closePath();c.fill();
  }else if(head?.visual==="neon_headset"){
    c.strokeStyle="#d846e8";c.lineWidth=7;c.beginPath();c.arc(0,-78,29,Math.PI,0);c.stroke();
  }

  if(hand?.visual==="tablet"){
    c.fillStyle="#132333";rr(c,22,-29,27,37,4);c.fill();
    c.strokeStyle="#42d6ee";c.lineWidth=3;c.stroke();
  }

  c.restore();

  if(pet?.visual==="phoenix_pet"){
    c.fillStyle="#f04e2f";c.shadowColor="#ff9c35";c.shadowBlur=12;
    c.beginPath();c.moveTo(56,-50);c.lineTo(68,-70);c.lineTo(75,-48);c.lineTo(96,-61);c.lineTo(82,-34);c.lineTo(95,-12);c.lineTo(68,-22);c.lineTo(57,-2);c.lineTo(52,-27);c.lineTo(36,-13);c.lineTo(42,-37);c.closePath();c.fill();
    c.shadowBlur=0;
  }

  if(isMe){
    c.strokeStyle="#ffd45e";c.lineWidth=4;c.beginPath();c.ellipse(0,-28,45,78,0,0,Math.PI*2);c.stroke();
  }

  if(drawName){
    const label=String(p.studentId||"USER").slice(0,18);
    c.font="800 14px system-ui";
    const w=Math.max(96,c.measureText(label).width+48);
    c.fillStyle="rgba(5,18,28,.88)";rr(c,-w/2,-145,w,30,10);c.fill();
    c.fillStyle="#fff";c.textAlign="center";c.fillText(label,0,-125);
    drawRankShield(c,-w/2+18,-131,p.rank);

    const items=Object.values(eq).filter(Boolean).map(itemById).filter(Boolean).slice(0,3);
    if(items.length){
      c.fillStyle="rgba(5,18,28,.74)";rr(c,-42,-111,84,25,8);c.fill();
      c.font="15px system-ui";items.forEach((it,i)=>c.fillText(it.icon,-25+i*25,-93));
    }
    drawBubble(c,p);
  }

  c.restore();
}

function drawBubble(c,p){
  const m=messagesByUid.get(p.uid);
  if(!m?.text)return;
  const dt=m.createdAt?.toDate?.();
  if(dt&&Date.now()-dt.getTime()>BUBBLE_MS)return;

  const text=String(m.text).slice(0,120);
  c.font="600 15px system-ui";
  const maxW=250;
  const lines=[];
  let line="";
  for(const ch of [...text]){
    const test=line+ch;
    if(c.measureText(test).width>maxW&&line){lines.push(line);line=ch}
    else line=test;
  }
  if(line)lines.push(line);

  const visible=lines.slice(0,3);
  const bw=Math.min(maxW+28,Math.max(120,...visible.map(t=>c.measureText(t).width+28)));
  const bh=18+visible.length*22;
  const by=-166-bh;

  c.fillStyle="rgba(255,255,255,.97)";rr(c,-bw/2,by,bw,bh,14);c.fill();
  c.strokeStyle="rgba(30,55,73,.18)";c.lineWidth=2;c.stroke();
  c.fillStyle="#19364a";c.textAlign="center";c.font="600 15px system-ui";
  visible.forEach((ln,i)=>c.fillText(ln,0,by+25+i*22));
}

function render(){drawWorld()}

function loop(now){
  const dt=Math.min(.04,(now-lastFrame)/1000);
  lastFrame=now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function canvasToWorld(clientX,clientY){
  const rect=canvas.getBoundingClientRect();
  const scale=rect.height/WORLD.height;
  return {
    x:(clientX-rect.left)/scale+cameraX(),
    y:(clientY-rect.top)/scale
  };
}

canvas.addEventListener("click",e=>{
  const pt=canvasToWorld(e.clientX,e.clientY);

  if(pt.x>=620&&pt.x<=1010&&pt.y>=430&&pt.y<=650){
    openShop();
    return;
  }

  let selected=null,best=9999;
  for(const p of players.values()){
    const d=Math.hypot(Number(p.x||0)-pt.x,WALK_Y-pt.y);
    if(d<60&&d<best){selected=p;best=d}
  }
  if(selected)openPlayerCard(selected);
});

function openPlayerCard(p){
  $("zonePlayerCardId").textContent=p.studentId||"USER";
  $("zonePlayerCardShield").innerHTML=rankShieldHTML(p.rank);
  $("zonePlayerCardRank").textContent=`${p.rank?.tierName||"Bronze"} · ${Number(p.rank?.rating||0)} Rating`;

  const list=equippedItems(p.character);
  $("zonePlayerCardItems").innerHTML=list.length
    ? list.map(({item})=>`<div><span>${item.icon}</span><small>${esc(item.name)}</small></div>`).join("")
    : `<div class="empty-mini">ยังไม่ได้สวมไอเท็ม</div>`;

  $("zonePlayerCard").classList.remove("hidden");
}
$("closeZonePlayerCard").onclick=()=>$("zonePlayerCard").classList.add("hidden");

function renderShop(){
  if(!profile)return;
  const owned=new Set(profile.inventory||[]);
  const eq=equipped(profile.character);
  const equippedIds=new Set(Object.values(eq).filter(Boolean));
  const balance=Number(profile.tokenBalance||0);

  $("zoneTokenBalance").textContent=balance.toLocaleString();
  $("zoneShopBalance").textContent=balance.toLocaleString();

  const items=[...REWARD_ITEMS].sort((a,b)=>
    (RARITY_META[a.rarity]?.order||0)-(RARITY_META[b.rarity]?.order||0)||a.cost-b.cost
  );

  $("zoneShopGrid").innerHTML=items.map(item=>{
    const own=owned.has(item.id);
    const wearing=equippedIds.has(item.id);
    return `<article class="zone-shop-item rarity-${item.rarity} ${wearing?"wearing":""}">
      <div class="zone-shop-rarity">${RARITY_META[item.rarity]?.name||item.rarity}</div>
      <div class="zone-shop-icon">${item.icon}</div>
      <strong>${esc(item.name)}</strong>
      <small>${esc(item.description)}</small>
      <em>${item.cost.toLocaleString()} Token</em>
      <button class="btn ${wearing?"ghost":own?"secondary":"zone-buy-btn"}"
        data-zone-shop-item="${item.id}" ${!own&&balance<item.cost?"disabled":""}>
        ${wearing?"ถอด":own?"สวมใส่":balance<item.cost?"Token ไม่พอ":"แลกไอเท็ม"}
      </button>
    </article>`;
  }).join("");

  document.querySelectorAll("[data-zone-shop-item]:not([disabled])").forEach(btn=>{
    btn.onclick=()=>handleShopItem(btn.dataset.zoneShopItem);
  });
}

async function refreshProfile(){
  const snap=await getDoc(doc(db,"users",uid));
  if(snap.exists())profile={uid,...snap.data()};
  renderShop();
  await syncPublicProfile();
  await publishPosition(true);
}

async function handleShopItem(itemId){
  const item=itemById(itemId);
  if(!item||!profile)return;
  const userRef=doc(db,"users",uid);
  const owned=(profile.inventory||[]).includes(itemId);

  if(!owned){
    try{
      await runTransaction(db,async tx=>{
        const snap=await tx.get(userRef);
        if(!snap.exists())throw new Error("ไม่พบข้อมูล User");
        const d=snap.data();
        const balance=Number(d.tokenBalance||0);
        const inv=Array.isArray(d.inventory)?d.inventory:[];
        if(inv.includes(itemId))return;
        if(balance<item.cost)throw new Error("Token ไม่พอ");

        tx.update(userRef,{
          tokenBalance:balance-item.cost,
          inventory:[...inv,itemId],
          updatedAt:serverTimestamp()
        });
      });
      await refreshProfile();
    }catch(error){alert(error.message)}
    return;
  }

  const current=equipped(profile.character);
  current[item.slot]=current[item.slot]===itemId?null:itemId;

  const character={
    ...DEFAULT_CHARACTER,
    ...(profile.character||{}),
    equipped:current
  };

  await updateDoc(userRef,{character,updatedAt:serverTimestamp()});
  profile.character=character;
  renderShop();
  await syncPublicProfile();
  await publishPosition(true);
  drawOwnProfile();
}

function openShop(){
  renderShop();
  $("zoneShopModal").classList.remove("hidden");
}
$("openZoneShop").onclick=openShop;
$("closeZoneShop").onclick=()=>$("zoneShopModal").classList.add("hidden");

function drawOwnProfile(){
  if(!profile)return;
  profileCtx.clearRect(0,0,profileCanvas.width,profileCanvas.height);

  const time=worldTimeState();
  const bg=profileCtx.createLinearGradient(0,0,0,430);
  if(time.isDay){
    bg.addColorStop(0,"#7fcdf0");bg.addColorStop(1,"#6e9b59");
  }else{
    bg.addColorStop(0,"#102f47");bg.addColorStop(1,"#315e52");
  }
  profileCtx.fillStyle=bg;profileCtx.fillRect(0,0,420,430);

  const p={
    uid,
    studentId:profile.studentId,
    rank:profile.rank,
    character:{gender:profile.character?.gender,equipped:equipped(profile.character)},
    direction:"right"
  };
  drawCharacter(profileCtx,p,210,345,1.65,false);
}

$("openMyZoneProfile").onclick=()=>{
  $("zoneProfileStudentId").textContent=profile?.studentId||"-";
  drawOwnProfile();
  $("zoneMyProfileModal").classList.remove("hidden");
};
$("closeMyZoneProfile").onclick=()=>$("zoneMyProfileModal").classList.add("hidden");

async function leaveZone(){
  clearInterval(heartbeat);
  clearInterval(clockTimer);

  try{
    await updateDoc(doc(db,"zone_positions",uid),{online:false,updatedAt:serverTimestamp()});
  }catch{}

  try{
    await setDoc(doc(db,"presence",uid),{online:false,lastSeenAt:serverTimestamp()},{merge:true});
  }catch{}

  try{
    await updateDoc(doc(db,"users",uid),{
      zone:{
        zoneId:ZONE_ID,
        x:Math.round(me.x),
        y:WALK_Y,
        direction:me.direction,
        lastSeenAt:new Date().toISOString()
      }
    });
  }catch{}
}

window.addEventListener("resize",resizeCanvas);
window.addEventListener("pagehide",leaveZone);
$("leaveZoneButton").addEventListener("click",()=>leaveZone());

onAuthStateChanged(auth,async user=>{
  setBootStep("auth","loading","กำลังตรวจสอบ");

  if(!user){
    setBootStep("auth","error","ยังไม่ได้ Login");
    showGate("กรุณา Login ก่อน","2D Zone ใช้บัญชี User ที่ลงทะเบียนแล้ว","login");
    return;
  }

  if(user.uid===ADMIN_UID){
    location.replace("./admin.html");
    return;
  }

  uid=user.uid;
  setBootStep("auth","ok","Login แล้ว");

  const okProfile=await loadProfile();
  if(!okProfile)return;

  const allowed=await checkModerationBeforeEntry();
  if(!allowed)return;

  blocked=false;
  $("zoneGate").classList.add("hidden");
  $("zoneApp").classList.remove("hidden");

  $("zoneMyStudentId").textContent=profile.studentId||"-";
  $("zoneMyShield").innerHTML=rankShieldHTML(profile.rank);
  $("zoneTokenBalance").textContent=Number(profile.tokenBalance||0).toLocaleString();

  startWorldClock();
  resizeCanvas();

  listenModeration();
  listenPositions();
  listenMessages();

  await syncPublicProfile();
  await publishPresence();
  await publishPosition(true);

  heartbeat=setInterval(async()=>{
    await publishPresence();
    await publishPosition(true);
  },PRESENCE_HEARTBEAT_MS);

  requestAnimationFrame(loop);
});
