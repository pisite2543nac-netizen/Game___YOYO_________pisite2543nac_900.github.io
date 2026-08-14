import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, onSnapshot,
  serverTimestamp, query, orderBy, limit, Timestamp, runTransaction
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";
import { firebaseConfig, ADMIN_UID } from "./firebase-config.js?v=4.9.3";
import { REWARD_ITEMS, RARITY_META, INVENTORY_CAPACITY, SHOP_BUYBACK_RATE } from "./reward-data.js?v=4.9.3";
import { DEFAULT_CHARACTER } from "./character-system.js?v=4.9.3";
import {
  QUEST_CONFIG, DEFAULT_TEACHER_QUESTS, localDayKey, activeQuestLimit,
  canAccessQuest, clampQuestReward, questDifficultyName, questObjectiveLabel
} from "./quest-system.js?v=4.9.3";

const firebaseApp=initializeApp(firebaseConfig);
const auth=getAuth(firebaseApp);
const db=getFirestore(firebaseApp);
const cloudFunctions=getFunctions(firebaseApp,"asia-southeast1");
const recordDailyCheckinHeartbeat=httpsCallable(cloudFunctions,"recordDailyCheckinHeartbeat");
const $=id=>document.getElementById(id);

const ZONE_ID="thai_social_zone_v4_1";
const WORLD={width:2800,height:900};
const WALK_Y=690;
const WALK_LEFT=100;
const WALK_RIGHT=2700;
const PLAYER_MAX_SPEED=410;
const ACCELERATION=1900;
const DECELERATION=2400;
const POSITION_SEND_MS=150;
const PRESENCE_HEARTBEAT_MS=30000;
const ONLINE_STALE_MS=95000;
const USER_CHAT_TTL_MS=24*60*60*1000;
const BUBBLE_MS=9000;
const DAY_NIGHT_MS=3*60*60*1000;
const WIZARD_X=900;
const SHOP_X=1900;
const INTERACT_DISTANCE=190;

const canvas=$("zoneCanvas"),ctx=canvas.getContext("2d",{alpha:false});
let cssW=1,cssH=1,dpr=1,zoom=1;
let uid=null,profile=null,blocked=true;
let players=new Map(),messages=[],messagesByUid=new Map();
let teacherQuests=[...DEFAULT_TEACHER_QUESTS],questProgress={};
let positionsUnsub=null,messagesUnsub=null,moderationUnsub=null,rankingUnsub=null,questUnsub=null;
let heartbeat=null,clockTimer=null,expiryTimer=null,dailyCheckinTimer=null;
let lastFrame=performance.now(),lastPositionSend=0,lastChatAt=0;
let cameraX=0,velocityX=0;
const me={x:450,y:WALK_Y,direction:"right",moving:false};
const keys=new Set();
const touch={left:false,right:false};
let nearbyAction=null;

const GM_RANK={tierId:"master",tierName:"GAME MASTER",rating:999999};
const GM_ITEMS=[{icon:"👑",name:"GM Crown"},{icon:"🪄",name:"GM Staff"},{icon:"🛡️",name:"Guardian Aura"}];

const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
function zoneLooksFullscreen(){
  if(document.fullscreenElement)return true;
  if(window.matchMedia?.("(display-mode: fullscreen)")?.matches)return true;
  const h=window.visualViewport?.height||window.innerHeight,sh=window.screen?.height||h;
  return h/sh>=0.90;
}
async function zoneCheckinPulse(){
  if(!uid||isGM()||document.visibilityState!=="visible"||!zoneLooksFullscreen())return;
  try{
    const result=await recordDailyCheckinHeartbeat({visible:true,fullscreen:true});
    const d=result.data||{},seconds=Number(d.qualifiedSeconds||0);
    $("zoneCheckinMini").textContent=d.rewarded?"Check-in ✓ +10":"Check-in "+Math.floor(seconds/60)+"/60m";
    if(d.justRewarded){await refreshProfile();alert("เช็กอินประจำวันสำเร็จ! +10 Token")}
  }catch(error){console.warn("zone daily checkin",error)}
}
function startZoneDailyCheckin(){clearInterval(dailyCheckinTimer);zoneCheckinPulse();dailyCheckinTimer=setInterval(zoneCheckinPulse,60000)}
function isGM(){return uid===ADMIN_UID}
function isGMPlayer(p){return p?.uid===ADMIN_UID||p?.isAdmin===true}
function isTouchOnly(){return window.matchMedia("(pointer: coarse)").matches&&window.innerWidth<=1180}
function equipped(character){return {...DEFAULT_CHARACTER.equipped,...(character?.equipped||{})}}
function itemById(id){return REWARD_ITEMS.find(x=>x.id===id)||null}
function equippedItems(character){return Object.entries(equipped(character)).map(([slot,id])=>({slot,item:itemById(id)})).filter(x=>x.item)}
function rankMeta(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase();
  const map={bronze:{letter:"B",color:"#9a6b46"},silver:{letter:"S",color:"#84919c"},gold:{letter:"G",color:"#d5a21d"},platinum:{letter:"P",color:"#3b9c98"},diamond:{letter:"D",color:"#537bd2"},master:{letter:"M",color:"#7749b7"}};
  return {id,...(map[id]||map.bronze)};
}
function rankShieldHTML(rank){const r=rankMeta(rank);return `<span class="rank-shield rank-${r.id}"><span class="rank-shield-letter">${r.letter}</span></span>`}
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}

function showGate(title,text,help=""){
  blocked=true;$("zoneApp").classList.add("hidden");$("zoneGate").classList.remove("hidden");
  $("zoneGateTitle").textContent=title;$("zoneGateText").textContent=text;
  if(help){$("zoneGateHelp").innerHTML=help;$("zoneGateHelp").classList.remove("hidden")}else $("zoneGateHelp").classList.add("hidden");
}
function hideGate(){blocked=false;$("zoneGate").classList.add("hidden");$("zoneApp").classList.remove("hidden")}
function chatStatus(text,error=false){$("zoneChatStatus").textContent=text;$("zoneChatStatus").classList.toggle("error",error)}
function connectionState(state,text){$("zoneConnectionBadge").dataset.state=state;$("zoneConnectionBadge").querySelector("strong").textContent=text}

