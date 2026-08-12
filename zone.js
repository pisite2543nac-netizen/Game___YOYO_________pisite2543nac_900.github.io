import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc,
  collection, onSnapshot, serverTimestamp, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { REWARD_ITEMS } from "./reward-data.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const $ = id => document.getElementById(id);

const canvas = $("socialCanvas");
const ctx = canvas.getContext("2d");

const WORLD = {width:2800,height:900};
const WALK_Y = 690;
const PLAYER_SPEED = 240;
const POS_SEND_MS = 90;
const ONLINE_STALE_MS = 100000;
const CHAT_BUBBLE_MS = 9000;

let uid = null;
let profile = null;
let players = new Map();
let messagesByUid = new Map();
let zoneUnsub = null;
let messageUnsub = null;
let lastFrame = performance.now();
let lastSend = 0;
let lastChatAt = 0;
let movingLeft = false;
let movingRight = false;

const me = {x:420,y:WALK_Y,direction:"right",moving:false};

function esc(v){
  return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function initials(name){
  return (String(name||"?").trim()[0]||"?").toUpperCase();
}

function tier(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase();
  const map={
    bronze:["Bronze","B"],silver:["Silver","S"],gold:["Gold","G"],
    platinum:["Platinum","P"],diamond:["Diamond","D"],master:["Master","M"]
  };
  const x=map[id]||map.bronze;
  return {id,name:x[0],letter:x[1]};
}

function shieldHTML(rank,size="normal"){
  const t=tier(rank);
  return `<span class="rank-shield rank-${t.id} ${size}">
    <span class="rank-shield-letter">${t.letter}</span>
  </span>`;
}

function ownedShowcase(p){
  const inventory=Array.isArray(p?.inventory)?p.inventory:[];
  return inventory.slice(0,3)
    .map(id=>REWARD_ITEMS.find(x=>x.id===id))
    .filter(Boolean);
}

function publicCharacterData(){
  return {
    gender:profile?.character?.gender||"male",
    showcaseItemIds:ownedShowcase(profile).map(x=>x.id)
  };
}

async function chooseGender(gender){
  if(!uid||!profile)return;
  const character={...(profile.character||{}),gender};
  profile.character=character;

  await updateDoc(doc(db,"users",uid),{
    character,
    updatedAt:serverTimestamp()
  });

  await setDoc(doc(db,"public_profiles",uid),{
    uid,
    fullName:profile.fullName,
    rank:profile.rank||null,
    character:publicCharacterData(),
    updatedAt:serverTimestamp()
  },{merge:true});

  $("genderSetup").classList.add("hidden");
  await publish(true);
}

function needsGender(){
  const g=profile?.character?.gender;
  return g!=="male" && g!=="female";
}

async function enterZone(){
  const snap=await getDoc(doc(db,"users",uid));
  if(!snap.exists()){location.href="index.html";return;}

  profile={uid,...snap.data()};
  const saved=profile.zone||{};
  me.x=Math.max(120,Math.min(WORLD.width-120,Number(saved.x)||420));
  me.direction=saved.direction==="left"?"left":"right";

  $("zoneGate").classList.add("hidden");
  $("socialZoneApp").classList.remove("hidden");
  $("zoneMyName").textContent=profile.fullName||"Player";
  $("zoneMyShield").innerHTML=shieldHTML(profile.rank);

  if(needsGender()) $("genderSetup").classList.remove("hidden");

  await publish(true);
  listenPlayers();
  listenMessages();
  resizeCanvas();
  requestAnimationFrame(loop);
}

async function publish(force=false){
  if(!uid||!profile)return;
  const now=performance.now();
  if(!force && now-lastSend<POS_SEND_MS)return;
  lastSend=now;

  const charData=publicCharacterData();

  try{
    await setDoc(doc(db,"zone_positions",uid),{
      uid,
      fullName:profile.fullName,
      rank:profile.rank||null,
      character:charData,
      inventoryShowcase:charData.showcaseItemIds,
      zoneId:"thai_night_social",
      x:Math.round(me.x*10)/10,
      y:WALK_Y,
      direction:me.direction,
      moving:me.moving,
      online:true,
      updatedAt:serverTimestamp()
    },{merge:true});

    await setDoc(doc(db,"presence",uid),{
      uid,
      fullName:profile.fullName,
      rank:profile.rank||null,
      area:"zone",
      online:true,
      lastSeenAt:serverTimestamp()
    },{merge:true});

    await setDoc(doc(db,"public_profiles",uid),{
      uid,
      fullName:profile.fullName,
      rank:profile.rank||null,
      character:charData,
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){
    console.warn("publish:",error);
  }
}

function isPlayerOnline(p){
  const dt=p.updatedAt?.toDate?.();
  return !dt || Date.now()-dt.getTime()<ONLINE_STALE_MS;
}

function listenPlayers(){
  if(zoneUnsub)zoneUnsub();
  zoneUnsub=onSnapshot(collection(db,"zone_positions"),snap=>{
    players.clear();
    snap.docs.forEach(d=>{
      const p={id:d.id,...d.data()};
      if(p.zoneId!=="thai_night_social" || !p.online || !isPlayerOnline(p))return;
      players.set(d.id,p);
    });
    $("zoneOnlineCount").textContent=Math.max(1,players.size);
  });
}

function listenMessages(){
  if(messageUnsub)messageUnsub();
  const q=query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(40));
  messageUnsub=onSnapshot(q,snap=>{
    const latest=new Map();
    snap.docs.forEach(d=>{
      const m={id:d.id,...d.data()};
      if(m.zoneId!=="thai_night_social")return;
      if(!latest.has(m.uid))latest.set(m.uid,m);
    });
    messagesByUid=latest;
  });
}

async function sendMessage(text){
  const clean=String(text||"").trim().slice(0,120);
  if(!clean||!uid||!profile)return;
  const now=Date.now();
  if(now-lastChatAt<900)return;
  lastChatAt=now;

  await addDoc(collection(db,"zone_messages"),{
    uid,
    fullName:profile.fullName,
    text:clean,
    zoneId:"thai_night_social",
    createdAt:serverTimestamp()
  });
}

$("zoneChatForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const input=$("zoneChatInput");
  const text=input.value;
  input.value="";
  try{await sendMessage(text)}catch(error){console.warn(error)}
  input.focus();
});

$("chooseMale").onclick=()=>chooseGender("male");
$("chooseFemale").onclick=()=>chooseGender("female");
$("closeProfileCard").onclick=()=>$("playerProfileCard").classList.add("hidden");

function startMove(dir){
  if(dir==="left"){movingLeft=true;me.direction="left"}
  if(dir==="right"){movingRight=true;me.direction="right"}
}
function stopMove(dir){
  if(dir==="left")movingLeft=false;
  if(dir==="right")movingRight=false;
}

function bindHold(button,dir){
  button.addEventListener("pointerdown",e=>{
    e.preventDefault();
    button.setPointerCapture?.(e.pointerId);
    startMove(dir);
  });
  button.addEventListener("pointerup",()=>stopMove(dir));
  button.addEventListener("pointercancel",()=>stopMove(dir));
  button.addEventListener("pointerleave",()=>stopMove(dir));
}
bindHold($("moveLeftButton"),"left");
bindHold($("moveRightButton"),"right");

window.addEventListener("keydown",e=>{
  if(document.activeElement===$("zoneChatInput"))return;
  const k=e.key.toLowerCase();
  if(k==="a"||k==="arrowleft"){e.preventDefault();startMove("left")}
  if(k==="d"||k==="arrowright"){e.preventDefault();startMove("right")}
  if(k==="enter"){$("zoneChatInput").focus()}
});
window.addEventListener("keyup",e=>{
  const k=e.key.toLowerCase();
  if(k==="a"||k==="arrowleft")stopMove("left");
  if(k==="d"||k==="arrowright")stopMove("right");
});

function update(dt){
  let dx=0;
  if(movingLeft)dx-=1;
  if(movingRight)dx+=1;
  me.moving=dx!==0;
  if(!dx)return;

  me.x=Math.max(70,Math.min(WORLD.width-70,me.x+dx*PLAYER_SPEED*dt));
  publish();
}

function cameraX(){
  const viewW=canvas.clientWidth;
  const scale=canvas.clientHeight/WORLD.height;
  const visibleW=viewW/scale;
  return Math.max(0,Math.min(WORLD.width-visibleW,me.x-visibleW/2));
}

function resizeCanvas(){
  const rect=canvas.getBoundingClientRect();
  const dpr=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.max(1,Math.round(rect.width*dpr));
  canvas.height=Math.max(1,Math.round(rect.height*dpr));
}

function rr(x,y,w,h,r){
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
}

function drawNightWorld(){
  const scale=canvas.clientHeight/WORLD.height;
  const camX=cameraX();

  ctx.save();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const sx=canvas.width/canvas.clientWidth;
  const sy=canvas.height/canvas.clientHeight;
  ctx.scale(sx,sy);
  ctx.scale(scale,scale);
  ctx.translate(-camX,0);

  // night sky
  const sky=ctx.createLinearGradient(0,0,0,570);
  sky.addColorStop(0,"#07192d");
  sky.addColorStop(.55,"#0d3555");
  sky.addColorStop(1,"#22556c");
  ctx.fillStyle=sky;ctx.fillRect(0,0,WORLD.width,900);

  // moon glow
  ctx.fillStyle="rgba(255,245,190,.10)";
  ctx.beginPath();ctx.arc(1390,125,95,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#fff1bd";
  ctx.beginPath();ctx.arc(1390,125,56,0,Math.PI*2);ctx.fill();

  // stars
  ctx.fillStyle="rgba(255,255,235,.82)";
  for(let x=60;x<WORLD.width;x+=87){
    const y=45+((x*37)%270);
    ctx.fillRect(x,y,2+(x%3),2+(x%2));
  }

  // distant tree line
  ctx.fillStyle="#09291f";
  for(let x=-40;x<WORLD.width;x+=85){
    const h=80+((x*13)%65);
    ctx.beginPath();ctx.arc(x,420-h*.45,65,0,Math.PI*2);ctx.fill();
    ctx.fillRect(x-13,420-h*.25,26,h*.4);
  }

  // ground
  ctx.fillStyle="#263c35";ctx.fillRect(0,520,WORLD.width,380);
  ctx.fillStyle="#4b5860";ctx.fillRect(0,625,WORLD.width,210);

  // stone street
  ctx.strokeStyle="rgba(255,255,255,.08)";ctx.lineWidth=3;
  for(let x=0;x<WORLD.width;x+=95){
    ctx.beginPath();ctx.moveTo(x,630);ctx.lineTo(x+35,830);ctx.stroke();
  }
  for(let y=650;y<835;y+=45){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.width,y);ctx.stroke();
  }

  drawThaiHouse(120,340,420,250,"#8d3d2f","#244f68","บ้านเรียนรู้");
  drawMarketStall(650,465,300,155,"#e6a33b","ตลาด Token");
  drawThaiHouse(1050,315,440,275,"#6b3e2e","#5a3572","Coding House");
  drawShrine(1605,390);
  drawMarketStall(1900,470,310,150,"#5aa174","ตลาดกลางคืน");
  drawThaiHouse(2290,335,390,255,"#8a4c2b","#1d5872","PVP Inn");

  // lanterns
  [570,990,1515,1830,2250].forEach(x=>drawLantern(x,500));

  // plants foreground
  ctx.fillStyle="#163f2e";
  for(let x=15;x<WORLD.width;x+=140){
    ctx.beginPath();ctx.arc(x,575,34,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+30,585,28,0,Math.PI*2);ctx.fill();
  }

  ctx.restore();
}

function drawThaiHouse(x,y,w,h,wall,roof,label){
  ctx.save();
  ctx.fillStyle="rgba(0,0,0,.2)";
  rr(x+18,y+h-8,w-5,22,8);ctx.fill();

  // structure
  ctx.fillStyle=wall;
  rr(x,y+70,w,h-70,10);ctx.fill();
  ctx.fillStyle="#d6a765";
  for(let px=x+25;px<x+w-20;px+=65)ctx.fillRect(px,y+85,9,h-95);

  // roof
  ctx.fillStyle=roof;
  ctx.beginPath();
  ctx.moveTo(x-30,y+90);ctx.lineTo(x+w*.5,y);ctx.lineTo(x+w+30,y+90);
  ctx.lineTo(x+w,y+112);ctx.lineTo(x,y+112);ctx.closePath();ctx.fill();

  // roof stripes
  ctx.strokeStyle="rgba(255,255,255,.13)";ctx.lineWidth=4;
  for(let i=0;i<8;i++){
    const px=x+30+i*(w-60)/7;
    ctx.beginPath();ctx.moveTo(x+w*.5,y+8);ctx.lineTo(px,y+103);ctx.stroke();
  }

  // windows
  for(let i=0;i<3;i++){
    const wx=x+48+i*(w-120)/2;
    ctx.fillStyle="#f5c562";ctx.fillRect(wx,y+135,50,48);
    ctx.strokeStyle="#70452d";ctx.lineWidth=5;ctx.strokeRect(wx,y+135,50,48);
  }

  // door
  ctx.fillStyle="#4d2f24";rr(x+w*.44,y+166,58,h-170,5);ctx.fill();
  ctx.fillStyle="#f5bf4c";ctx.beginPath();ctx.arc(x+w*.44+46,y+h-35,4,0,Math.PI*2);ctx.fill();

  // sign
  ctx.fillStyle="rgba(17,34,43,.85)";rr(x+w*.5-78,y+215,156,38,8);ctx.fill();
  ctx.fillStyle="#ffe3a0";ctx.font="700 16px system-ui";ctx.textAlign="center";ctx.fillText(label,x+w*.5,y+240);
  ctx.restore();
}

function drawMarketStall(x,y,w,h,awning,label){
  ctx.save();
  ctx.fillStyle="#553725";rr(x,y+35,w,h-35,8);ctx.fill();
  ctx.fillStyle=awning;
  ctx.beginPath();ctx.moveTo(x-10,y+35);ctx.lineTo(x+18,y);ctx.lineTo(x+w-18,y);ctx.lineTo(x+w+10,y+35);ctx.closePath();ctx.fill();
  ctx.fillStyle="#e9eee5";
  for(let i=0;i<6;i++)ctx.fillRect(x+15+i*(w-30)/6,y+4,(w-30)/12,30);
  ctx.fillStyle="#b87931";ctx.fillRect(x+12,y+h-35,w-24,24);

  // goods
  ["#f1b746","#7bbc55","#df704e","#b878d0","#58a5c9"].forEach((c,i)=>{
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(x+55+i*47,y+h-48,17,0,Math.PI*2);ctx.fill();
  });
  ctx.fillStyle="#fff1c8";ctx.font="700 15px system-ui";ctx.textAlign="center";ctx.fillText(label,x+w/2,y+82);
  ctx.restore();
}

function drawShrine(x,y){
  ctx.save();
  ctx.fillStyle="#f2e7d0";rr(x,y+60,210,180,8);ctx.fill();
  ctx.fillStyle="#c54230";
  ctx.beginPath();ctx.moveTo(x-24,y+75);ctx.lineTo(x+105,y);ctx.lineTo(x+234,y+75);ctx.closePath();ctx.fill();
  ctx.fillStyle="#e8b842";ctx.fillRect(x+96,y+66,18,174);
  ctx.fillStyle="#d9aa36";
  for(const px of [x+30,x+170]){ctx.fillRect(px,y+85,12,150)}
  ctx.fillStyle="#533224";rr(x+78,y+125,54,115,4);ctx.fill();
  ctx.restore();
}

function drawLantern(x,y){
  ctx.save();
  ctx.fillStyle="rgba(255,163,59,.12)";
  ctx.beginPath();ctx.arc(x,y,46,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#34251e";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y-55);ctx.lineTo(x,y-20);ctx.stroke();
  ctx.fillStyle="#e65d3b";rr(x-17,y-20,34,42,10);ctx.fill();
  ctx.fillStyle="#ffd46f";rr(x-10,y-13,20,28,7);ctx.fill();
  ctx.restore();
}

function drawRankShieldCanvas(x,y,rank){
  const t=tier(rank);
  const colors={bronze:"#9b6b43",silver:"#8795a5",gold:"#d6a51d",platinum:"#3ca7a7",diamond:"#557fd8",master:"#7b4bc4"};
  ctx.save();ctx.translate(x,y);
  ctx.fillStyle=colors[t.id]||colors.bronze;
  ctx.beginPath();ctx.moveTo(-11,-8);ctx.lineTo(11,-8);ctx.lineTo(9,6);ctx.lineTo(0,14);ctx.lineTo(-9,6);ctx.closePath();ctx.fill();
  ctx.fillStyle="#fff";ctx.font="900 10px system-ui";ctx.textAlign="center";ctx.fillText(t.letter,0,2);
  ctx.restore();
}

function drawAvatar(p){
  const x=Number(p.x||0), y=WALK_Y;
  const isMe=p.uid===uid;
  const gender=p.character?.gender==="female"?"female":"male";
  const dir=p.direction==="left"?"left":"right";

  // shadow
  ctx.fillStyle="rgba(0,0,0,.25)";
  ctx.beginPath();ctx.ellipse(x,y+27,27,9,0,0,Math.PI*2);ctx.fill();

  // pixel-ish chibi
  ctx.save();
  ctx.translate(x,y);
  if(dir==="left")ctx.scale(-1,1);

  // legs
  ctx.fillStyle="#e6c29e";
  ctx.fillRect(-12,18,8,18);ctx.fillRect(5,18,8,18);
  ctx.fillStyle="#1f2a39";
  ctx.fillRect(-15,32,12,7);ctx.fillRect(4,32,12,7);

  // modest base shorts
  ctx.fillStyle="#294c78";ctx.fillRect(-17,8,34,16);

  // base top
  ctx.fillStyle="#f4f1e9";
  rr(-20,-17,40,30,9);ctx.fill();
  ctx.fillStyle="#224d74";ctx.fillRect(-20,7,40,6);

  // arms
  ctx.fillStyle="#e7bd96";ctx.fillRect(-25,-9,8,22);ctx.fillRect(17,-9,8,22);

  // head
  ctx.fillStyle="#efc8a5";ctx.beginPath();ctx.arc(0,-38,23,0,Math.PI*2);ctx.fill();

  // hair
  ctx.fillStyle="#2a211f";
  if(gender==="male"){
    ctx.beginPath();ctx.arc(-2,-44,23,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillRect(-23,-46,8,14);ctx.fillRect(13,-48,8,18);
  }else{
    ctx.beginPath();ctx.arc(-1,-45,24,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillRect(-24,-46,8,35);ctx.fillRect(16,-46,8,38);
    ctx.fillStyle="#345c8a";ctx.fillRect(12,-62,8,9);
  }

  // eye/nose direction
  ctx.fillStyle="#231f20";ctx.fillRect(7,-40,4,4);
  ctx.fillStyle="#a85d4d";ctx.fillRect(13,-33,4,2);

  if(isMe){
    ctx.strokeStyle="#ffd45e";ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(0,-10,34,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();

  // nametag
  const name=String(p.fullName||"Player").slice(0,18);
  ctx.font="700 14px system-ui";
  const w=Math.max(85,ctx.measureText(name).width+42);
  ctx.fillStyle="rgba(6,18,28,.85)";rr(x-w/2,y-112,w,30,10);ctx.fill();
  ctx.fillStyle="#fff";ctx.textAlign="center";ctx.fillText(name,x,y-92);
  drawRankShieldCanvas(x-w/2+18,y-98,p.rank);

  // showcase icons
  const showcase=Array.isArray(p.inventoryShowcase)?p.inventoryShowcase:[];
  const items=showcase.slice(0,3).map(id=>REWARD_ITEMS.find(i=>i.id===id)).filter(Boolean);
  if(items.length){
    const total=items.length*25;
    ctx.fillStyle="rgba(11,25,32,.72)";rr(x-total/2-6,y-79,total+12,25,8);ctx.fill();
    ctx.font="16px system-ui";ctx.textAlign="center";
    items.forEach((item,i)=>ctx.fillText(item.icon,x-total/2+13+i*25,y-61));
  }

  drawChatBubble(p,x,y);
}

function drawChatBubble(p,x,y){
  const m=messagesByUid.get(p.uid);
  if(!m?.text)return;
  const dt=m.createdAt?.toDate?.();
  if(dt && Date.now()-dt.getTime()>CHAT_BUBBLE_MS)return;

  const text=String(m.text).slice(0,120);
  ctx.font="600 15px system-ui";
  const maxW=260;
  const words=[...text];
  let lines=[],line="";
  for(const ch of words){
    const test=line+ch;
    if(ctx.measureText(test).width>maxW && line){lines.push(line);line=ch}
    else line=test;
  }
  if(line)lines.push(line);
  lines=lines.slice(0,3);

  const bw=Math.min(maxW+28,Math.max(120,...lines.map(t=>ctx.measureText(t).width+28)));
  const bh=18+lines.length*22;
  const by=y-164-bh;

  ctx.fillStyle="rgba(255,255,255,.96)";rr(x-bw/2,by,bw,bh,14);ctx.fill();
  ctx.strokeStyle="rgba(30,55,73,.18)";ctx.lineWidth=2;ctx.stroke();

  ctx.fillStyle="rgba(255,255,255,.96)";
  ctx.beginPath();ctx.moveTo(x-8,by+bh-1);ctx.lineTo(x+8,by+bh-1);ctx.lineTo(x,by+bh+12);ctx.closePath();ctx.fill();

  ctx.fillStyle="#19364a";ctx.textAlign="center";ctx.font="600 15px system-ui";
  lines.forEach((line,i)=>ctx.fillText(line,x,by+25+i*22));
}

function render(){
  drawNightWorld();

  const scale=canvas.clientHeight/WORLD.height;
  const camX=cameraX();

  ctx.save();
  const sx=canvas.width/canvas.clientWidth;
  const sy=canvas.height/canvas.clientHeight;
  ctx.scale(sx,sy);
  ctx.scale(scale,scale);
  ctx.translate(-camX,0);

  const list=[...players.values()].sort((a,b)=>Number(a.x||0)-Number(b.x||0));
  if(!list.some(p=>p.uid===uid)){
    list.push({
      uid,fullName:profile?.fullName,rank:profile?.rank,
      character:publicCharacterData(),inventoryShowcase:publicCharacterData().showcaseItemIds,
      x:me.x,direction:me.direction
    });
  }
  for(const p of list)drawAvatar(p);

  ctx.restore();
}

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
  let selected=null,best=9999;
  for(const p of players.values()){
    const d=Math.hypot(Number(p.x||0)-pt.x,WALK_Y-pt.y);
    if(d<55 && d<best){selected=p;best=d}
  }
  if(!selected)return;

  $("profilePlayerName").textContent=selected.fullName||"Player";
  $("profileRankShield").innerHTML=shieldHTML(selected.rank);
  $("profileRankText").textContent=`${selected.rank?.tierName||"Bronze"} · ${Number(selected.rank?.rating||0)} Rating`;

  const items=(selected.inventoryShowcase||[]).slice(0,3)
    .map(id=>REWARD_ITEMS.find(i=>i.id===id)).filter(Boolean);
  $("profileShowcaseItems").innerHTML=items.length
    ? items.map(i=>`<div class="profile-item"><span>${i.icon}</span><small>${esc(i.name)}</small></div>`).join("")
    : `<div class="profile-no-items">ยังไม่มีของสะสมที่นำมาโชว์</div>`;

  $("playerProfileCard").classList.remove("hidden");
});

async function leaveZone(){
  if(!uid)return;
  try{
    await updateDoc(doc(db,"zone_positions",uid),{online:false,updatedAt:serverTimestamp()});
    await updateDoc(doc(db,"presence",uid),{online:false,lastSeenAt:serverTimestamp()});
    await updateDoc(doc(db,"users",uid),{
      zone:{zoneId:"thai_night_social",x:Math.round(me.x),y:WALK_Y,direction:me.direction,lastSeenAt:new Date().toISOString()}
    });
  }catch{}
}

window.addEventListener("resize",resizeCanvas);
window.addEventListener("pagehide",leaveZone);
$("leaveZoneButton").addEventListener("click",()=>leaveZone());
setInterval(()=>publish(true),30000);

onAuthStateChanged(auth,async user=>{
  if(!user){
    $("zoneGate").innerHTML=`<div class="social-gate-card">
      <div class="social-gate-icon">🔒</div>
      <h1>กรุณา Login ก่อนเข้า Social Zone</h1>
      <p>ระบบต้องใช้ข้อมูล User เพื่อแสดงตัวละครและ Rank</p>
      <a href="index.html" class="btn primary">กลับไป Login</a>
    </div>`;
    return;
  }
  if(user.email==="pisit_2000@thc-nr.local"){location.href="admin.html";return}
  uid=user.uid;
  await enterZone();
});