function moderationState(m){
  const now=Date.now(),ban=m?.bannedUntil?.toDate?.(),kick=m?.kickedUntil?.toDate?.();
  return {banned:!!ban&&ban.getTime()>now,bannedUntil:ban,kicked:!!kick&&kick.getTime()>now,kickedUntil:kick};
}
async function checkModeration(){
  if(isGM())return true;
  try{
    const snap=await getDoc(doc(db,"zone_moderation",uid));
    if(!snap.exists())return true;
    const m=snap.data(),s=moderationState(m);
    if(s.banned){showGate("ถูกระงับการเข้า 2D Zone",`แบนถึง ${s.bannedUntil.toLocaleString("th-TH")}`);return false}
    if(s.kicked){showGate("ถูก GM เตะออกจาก 2D Zone",`กลับเข้าได้หลัง ${s.kickedUntil.toLocaleTimeString("th-TH")}`);return false}
    return true;
  }catch(error){showGate("ตรวจสอบสิทธิ์ Zone ไม่สำเร็จ",error.message||String(error),"กรุณา Publish firestore.rules V4.7");return false}
}
function listenModeration(){
  if(isGM())return;
  moderationUnsub?.();
  moderationUnsub=onSnapshot(doc(db,"zone_moderation",uid),snap=>{
    if(!snap.exists())return;
    const s=moderationState(snap.data());
    if(s.banned||s.kicked){stopRealtime();showGate(s.banned?"คุณถูก GM แบน":"คุณถูก GM เตะออก",s.banned?`แบนถึง ${s.bannedUntil.toLocaleString("th-TH")}`:`กลับเข้าได้หลัง ${s.kickedUntil.toLocaleTimeString("th-TH")}`)}
  });
}

async function loadProfile(){
  if(isGM()){profile={uid,studentId:"GM",fullName:"GM",rank:GM_RANK,tokenBalance:0,inventory:[],character:{gender:"male",equipped:{}},zone:{}};me.x=450;return true}
  try{
    const snap=await getDoc(doc(db,"users",uid));if(!snap.exists()){showGate("ไม่พบ User","กรุณาลงทะเบียนใหม่");return false}
    profile={uid,...snap.data()};
    if(!["male","female"].includes(profile.character?.gender)){showGate("กรุณาเลือกตัวละครก่อน","กลับหน้า User แล้วเลือกชายหรือหญิง");return false}
    me.x=Math.max(WALK_LEFT,Math.min(WALK_RIGHT,Number(profile.zone?.x)||450));
    me.direction=profile.zone?.direction==="left"?"left":"right";
    return true;
  }catch(error){showGate("โหลดข้อมูล User ไม่สำเร็จ",error.message||String(error));return false}
}
async function syncPublicProfile(){
  try{
    const gm=isGM();
    await setDoc(doc(db,"public_profiles",uid),{
      uid,studentId:gm?"GM":profile.studentId,fullName:gm?"GM":profile.fullName,isAdmin:gm,role:gm?"GM":"USER",
      rank:gm?GM_RANK:(profile.rank||null),
      character:gm?{gender:"male",equipped:{}}:{gender:profile.character?.gender||"male",equipped:equipped(profile.character)},
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("profile sync",error)}
}
async function publishPresence(){
  try{
    await setDoc(doc(db,"presence",uid),{
      uid,studentId:isGM()?"GM":profile.studentId,isAdmin:isGM(),rank:isGM()?GM_RANK:(profile.rank||null),
      area:"zone",online:true,lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("presence",error)}
}
async function publishPosition(force=false){
  if(blocked||!profile)return;
  const now=performance.now();if(!force&&now-lastPositionSend<POSITION_SEND_MS)return;lastPositionSend=now;
  try{
    await setDoc(doc(db,"zone_positions",uid),{
      uid,studentId:isGM()?"GM":profile.studentId,isAdmin:isGM(),role:isGM()?"GM":"USER",
      rank:isGM()?GM_RANK:(profile.rank||null),
      character:isGM()?{gender:"male",equipped:{}}:{gender:profile.character?.gender||"male",equipped:equipped(profile.character)},
      zoneId:ZONE_ID,x:Math.round(me.x*10)/10,y:WALK_Y,direction:me.direction,moving:me.moving,online:true,updatedAt:serverTimestamp()
    },{merge:true});
    connectionState("online","REALTIME");
  }catch(error){connectionState("error","SYNC ERROR");console.warn("position",error)}
}
function listenPositions(){
  positionsUnsub?.();
  positionsUnsub=onSnapshot(collection(db,"zone_positions"),snap=>{
    const now=Date.now(),seen=new Set();
    snap.docs.forEach(d=>{
      const p={uid:d.id,...d.data()};if(p.zoneId!==ZONE_ID||!p.online)return;
      const dt=p.updatedAt?.toDate?.();if(dt&&now-dt.getTime()>ONLINE_STALE_MS)return;
      seen.add(d.id);if(d.id===uid)return;
      const x=Number(p.x)||450,old=players.get(d.id);
      if(old)Object.assign(old,p,{targetX:x});
      else players.set(d.id,{...p,currentX:x,targetX:x});
    });
    for(const id of [...players.keys()])if(!seen.has(id))players.delete(id);
    $("zoneOnlineCount").textContent=players.size+1;
  },error=>{connectionState("error","FIREBASE ERROR");console.warn(error)});
}

function isChatVisible(m,now=Date.now()){
  if(m?.isGM===true||m?.uid===ADMIN_UID)return true;
  const dt=m?.createdAt?.toDate?.();return !!dt&&now-dt.getTime()<USER_CHAT_TTL_MS;
}
function refreshMessages(){
  const visible=messages.filter(m=>m.zoneId===ZONE_ID&&isChatVisible(m));
  const latest=new Map();for(const m of visible)if(!latest.has(m.uid))latest.set(m.uid,m);
  messagesByUid=latest;renderChatHistory(visible);
}
function listenMessages(){
  messagesUnsub?.();
  messagesUnsub=onSnapshot(query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(120)),snap=>{
    messages=snap.docs.map(d=>({id:d.id,...d.data()}));refreshMessages();chatStatus("พร้อมพูดคุย");
  },error=>{chatStatus("โหลดแชตไม่สำเร็จ",true);console.warn(error)});
}
function renderChatHistory(rows=messages.filter(m=>m.zoneId===ZONE_ID&&isChatVisible(m))){
  $("zoneChatHistoryList").innerHTML=rows.slice(0,80).map(m=>{
    const gm=m.isGM||m.uid===ADMIN_UID,dt=m.createdAt?.toDate?.();
    return `<article class="zone47-chat-message ${gm?"gm":""}"><div class="zone47-chat-avatar">${gm?"GM":esc(String(m.studentId||"?").slice(-2))}</div><div><div class="zone47-chat-meta"><strong>${gm?"GM":esc(m.studentId||"USER")}</strong><time>${dt?dt.toLocaleString("th-TH"):"-"}</time></div><p>${esc(m.text||"")}</p></div></article>`;
  }).join("")||`<div class="empty">ยังไม่มีข้อความ</div>`;
}
async function archiveMessage(id,data){
  try{await setDoc(doc(db,"zone_chat_archive",id),{...data,messageId:id,createdAt:serverTimestamp(),archivedAt:serverTimestamp()})}catch(error){console.warn("archive",error)}
}
async function sendMessage(text){
  const clean=String(text||"").trim().slice(0,120);if(blocked||!clean)return;
  if(Date.now()-lastChatAt<700){chatStatus("ส่งเร็วเกินไป");return}lastChatAt=Date.now();
  const gm=isGM(),payload={uid,studentId:gm?"GM":profile.studentId,text:clean,zoneId:ZONE_ID,isGM:gm,createdAt:serverTimestamp()};
  if(!gm)payload.expiresAt=Timestamp.fromMillis(Date.now()+USER_CHAT_TTL_MS);
  try{
    const ref=doc(collection(db,"zone_messages"));await setDoc(ref,payload);
    archiveMessage(ref.id,{uid,studentId:gm?"GM":profile.studentId,text:clean,zoneId:ZONE_ID,isGM:gm});
    chatStatus("ส่งแล้ว");setTimeout(()=>chatStatus("พร้อมพูดคุย"),1000);
  }catch(error){chatStatus("ส่งไม่ได้ · ตรวจ Rules",true);console.warn(error)}
}
$("zoneChatForm").onsubmit=async e=>{e.preventDefault();const input=$("zoneChatInput"),text=input.value;if(!text.trim())return;input.value="";await sendMessage(text);input.focus({preventScroll:true})};
$("openZoneChatHistory").onclick=()=>{$("zoneChatHistoryModal").classList.remove("hidden");renderChatHistory()};
$("closeZoneChatHistory").onclick=()=>$("zoneChatHistoryModal").classList.add("hidden");

function questProgressRef(){return doc(db,"quest_progress",uid,"days",localDayKey())}
async function loadQuestProgress(){
  if(isGM()){questProgress={};return}
  try{const snap=await getDoc(questProgressRef());questProgress=snap.exists()?snap.data():{}}catch(error){console.warn("quest progress",error);questProgress={}}
}
function listenTeacherQuests(){
  questUnsub?.();
  questUnsub=onSnapshot(collection(db,"teacher_quests"),snap=>{
    teacherQuests=snap.empty?[...DEFAULT_TEACHER_QUESTS]:snap.docs.map(d=>({id:d.id,...d.data()})).filter(q=>q.active!==false);
    renderQuestModal();
  },error=>{console.warn("teacher quests",error);teacherQuests=[...DEFAULT_TEACHER_QUESTS];renderQuestModal()});
}
function acceptedMap(){return questProgress.accepted||{}}
function completedMap(){return questProgress.completed||{}}
function activeAcceptedCount(){return Object.values(acceptedMap()).filter(x=>x?.status==="accepted").length}
function acceptedTodayCount(){return Object.keys(acceptedMap()).length}
function renderQuestModal(){
  if(!profile||!$("zoneQuestList"))return;
  const rank=isGM()?GM_RANK:(profile.rank||{}),daily=acceptedTodayCount(),activeNow=activeAcceptedCount(),activeLimit=activeQuestLimit(rank);
  $("questRankLabel").textContent=isGM()?"GM":(rank.tierName||"Bronze");
  $("questDailyCount").textContent=`${daily} / ${QUEST_CONFIG.dailyLimit}`;
  $("questActiveLimit").textContent=activeLimit;
  $("zoneQuestList").innerHTML=teacherQuests.map(q=>{
    const accepted=acceptedMap()[q.id],completed=completedMap()[q.id]||accepted?.status==="completed";
    const rankOk=isGM()||canAccessQuest(rank,q),reward=clampQuestReward(q.difficulty,q.rewardToken);
    let action="";
    if(isGM())action=`<button class="btn ghost" disabled>GM ดูภารกิจ</button>`;
    else if(completed)action=`<button class="btn ghost" disabled>สำเร็จแล้ว ✓</button>`;
    else if(accepted)action=isTouchOnly()
      ?`<button class="btn secondary" disabled>รับแล้ว · ทำบนคอม</button>`
      :`<button class="btn primary" data-start-quest="${esc(q.id)}">เริ่มทำภารกิจ</button>`;
    else if(!rankOk)action=`<button class="btn ghost" disabled>ต้อง Rank ${esc(q.minRank||"สูงกว่า")}</button>`;
    else if(daily>=QUEST_CONFIG.dailyLimit)action=`<button class="btn ghost" disabled>ครบ 3 ภารกิจวันนี้</button>`;
    else if(activeNow>=activeLimit)action=`<button class="btn ghost" disabled>ทำภารกิจที่รับไว้ก่อน</button>`;
    else action=`<button class="btn primary" data-accept-quest="${esc(q.id)}">รับภารกิจ</button>`;
    return `<article class="zone47-quest-item difficulty-${esc(q.difficulty)} ${completed?"completed":!rankOk?"locked":""}">
      <div class="zone47-quest-icon">${q.languageId==="python"?"🐍":"🌐"}</div>
      <div class="zone47-quest-main">
        <div class="zone47-quest-title"><strong>${esc(q.title)}</strong><span>${questDifficultyName(q.difficulty)}</span></div>
        <p>${esc(q.description||"")}</p>
        <div class="zone47-quest-tags"><span>${esc(String(q.languageId).toUpperCase())} Stage ${Number(q.stage)}</span><span>${esc(questObjectiveLabel(q))}</span><span>Rank ≥ ${esc(q.minRank||"bronze")}</span></div>
      </div>
      <div class="zone47-quest-reward"><strong>+${reward}</strong><span>Token</span>${action}</div>
    </article>`;
  }).join("")||`<div class="empty">ยังไม่มีภารกิจ</div>`;
  document.querySelectorAll("[data-accept-quest]").forEach(btn=>btn.onclick=()=>acceptQuest(btn.dataset.acceptQuest));
  document.querySelectorAll("[data-start-quest]").forEach(btn=>btn.onclick=()=>startQuest(btn.dataset.startQuest));
}
async function acceptQuest(id){
  if(isGM())return;
  const q=teacherQuests.find(x=>x.id===id);if(!q)return;
  if(!canAccessQuest(profile.rank,q))return;
  try{
    await runTransaction(db,async tx=>{
      const ref=questProgressRef(),snap=await tx.get(ref),data=snap.exists()?snap.data():{};
      const accepted={...(data.accepted||{})},completed={...(data.completed||{})};
      if(accepted[id]||completed[id])return;
      if(Object.keys(accepted).length>=QUEST_CONFIG.dailyLimit)throw new Error("วันนี้รับครบ 3 ภารกิจแล้ว");
      const activeNow=Object.values(accepted).filter(x=>x?.status==="accepted").length;
      if(activeNow>=activeQuestLimit(profile.rank))throw new Error("ทำภารกิจที่รับอยู่ให้เสร็จก่อน");
      accepted[id]={status:"accepted",acceptedAt:new Date().toISOString(),questTitle:q.title};
      tx.set(ref,{uid,studentId:profile.studentId,dateKey:localDayKey(),accepted,completed,updatedAt:serverTimestamp()},{merge:true});
    });
    await loadQuestProgress();renderQuestModal();
    if(!isTouchOnly())startQuest(id);
  }catch(error){alert(error.message||String(error))}
}
function startQuest(id){
  const q=teacherQuests.find(x=>x.id===id)||DEFAULT_TEACHER_QUESTS.find(x=>x.id===id);if(!q)return;
  if(isTouchOnly()){alert("รับภารกิจแล้ว กรุณาเปิดบัญชีนี้บนคอมพิวเตอร์เพื่อทำภารกิจ");return}
  location.href=`./index.html?quest=${encodeURIComponent(id)}&v=4.9.3`;
}
$("openWizardQuests").onclick=async()=>{await loadQuestProgress();renderQuestModal();$("zoneQuestModal").classList.remove("hidden")};
$("closeWizardQuests").onclick=()=>$("zoneQuestModal").classList.add("hidden");

function renderShop(){
  if(!profile||isGM())return;
  const owned=new Set(profile.inventory||[]),eq=equipped(profile.character),wearing=new Set(Object.values(eq).filter(Boolean)),balance=Number(profile.tokenBalance||0);
  $("zoneBagCount")&&($("zoneBagCount").textContent=`${owned.size}/${INVENTORY_CAPACITY}`);
  $("zoneTokenBalance").textContent=balance.toLocaleString();$("zoneShopBalance").textContent=balance.toLocaleString();
  const items=[...REWARD_ITEMS].sort((a,b)=>(RARITY_META[a.rarity]?.order||0)-(RARITY_META[b.rarity]?.order||0)||a.cost-b.cost);
  $("zoneShopGrid").innerHTML=items.map(item=>{
    const own=owned.has(item.id),on=wearing.has(item.id);
    return `<article class="zone47-shop-item rarity-${esc(item.rarity)} ${on?"wearing":""}">
      <div class="zone47-shop-rarity">${esc(RARITY_META[item.rarity]?.name||item.rarity)}</div>
      <div class="zone47-shop-icon">${item.icon}</div><strong>${esc(item.name)}</strong><small>${esc(item.description)}</small>
      <em>${Number(item.cost).toLocaleString()} Token</em>
      <button class="btn ${on?"ghost":own?"secondary":"primary"}" data-shop-item="${esc(item.id)}" ${!own&&balance<item.cost?"disabled":""}>${on?"ถอด":own?"สวมใส่":balance<item.cost?"Token ไม่พอ":"แลกไอเท็ม"}</button>
    </article>`;
  }).join("");
  document.querySelectorAll("[data-shop-item]:not([disabled])").forEach(btn=>btn.onclick=()=>handleShopItem(btn.dataset.shopItem));
}
async function refreshProfile(){
  if(isGM())return;
  const snap=await getDoc(doc(db,"users",uid));if(snap.exists())profile={uid,...snap.data()};
  renderShop();if(!$("zoneBagModal")?.classList.contains("hidden"))renderZoneBag();await syncPublicProfile();await publishPosition(true);
}
async function handleShopItem(id){
  if(isGM())return;
  const item=itemById(id);if(!item)return;
  const userRef=doc(db,"users",uid),owned=(profile.inventory||[]).includes(id);
  if(!owned){
    try{
      await runTransaction(db,async tx=>{
        const snap=await tx.get(userRef);if(!snap.exists())throw new Error("ไม่พบ User");
        const d=snap.data(),balance=Number(d.tokenBalance||0),inv=Array.isArray(d.inventory)?d.inventory:[];
        if(inv.includes(id))return;if(inv.length>=INVENTORY_CAPACITY)throw new Error(`กระเป๋าเต็ม ${INVENTORY_CAPACITY}/${INVENTORY_CAPACITY}`);if(balance<item.cost)throw new Error("Token ไม่พอ");
        tx.update(userRef,{tokenBalance:balance-item.cost,inventory:[...inv,id],updatedAt:serverTimestamp()});
      });await refreshProfile();
    }catch(error){alert(error.message)}return;
  }
  const current=equipped(profile.character);current[item.slot]=current[item.slot]===id?null:id;
  await updateDoc(userRef,{character:{...DEFAULT_CHARACTER,...profile.character,equipped:current},updatedAt:serverTimestamp()});
  await refreshProfile();
}
function renderZoneBag(){
  if(!profile||isGM())return;
  const inventory=Array.isArray(profile.inventory)?profile.inventory:[],eq=equipped(profile.character),wearing=new Set(Object.values(eq).filter(Boolean));
  $("zoneBagCapacity").textContent=`${inventory.length} / ${INVENTORY_CAPACITY}`;
  $("zoneBagCount").textContent=`${inventory.length}/${INVENTORY_CAPACITY}`;
  $("zoneBagGrid").innerHTML=inventory.length?inventory.map(id=>{
    const item=itemById(id);if(!item)return "";const on=wearing.has(id),buyback=Math.floor(Number(item.cost||0)*SHOP_BUYBACK_RATE);
    return `<article class="zone47-shop-item ${on?"wearing":""}"><div class="zone47-shop-rarity">${esc(RARITY_META[item.rarity]?.name||item.rarity)}</div><div class="zone47-shop-icon">${item.icon}</div><strong>${esc(item.name)}</strong><small>${esc(item.description)}</small><em>ขายคืน ${buyback.toLocaleString()} Token</em><div class="zone-bag-actions"><button class="btn secondary" data-bag-equip="${esc(id)}">${on?"ถอด":"สวม"}</button><button class="btn danger" data-bag-sell="${esc(id)}">ขายคืน</button></div></article>`;
  }).join(""):`<div class="empty-card">กระเป๋ายังว่าง</div>`;
  document.querySelectorAll("[data-bag-equip]").forEach(btn=>btn.onclick=()=>handleShopItem(btn.dataset.bagEquip));
  document.querySelectorAll("[data-bag-sell]").forEach(btn=>btn.onclick=()=>sellInventoryItem(btn.dataset.bagSell));
}
async function sellInventoryItem(id){
  if(isGM())return;const item=itemById(id);if(!item)return;
  const buyback=Math.floor(Number(item.cost||0)*SHOP_BUYBACK_RATE);
  if(!confirm(`ขาย ${item.name} คืนร้าน รับ ${buyback} Token ?`))return;
  try{
    await runTransaction(db,async tx=>{
      const ref=doc(db,"users",uid),snap=await tx.get(ref);if(!snap.exists())throw new Error("ไม่พบ User");
      const d=snap.data(),inv=Array.isArray(d.inventory)?d.inventory:[];if(!inv.includes(id))throw new Error("ไม่มีไอเท็มนี้ในกระเป๋า");
      const character={...DEFAULT_CHARACTER,...(d.character||{}),equipped:{...DEFAULT_CHARACTER.equipped,...(d.character?.equipped||{})}};
      for(const slot of Object.keys(character.equipped))if(character.equipped[slot]===id)character.equipped[slot]=null;
      tx.update(ref,{inventory:inv.filter(x=>x!==id),tokenBalance:Number(d.tokenBalance||0)+buyback,character,updatedAt:serverTimestamp()});
    });
    await refreshProfile();renderZoneBag();
  }catch(error){alert(error.message||String(error))}
}
$("openZoneBag").onclick=()=>{if(isGM()){alert("GM ใช้ไอเท็มพิเศษ ไม่ใช้กระเป๋า User");return}renderZoneBag();$("zoneBagModal").classList.remove("hidden")};
$("closeZoneBag").onclick=()=>$("zoneBagModal").classList.add("hidden");

$("openZoneShop").onclick=()=>{if(isGM()){alert("GM ใช้ไอเท็มพิเศษเฉพาะ ไม่ซื้อจากร้าน");return}renderShop();$("zoneShopModal").classList.remove("hidden")};
$("closeZoneShop").onclick=()=>$("zoneShopModal").classList.add("hidden");

function targetDirection(){
  const left=touch.left||keys.has("a")||keys.has("arrowleft"),right=touch.right||keys.has("d")||keys.has("arrowright");
  return (right?1:0)-(left?1:0);
}
function updateMovement(dt){
  if(blocked)return;
  const dir=targetDirection(),target=dir*PLAYER_MAX_SPEED;
  const rate=dir===0?DECELERATION:ACCELERATION;
  if(velocityX<target)velocityX=Math.min(target,velocityX+rate*dt);
  else if(velocityX>target)velocityX=Math.max(target,velocityX-rate*dt);
  if(Math.abs(velocityX)<2&&dir===0)velocityX=0;
  me.moving=Math.abs(velocityX)>5;
  if(dir<0)me.direction="left";else if(dir>0)me.direction="right";
  me.x=Math.max(WALK_LEFT,Math.min(WALK_RIGHT,me.x+velocityX*dt));
  if(me.x===WALK_LEFT||me.x===WALK_RIGHT)velocityX=0;
  if(me.moving)publishPosition(false);
  updateNearbyAction();
}
function smoothRemote(dt){
  const f=1-Math.pow(0.0007,dt);
  for(const p of players.values())p.currentX+=(p.targetX-p.currentX)*f;
}
function bindHold(id,dir){
  const el=$(id);el.style.touchAction="none";
  el.onpointerdown=e=>{e.preventDefault();touch[dir]=true;el.setPointerCapture?.(e.pointerId)};
  const stop=()=>{touch[dir]=false;publishPosition(true)};
  ["pointerup","pointercancel","pointerleave","lostpointercapture"].forEach(ev=>el.addEventListener(ev,stop));
}
bindHold("moveLeftButton","left");bindHold("moveRightButton","right");
window.addEventListener("keydown",e=>{
  if(document.activeElement===$("zoneChatInput"))return;
  const k=e.key.toLowerCase();
  if(["a","d","arrowleft","arrowright"].includes(k)){e.preventDefault();keys.add(k)}
  if(k==="enter")$("zoneChatInput").focus({preventScroll:true});
  if(k==="e"&&nearbyAction){e.preventDefault();triggerNearbyAction()}
});
window.addEventListener("keyup",e=>{const k=e.key.toLowerCase();keys.delete(k);if(["a","d","arrowleft","arrowright"].includes(k))publishPosition(true)});

function updateNearbyAction(){
  const dw=Math.abs(me.x-WIZARD_X),ds=Math.abs(me.x-SHOP_X);
  nearbyAction=dw<INTERACT_DISTANCE?"wizard":ds<INTERACT_DISTANCE?"shop":null;
  const btn=$("zoneNearbyAction");
  if(!nearbyAction){btn.classList.add("hidden");return}
  btn.classList.remove("hidden");
  btn.textContent=nearbyAction==="wizard"?"E · 🧙 รับภารกิจ":"E · 🛒 เปิดร้านค้า";
}
function triggerNearbyAction(){nearbyAction==="wizard"?$("openWizardQuests").click():nearbyAction==="shop"?$("openZoneShop").click():null}
$("zoneNearbyAction").onclick=triggerNearbyAction;

function resizeCanvas(){
  const r=canvas.getBoundingClientRect();cssW=Math.max(1,r.width);cssH=Math.max(1,r.height);dpr=Math.min(2.5,window.devicePixelRatio||1);
  canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);zoom=Math.max(.7,Math.min(1.18,cssH/850));ctx.imageSmoothingEnabled=false;
}
function updateCamera(dt){
  const viewW=cssW/zoom,target=Math.max(0,Math.min(WORLD.width-viewW,me.x-viewW/2));
  const f=1-Math.pow(0.00025,dt);cameraX+=(target-cameraX)*f;
}
function screenToWorld(clientX,clientY){const r=canvas.getBoundingClientRect();return {x:(clientX-r.left)/zoom+cameraX,y:(clientY-r.top)/zoom}}

function worldTimeState(now=Date.now()){
  const block=Math.floor(now/DAY_NIGHT_MS),day=block%2===0,next=(block+1)*DAY_NIGHT_MS;
  return {day,label:day?"กลางวัน":"กลางคืน",icon:day?"☀️":"🌙",remaining:next-now};
}
function countdown(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor(s%3600/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}
function updateClock(){const t=worldTimeState();$("zoneWorldPeriod").textContent=t.label;$("zoneWorldCountdown").textContent=`เปลี่ยนใน ${countdown(t.remaining)}`;$("zoneWorldIcon").textContent=t.icon}

function drawTree(x,y,day){
  ctx.fillStyle=day?"#684927":"#3e3023";ctx.fillRect(x-9,y,18,70);ctx.fillStyle=day?"#3f8d4f":"#194b39";
  for(const [ox,oy,r] of [[0,-15,45],[-28,8,34],[29,10,36],[0,26,38]]){ctx.beginPath();ctx.arc(x+ox,y+oy,r,0,Math.PI*2);ctx.fill()}
}
function drawHouse(x,y,w,h,roof,wall,day,label=""){
  ctx.fillStyle="rgba(0,0,0,.16)";rr(ctx,x+10,y+h-4,w,16,8);ctx.fill();ctx.fillStyle=wall;rr(ctx,x,y+65,w,h-65,10);ctx.fill();
  ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(x-22,y+80);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w+22,y+80);ctx.lineTo(x+w,y+105);ctx.lineTo(x,y+105);ctx.closePath();ctx.fill();
  ctx.fillStyle=day?"#9bd2e9":"#ffd16f";for(let i=0;i<3;i++){rr(ctx,x+35+i*(w-105)/2,y+122,44,46,4);ctx.fill()}
  ctx.fillStyle="#4c3426";rr(ctx,x+w/2-26,y+h-67,52,67,4);ctx.fill();
  if(label){ctx.fillStyle="rgba(14,33,43,.85)";rr(ctx,x+w/2-80,y+h-105,160,28,8);ctx.fill();ctx.fillStyle="#fff2b4";ctx.font="800 14px system-ui";ctx.textAlign="center";ctx.fillText(label,x+w/2,y+h-86)}
}
function drawWizard(x,y,now){
  const bob=Math.sin(now/350)*3;ctx.save();ctx.translate(x,y+bob);
  ctx.fillStyle="rgba(125,76,190,.18)";ctx.beginPath();ctx.arc(0,-32,64,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#49306c";ctx.beginPath();ctx.moveTo(-42,28);ctx.lineTo(-25,-58);ctx.lineTo(25,-58);ctx.lineTo(44,28);ctx.closePath();ctx.fill();
  ctx.fillStyle="#efd0ac";ctx.beginPath();ctx.arc(0,-70,22,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#5f3c89";ctx.beginPath();ctx.moveTo(-33,-86);ctx.lineTo(4,-132);ctx.lineTo(31,-86);ctx.closePath();ctx.fill();ctx.fillRect(-36,-91,72,9);
  ctx.strokeStyle="#9c713b";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(38,-47);ctx.lineTo(58,35);ctx.stroke();ctx.fillStyle="#70ddff";ctx.beginPath();ctx.arc(36,-51,10,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="rgba(31,23,47,.88)";rr(ctx,-76,-165,152,29,8);ctx.fill();ctx.fillStyle="#fff";ctx.font="800 13px system-ui";ctx.textAlign="center";ctx.fillText("🧙 พ่อมดภารกิจ",0,-146);
  ctx.restore();
}
function drawShop(x,y,day){
  ctx.save();ctx.translate(x,y);ctx.fillStyle="#5a3d29";rr(ctx,-155,-120,310,145,10);ctx.fill();
  ctx.fillStyle="#d65443";ctx.beginPath();ctx.moveTo(-175,-118);ctx.lineTo(-145,-160);ctx.lineTo(145,-160);ctx.lineTo(175,-118);ctx.closePath();ctx.fill();
  ctx.fillStyle="#f5e6c3";for(let i=0;i<6;i++)ctx.fillRect(-135+i*48,-155,24,35);
  ctx.fillStyle="#b87931";ctx.fillRect(-135,-45,270,25);
  ["#e0ae3c","#67a95a","#b75fb5","#54a6c7"].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(-90+i*60,-58,18,0,Math.PI*2);ctx.fill()});
  ctx.fillStyle=day?"#173b4e":"#fff0a5";ctx.font="900 17px system-ui";ctx.textAlign="center";ctx.fillText("TOKEN SHOP",0,-88);
  ctx.restore();
}
function drawWorld(now){
  const t=worldTimeState(),day=t.day;
  const bg=ctx.createLinearGradient(0,0,0,WORLD.height);
  if(day){bg.addColorStop(0,"#80c9ec");bg.addColorStop(.58,"#cae9e6");bg.addColorStop(.59,"#72a760");bg.addColorStop(1,"#50884d")}
  else{bg.addColorStop(0,"#082638");bg.addColorStop(.58,"#174457");bg.addColorStop(.59,"#355b47");bg.addColorStop(1,"#284532")}
  ctx.fillStyle=bg;ctx.fillRect(0,0,WORLD.width,WORLD.height);
  if(day){ctx.fillStyle="#ffe26c";ctx.beginPath();ctx.arc(2200,115,48,0,Math.PI*2);ctx.fill()}
  else{ctx.fillStyle="#ffe8aa";ctx.beginPath();ctx.arc(2200,115,43,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,255,.8)";for(let i=0;i<70;i++)ctx.fillRect((i*181)%WORLD.width,40+(i*73)%260,2,2)}
  drawHouse(100,300,390,250,"#2d5870","#8a4931",day,"SOCIAL HOUSE");
  drawHouse(2240,300,390,250,"#69416d","#835a3c",day,"RANK HALL");
  drawWizard(WIZARD_X,615,now);drawShop(SHOP_X,645,day);
  ctx.fillStyle=day?"#bdaf91":"#68716b";rr(ctx,430,570,1810,210,40);ctx.fill();
  ctx.strokeStyle=day?"rgba(98,76,54,.17)":"rgba(255,255,255,.07)";ctx.lineWidth=2;
  for(let x=460;x<2200;x+=90){ctx.beginPath();ctx.moveTo(x,580);ctx.lineTo(x-20,770);ctx.stroke()}
  [[540,500],[690,500],[1080,500],[1290,500],[2140,500]].forEach(([x,y])=>drawTree(x,y,day));
}
function itemColor(item){const key=String(item?.visual||item?.id||"");let h=0;for(const ch of key)h=(h*31+ch.charCodeAt(0))%360;return `hsl(${h} 48% 45%)`}
function drawRankShield(c,x,y,rank){const r=rankMeta(rank);c.save();c.translate(x,y);c.fillStyle=r.color;c.beginPath();c.moveTo(-10,-8);c.lineTo(10,-8);c.lineTo(8,7);c.lineTo(0,14);c.lineTo(-8,7);c.closePath();c.fill();c.fillStyle="#fff";c.font="900 9px system-ui";c.textAlign="center";c.fillText(r.letter,0,3);c.restore()}
function drawName(c,p,gm){
  const label=gm?"GM":String(p.studentId||"USER");c.font="800 14px system-ui";const w=Math.max(gm?76:105,c.measureText(label).width+45);
  c.fillStyle=gm?"rgba(91,22,49,.95)":"rgba(9,28,39,.9)";rr(c,-w/2,-143,w,29,8);c.fill();c.strokeStyle=gm?"#ebc34e":"rgba(255,255,255,.1)";c.lineWidth=2;c.stroke();
  c.fillStyle="#fff";c.textAlign="center";c.fillText(label,0,-124);drawRankShield(c,-w/2+16,-130,gm?GM_RANK:p.rank);drawBubble(c,p);
}
function drawBubble(c,p){
  const m=messagesByUid.get(p.uid);if(!m?.text)return;const dt=m.createdAt?.toDate?.();if(dt&&Date.now()-dt.getTime()>BUBBLE_MS)return;
  const text=String(m.text),lines=[];c.font="600 14px system-ui";let line="";for(const ch of [...text]){const t=line+ch;if(c.measureText(t).width>220&&line){lines.push(line);line=ch}else line=t}if(line)lines.push(line);
  const show=lines.slice(0,3),bw=Math.max(110,Math.min(245,Math.max(...show.map(x=>c.measureText(x).width))+25)),bh=17+show.length*20,by=-164-bh;
  c.fillStyle=p.isAdmin?"#fff3c9":"rgba(255,255,255,.97)";rr(c,-bw/2,by,bw,bh,12);c.fill();c.strokeStyle="rgba(35,55,68,.18)";c.stroke();c.fillStyle="#17364a";c.textAlign="center";show.forEach((ln,i)=>c.fillText(ln,0,by+23+i*20));
}
function drawCharacter(c,p,x,y,now){
  const gm=isGMPlayer(p),moving=!!p.moving,bob=moving?Math.sin(now/75)*3:0;
  c.save();c.translate(x,y+bob);
  if(gm){
    c.strokeStyle="rgba(255,208,77,.72)";c.lineWidth=6;c.beginPath();c.ellipse(0,-35,48,73,0,0,Math.PI*2);c.stroke();
    c.fillStyle="#511b3b";c.beginPath();c.moveTo(-38,-48);c.lineTo(38,-48);c.lineTo(54,36);c.lineTo(0,18);c.lineTo(-54,36);c.closePath();c.fill();
    c.fillStyle="#f0c84e";c.beginPath();c.moveTo(-25,-88);c.lineTo(-20,-117);c.lineTo(-7,-101);c.lineTo(0,-126);c.lineTo(10,-101);c.lineTo(23,-116);c.lineTo(25,-88);c.closePath();c.fill();
    c.fillStyle="#edc49e";c.beginPath();c.arc(0,-72,23,0,Math.PI*2);c.fill();drawName(c,p,true);c.restore();return;
  }
  const char=p.character||{},eq=equipped(char),gender=char.gender==="female"?"female":"male";
  const top=itemById(eq.top),head=itemById(eq.head),back=itemById(eq.back),hand=itemById(eq.hand),pet=itemById(eq.pet),aura=itemById(eq.aura);
  if(aura){c.strokeStyle=itemColor(aura);c.lineWidth=5;c.globalAlpha=.55;c.beginPath();c.ellipse(0,-34,43,67,0,0,Math.PI*2);c.stroke();c.globalAlpha=1}
  if(back){c.font="31px system-ui";c.textAlign="center";c.fillText(back.icon||"🎒",-30,-20)}
  c.fillStyle="rgba(0,0,0,.18)";c.beginPath();c.ellipse(0,30,28,9,0,0,Math.PI*2);c.fill();
  c.fillStyle="#e8bd98";c.fillRect(-13,6,9,30);c.fillRect(5,6,9,30);c.fillStyle="#263442";rr(c,-18,29,17,9,5);c.fill();rr(c,2,29,17,9,5);c.fill();
  c.fillStyle="#315b82";rr(c,-21,-5,42,21,6);c.fill();c.fillStyle=top?itemColor(top):"#f3f0e8";rr(c,-23,-48,46,46,12);c.fill();
  c.fillStyle="#eabf99";rr(c,-33,-40,10,42,6);c.fill();rr(c,23,-40,10,42,6);c.fill();
  if(gender==="female"){c.fillStyle="#2d211e";c.beginPath();c.ellipse(0,-74,28,37,0,0,Math.PI*2);c.fill()}
  c.fillStyle="#efc6a0";c.beginPath();c.arc(0,-74,23,0,Math.PI*2);c.fill();c.fillStyle="#2d211e";c.beginPath();c.arc(0,-82,24,Math.PI,Math.PI*2);c.fill();
  if(head){c.font="27px system-ui";c.textAlign="center";c.fillText(head.icon||"🧢",0,-104)}if(hand){c.font="27px system-ui";c.fillText(hand.icon||"✨",39,-17)}if(pet){c.font="30px system-ui";c.fillText(pet.icon||"🐾",55,12)}
  drawName(c,p,false);c.restore();
}
function drawFrame(now){
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle="#102c3d";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.setTransform(dpr*zoom,0,0,dpr*zoom,-cameraX*dpr*zoom,0);drawWorld(now);
  const list=[...players.values()].map(p=>({...p,x:p.currentX,y:WALK_Y}));
  list.push({uid,studentId:isGM()?"GM":profile.studentId,isAdmin:isGM(),rank:isGM()?GM_RANK:profile.rank,character:isGM()?{gender:"male",equipped:{}}:{gender:profile.character?.gender,equipped:equipped(profile.character)},x:me.x,y:WALK_Y,direction:me.direction,moving:me.moving});
  for(const p of list)drawCharacter(ctx,p,p.x,p.y,now);
}
function loop(now){const dt=Math.min(.04,(now-lastFrame)/1000);lastFrame=now;updateMovement(dt);smoothRemote(dt);updateCamera(dt);drawFrame(now);requestAnimationFrame(loop)}

canvas.onclick=e=>{
  const pt=screenToWorld(e.clientX,e.clientY);
  if(Math.abs(pt.x-WIZARD_X)<95){$("openWizardQuests").click();return}
  if(Math.abs(pt.x-SHOP_X)<175){$("openZoneShop").click();return}
  let selected=null,best=999;for(const p of players.values()){const d=Math.abs(p.currentX-pt.x);if(d<65&&d<best){selected=p;best=d}}if(selected)openPlayerCard(selected);
};
function openPlayerCard(p){
  const gm=isGMPlayer(p);$("zonePlayerCardId").textContent=gm?"GM":String(p.studentId||"USER");$("zonePlayerCardShield").innerHTML=rankShieldHTML(gm?GM_RANK:p.rank);
  $("zonePlayerCardRank").textContent=gm?"GAME MASTER":`${p.rank?.tierName||"Bronze"} · ${Number(p.rank?.rating||0)} Rating`;
  $("zonePlayerCardItemTitle").textContent=gm?"GM EXCLUSIVE":"ไอเท็มที่กำลังสวม";
  const list=gm?GM_ITEMS:equippedItems(p.character).map(x=>x.item);
  $("zonePlayerCardItems").innerHTML=list.length?list.map(i=>`<div><span>${i.icon||"✨"}</span><small>${esc(i.name||"Item")}</small></div>`).join(""):`<div class="empty">ยังไม่ได้สวมไอเท็ม</div>`;
  $("zonePlayerCard").classList.remove("hidden");
}
$("closeZonePlayerCard").onclick=()=>$("zonePlayerCard").classList.add("hidden");

function listenRankingNotice(){
  rankingUnsub?.();rankingUnsub=onSnapshot(doc(db,"system_settings","ranking"),snap=>{
    if(!snap.exists()){$("zoneSystemNotice").classList.add("hidden");return}
    const d=snap.data(),next=d.nextResetAt?.toDate?.();
    if(next&&next.getTime()>Date.now()){$("zoneSystemNotice").textContent=`🏆 รีแรงค์ ${next.toLocaleString("th-TH")}${d.notice?` · ${d.notice}`:""}`;$("zoneSystemNotice").classList.remove("hidden")}else $("zoneSystemNotice").classList.add("hidden");
  },()=>{});
}

async function leaveZone(){
  clearInterval(heartbeat);clearInterval(clockTimer);clearInterval(expiryTimer);clearInterval(dailyCheckinTimer);positionsUnsub?.();messagesUnsub?.();moderationUnsub?.();rankingUnsub?.();questUnsub?.();
  try{await updateDoc(doc(db,"zone_positions",uid),{online:false,updatedAt:serverTimestamp()})}catch{}
  try{await setDoc(doc(db,"presence",uid),{online:false,lastSeenAt:serverTimestamp()},{merge:true})}catch{}
  if(!isGM())try{await updateDoc(doc(db,"users",uid),{zone:{zoneId:ZONE_ID,x:Math.round(me.x),y:WALK_Y,direction:me.direction,lastSeenAt:new Date().toISOString()}})}catch{}
}
function stopRealtime(){blocked=true;keys.clear();touch.left=false;touch.right=false;velocityX=0;clearInterval(heartbeat);positionsUnsub?.();messagesUnsub?.()}
window.onresize=resizeCanvas;window.addEventListener("pagehide",leaveZone);$("leaveZoneButton").onclick=()=>leaveZone();

onAuthStateChanged(auth,async user=>{
  if(!user){showGate("กรุณา Login ก่อน","2D Zone ใช้บัญชีที่ลงทะเบียนแล้ว");return}
  uid=user.uid;if(!(await loadProfile()))return;if(!(await checkModeration()))return;
  hideGate();$("zoneMyStudentId").textContent=isGM()?"GM":profile.studentId;$("zoneChatIdentity").textContent=isGM()?"GM":profile.studentId;
  $("zoneMyShield").innerHTML=rankShieldHTML(isGM()?GM_RANK:profile.rank);$("zoneTokenBalance").textContent=isGM()?"∞":Number(profile.tokenBalance||0).toLocaleString();
  if(isGM()){$("openAdminPanel").classList.remove("hidden");$("leaveZoneButton").href="./admin.html";$("zoneChatInput").placeholder="GM พิมพ์ข้อความหรือประกาศ..."}
  resizeCanvas();updateClock();clockTimer=setInterval(updateClock,1000);startZoneDailyCheckin();await loadQuestProgress();
  listenModeration();listenPositions();listenMessages();listenTeacherQuests();listenRankingNotice();expiryTimer=setInterval(refreshMessages,60000);
  await syncPublicProfile();await publishPresence();await publishPosition(true);heartbeat=setInterval(async()=>{await publishPresence();await publishPosition(true)},PRESENCE_HEARTBEAT_MS);
  requestAnimationFrame(loop);
});
