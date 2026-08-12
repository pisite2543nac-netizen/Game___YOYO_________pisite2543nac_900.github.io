import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc,
  writeBatch, serverTimestamp, onSnapshot, Timestamp, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_UID } from "./firebase-config.js?v=4.1.0";
import { DEFAULT_MODES, DEFAULT_LEVELS } from "./default-data.js?v=4.1.0";
import { seasonIdFromDate, seasonRange, calculateRankMetrics } from "./ranking-system.js?v=4.1.0";

const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),$=id=>document.getElementById(id);
let cache={users:[],attempts:[],levels:[],modes:[],official:[],zonePositions:[],zoneModeration:[],zoneMessages:[]},unsubs=[];

const isAdmin=user=>!!user&&user.uid===ADMIN_UID;
const dateValue=v=>{try{return v?.toDate?.()?.getTime?.()||0}catch{return 0}};
const formatDate=v=>{try{return v?.toDate?.().toLocaleString("th-TH")||"-"}catch{return "-"}};
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

$("adminLoginForm").addEventListener("submit",async e=>{
  e.preventDefault();$("adminLoginError").textContent="";
  try{
    if($("adminUsername").value.trim()!==ADMIN_USERNAME)throw new Error("Username ไม่ถูกต้อง");
    const r=await signInWithEmailAndPassword(auth,ADMIN_EMAIL,$("adminPassword").value);
    if(!isAdmin(r.user)){await signOut(auth);throw new Error("บัญชีนี้ไม่ใช่ Admin")}
  }catch(err){$("adminLoginError").textContent="เข้าสู่ระบบไม่สำเร็จ: "+err.message}
});
$("logoutAdmin").onclick=()=>signOut(auth);

onAuthStateChanged(auth,user=>{
  const ok=isAdmin(user);$("adminLogin").classList.toggle("hidden",ok);$("adminDashboard").classList.toggle("hidden",!ok);
  unsubs.forEach(fn=>fn());unsubs=[];
  if(ok)startRealtime();
});

function startRealtime(){
  unsubs.push(onSnapshot(collection(db,"users"),snap=>{cache.users=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"attempts"),snap=>{cache.attempts=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"levels"),snap=>{cache.levels=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>Number(a.levelNo)-Number(b.levelNo));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"game_modes"),snap=>{cache.modes=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"official_submissions"),snap=>{cache.official=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.submittedAt)-dateValue(a.submittedAt));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"zone_positions"),snap=>{cache.zonePositions=snap.docs.map(d=>({id:d.id,...d.data()}));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"zone_moderation"),snap=>{cache.zoneModeration=snap.docs.map(d=>({id:d.id,...d.data()}));renderAll()}));
  const chatQuery=query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(500));
  unsubs.push(onSnapshot(chatQuery,snap=>{cache.zoneMessages=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.zoneId===ACTIVE_ZONE_ID);renderAll()}));
}
function renderAll(){renderMetrics();renderResults();renderUsers();renderLevels();renderOfficial();renderRanking();renderZoneControl();renderZoneChatLog()}
function renderMetrics(){
  const completed=cache.attempts.filter(x=>x.status==="completed");
  const avg=completed.length?Math.round(completed.reduce((s,x)=>s+Number(x.score||0),0)/completed.length):0;
  $("metricLevels").textContent=cache.levels.length;$("metricUsers").textContent=cache.users.length;
  $("metricCompleted").textContent=completed.length;$("metricAverage").textContent=avg.toLocaleString();
}
function renderResults(){
  $("resultsBody").innerHTML=cache.attempts.map(x=>`<tr><td>${formatDate(x.createdAt)}</td><td>${esc(x.studentId)}</td><td><strong>${esc(x.fullName)}</strong></td><td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td><td>${esc(x.department)}</td><td>${esc(x.modeName)}</td><td>${esc(x.levelNo)}</td><td><span class="status status-${esc(x.status)}">${esc(x.status)}</span></td><td><strong>${Number(x.score||0).toLocaleString()}</strong></td><td>${esc(x.wpm??0)}</td><td>${esc(x.accuracy??0)}%</td><td><button class="mini-delete" data-delete-attempt="${x.id}">ลบ</button></td></tr>`).join("")||`<tr><td colspan="12" class="empty">ยังไม่มีผลการเล่น</td></tr>`;
  document.querySelectorAll("[data-delete-attempt]").forEach(b=>b.onclick=async()=>{if(confirm("ลบผลรายการนี้?"))await deleteDoc(doc(db,"attempts",b.dataset.deleteAttempt))});
}
function renderUsers(){
  $("usersBody").innerHTML=cache.users.map(x=>`<tr><td>${formatDate(x.createdAt)}</td><td>${esc(x.studentId)}</td><td><strong>${esc(x.fullName)}</strong></td><td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td><td>${esc(x.department)}</td><td><strong>${Number(x.tokenBalance||0).toLocaleString()}</strong></td><td><span class="status status-active">${esc(x.status||"active")}</span></td><td><button class="mini-delete" data-delete-user="${x.id}">ลบข้อมูล</button></td></tr>`).join("")||`<tr><td colspan="8" class="empty">ยังไม่มีสมาชิก</td></tr>`;
  document.querySelectorAll("[data-delete-user]").forEach(b=>b.onclick=async()=>{if(confirm("ลบข้อมูลสมาชิกจาก Firestore? หมายเหตุ: บัญชี Authentication ต้องลบใน Firebase Console แยกต่างหาก"))await deleteDoc(doc(db,"users",b.dataset.deleteUser))});
}
function renderLevels(){
  $("levelCards").innerHTML=cache.levels.map(x=>`<article class="level-admin-card"><div><span>LEVEL ${esc(x.levelNo)}</span><h3>${esc(x.title)}</h3><p>${esc(x.language)} · ${esc(x.difficulty)} · ${esc(x.basePoints)} pts</p></div><div class="button-row"><button class="btn ghost btn-small" data-edit-level="${x.id}">แก้ไข</button><button class="btn danger btn-small" data-delete-level="${x.id}">ลบ</button></div></article>`).join("");
  document.querySelectorAll("[data-edit-level]").forEach(b=>b.onclick=()=>{const x=cache.levels.find(l=>l.id===b.dataset.editLevel);if(!x)return;$("editLevelNo").value=x.levelNo;$("editTitle").value=x.title;$("editLanguage").value=x.language;$("editDifficulty").value=x.difficulty;$("editBasePoints").value=x.basePoints;$("editTimeLimit").value=x.timeLimit;$("editMultiplier").value=x.difficultyMultiplier;$("editDescription").value=x.description||"";$("editCode").value=x.code;window.scrollTo({top:$("levelForm").offsetTop-30,behavior:"smooth"})});
  document.querySelectorAll("[data-delete-level]").forEach(b=>b.onclick=async()=>{if(confirm("ลบโจทย์นี้?"))await deleteDoc(doc(db,"levels",b.dataset.deleteLevel))});
}

function renderOfficial(){
  if(!$("officialBody"))return;
  $("officialBody").innerHTML=cache.official.map(x=>`<tr>
    <td>${formatDate(x.submittedAt)}</td>
    <td>${esc(x.studentId)}</td>
    <td><strong>${esc(x.fullName)}</strong></td>
    <td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td>
    <td>${esc(x.department)}</td>
    <td>${esc(x.completedStages||0)}/30</td>
    <td><strong>${Number(x.totalScore||0).toFixed(2)} / ${Number(x.maxScore||40)}</strong></td>
    <td>${Number(x.avgAccuracy||0).toFixed(1)}%</td>
    <td>${Number(x.avgWpm||0).toFixed(1)}</td>
  </tr>`).join("")||`<tr><td colspan="9" class="empty">ยังไม่มีผู้ส่งงานทางการ</td></tr>`;
}

function seasonAttemptsForUser(uid){
  const range=seasonRange(new Date());
  return cache.attempts.filter(a=>{
    if(a.uid!==uid || a.status!=="completed")return false;
    const dt=a.createdAt?.toDate?.();
    return !!dt && dt>=range.start && dt<=range.end;
  });
}

function renderRanking(){
  if(!$("rankingBody"))return;
  const seasonId=seasonIdFromDate(new Date()),range=seasonRange(new Date());
  $("adminSeasonId").textContent=seasonId;
  $("adminSeasonRange").textContent=`${range.start.toLocaleDateString("th-TH")} – ${range.end.toLocaleDateString("th-TH")}`;

  const rows=cache.users.map(u=>{
    const attempts=seasonAttemptsForUser(u.id);
    const days=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size;
    const m=calculateRankMetrics(attempts,days);
    return {user:u,...m};
  }).sort((a,b)=>b.rating-a.rating);

  $("rankingBody").innerHTML=rows.map((r,i)=>`<tr>
    <td><strong>${i+1}</strong></td>
    <td>${esc(r.user.fullName)}<br><small>${esc(r.user.studentId)}</small></td>
    <td><strong>${r.tierIcon} ${r.tierName}</strong></td>
    <td>${r.rating}</td>
    <td>${r.diligence}</td>
    <td>${r.accuracy}</td>
    <td>${r.speed}</td>
    <td>${r.consistency}</td>
    <td>${r.avgWpm}</td>
  </tr>`).join("")||`<tr><td colspan="9" class="empty">ยังไม่มีข้อมูล Ranking</td></tr>`;
}

async function persistRanking(){
  const seasonId=seasonIdFromDate(new Date());
  for(const u of cache.users){
    const attempts=seasonAttemptsForUser(u.id);
    const days=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size;
    const m=calculateRankMetrics(attempts,days);
    await setDoc(doc(db,"rankings",`${seasonId}_${u.id}`),{
      seasonId,uid:u.id,studentId:u.studentId,fullName:u.fullName,...m,updatedAt:serverTimestamp()
    },{merge:true});
    await setDoc(doc(db,"users",u.id),{
      rank:{seasonId,...m,updatedAt:new Date().toISOString()}
    },{merge:true});
  }
}

if($("recalculateRanking"))$("recalculateRanking").onclick=async()=>{
  await persistRanking();
  alert("คำนวณ Ranking Season ปัจจุบันเรียบร้อย");
};

if($("exportOfficialCsv"))$("exportOfficialCsv").onclick=()=>{
  const h=["submitted_at","student_id","name","class","department","completed","score","max_score","accuracy","wpm"];
  const q=v=>`"${String(v??"").replaceAll('"','""')}"`;
  const rows=cache.official.map(x=>[
    formatDate(x.submittedAt),x.studentId,x.fullName,
    `${x.educationLevel||""}${x.classroom||""}`,x.department,
    x.completedStages,x.totalScore,x.maxScore,x.avgAccuracy,x.avgWpm
  ].map(q).join(","));
  downloadFile("official_scores.csv","\ufeff"+h.join(",")+"\n"+rows.join("\n"),"text/csv;charset=utf-8");
};


const ZONE_ONLINE_STALE_MS=95000;
const ACTIVE_ZONE_ID="thai_social_zone_v4_1";

function zonePositionOnline(p){
  if(!p?.online || p.zoneId!==ACTIVE_ZONE_ID)return false;
  const dt=p.updatedAt?.toDate?.();
  return !dt || Date.now()-dt.getTime()<=ZONE_ONLINE_STALE_MS;
}

function activeZoneBan(m){
  const until=m?.bannedUntil?.toDate?.();
  return !!until && until.getTime()>Date.now();
}

function moderationFor(uid){
  return cache.zoneModeration.find(x=>x.id===uid)||null;
}

function zonePositionFor(uid){
  return cache.zonePositions.find(x=>x.id===uid)||null;
}

function banUntilText(m){
  if(!activeZoneBan(m))return "-";
  return m.bannedUntil.toDate().toLocaleString("th-TH");
}

function durationMs(value,unit){
  const n=Math.max(1,Number(value)||1);
  if(unit==="hour")return n*60*60*1000;
  if(unit==="day")return n*24*60*60*1000;
  return n*60*1000;
}

function renderZoneControl(){
  if(!$("zoneControlBody"))return;

  const onlineCount=cache.users.filter(u=>zonePositionOnline(zonePositionFor(u.id))).length;
  const bannedCount=cache.users.filter(u=>activeZoneBan(moderationFor(u.id))).length;
  $("zoneOnlineMetric").textContent=onlineCount;
  $("zoneBannedMetric").textContent=bannedCount;

  const rows=[...cache.users].sort((a,b)=>{
    const ao=zonePositionOnline(zonePositionFor(a.id));
    const bo=zonePositionOnline(zonePositionFor(b.id));
    if(ao!==bo)return bo-ao;
    const ab=activeZoneBan(moderationFor(a.id));
    const bb=activeZoneBan(moderationFor(b.id));
    if(ab!==bb)return bb-ab;
    return String(a.studentId||"").localeCompare(String(b.studentId||""));
  });

  $("zoneControlBody").innerHTML=rows.map(u=>{
    const pos=zonePositionFor(u.id);
    const mod=moderationFor(u.id);
    const online=zonePositionOnline(pos);
    const banned=activeZoneBan(mod);

    return `<tr class="${banned?"zone-row-banned":online?"zone-row-online":""}">
      <td><strong>${esc(u.studentId||"-")}</strong></td>
      <td>${esc(u.fullName||"-")}</td>
      <td>${esc(u.rank?.tierName||"Bronze")} · ${Number(u.rank?.rating||0)}</td>
      <td><span class="zone-admin-status ${banned?"banned":online?"online":"offline"}">${banned?"BANNED":online?"ONLINE":"OFFLINE"}</span></td>
      <td>${formatDate(pos?.updatedAt)}</td>
      <td>${banUntilText(mod)}</td>
      <td><input class="zone-ban-reason" data-ban-reason="${u.id}" value="${esc(mod?.banReason||"")}" placeholder="เหตุผล (ไม่บังคับ)"></td>
      <td>
        <div class="zone-ban-duration">
          <input data-ban-value="${u.id}" type="number" min="1" max="365" value="30">
          <select data-ban-unit="${u.id}">
            <option value="minute">นาที</option>
            <option value="hour">ชั่วโมง</option>
            <option value="day">วัน</option>
          </select>
        </div>
      </td>
      <td>
        <div class="zone-admin-actions">
          <button class="btn zone-kick-btn" data-zone-kick="${u.id}" ${online&&!banned?"":"disabled"}>เตะ</button>
          <button class="btn danger" data-zone-ban="${u.id}">${banned?"ต่อเวลาแบน":"แบน"}</button>
          <button class="btn ghost" data-zone-unban="${u.id}" ${banned?"":"disabled"}>ปลดแบน</button>
        </div>
      </td>
    </tr>`;
  }).join("")||`<tr><td colspan="9" class="empty">ยังไม่มี User</td></tr>`;

  document.querySelectorAll("[data-zone-kick]").forEach(btn=>{
    btn.onclick=()=>kickZoneUser(btn.dataset.zoneKick);
  });
  document.querySelectorAll("[data-zone-ban]").forEach(btn=>{
    btn.onclick=()=>banZoneUser(btn.dataset.zoneBan);
  });
  document.querySelectorAll("[data-zone-unban]").forEach(btn=>{
    btn.onclick=()=>unbanZoneUser(btn.dataset.zoneUnban);
  });
}

async function setZoneOffline(uid){
  try{
    await setDoc(doc(db,"zone_positions",uid),{
      zoneId:"thai_social_zone_v4_1",
      online:false,
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("setZoneOffline:",error)}
}

async function kickZoneUser(uid){
  const user=cache.users.find(x=>x.id===uid);
  if(!user)return;
  const reason=$(`[data-ban-reason="${uid}"]`)?.value?.trim()||"GM เตะออกจาก 2D Zone";

  if(!confirm(`เตะ ${user.studentId} ออกจาก 2D Zone?`))return;

  await setDoc(doc(db,"zone_moderation",uid),{
    uid,
    studentId:user.studentId||"",
    kickedUntil:Timestamp.fromMillis(Date.now()+15000),
    kickReason:reason,
    kickedAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  },{merge:true});

  await setZoneOffline(uid);
}

async function banZoneUser(uid){
  const user=cache.users.find(x=>x.id===uid);
  if(!user)return;

  const value=$(`[data-ban-value="${uid}"]`)?.value||30;
  const unit=$(`[data-ban-unit="${uid}"]`)?.value||"minute";
  const reason=$(`[data-ban-reason="${uid}"]`)?.value?.trim()||"ระงับการเข้าใช้งาน 2D Zone โดย GM";
  const ms=durationMs(value,unit);
  const until=new Date(Date.now()+ms);

  if(!confirm(`แบน ${user.studentId} ถึง ${until.toLocaleString("th-TH")} ?`))return;

  await setDoc(doc(db,"zone_moderation",uid),{
    uid,
    studentId:user.studentId||"",
    bannedUntil:Timestamp.fromMillis(until.getTime()),
    banReason:reason,
    bannedAt:serverTimestamp(),
    kickedUntil:Timestamp.fromMillis(Date.now()+15000),
    updatedAt:serverTimestamp()
  },{merge:true});

  await setZoneOffline(uid);
}

async function unbanZoneUser(uid){
  const user=cache.users.find(x=>x.id===uid);
  if(!user)return;
  if(!confirm(`ปลดแบน ${user.studentId} ?`))return;

  await setDoc(doc(db,"zone_moderation",uid),{
    bannedUntil:Timestamp.fromMillis(0),
    banReason:"",
    unbannedAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  },{merge:true});
}


const USER_ZONE_CHAT_TTL_MS=24*60*60*1000;
function zoneChatIsGM(m){return m?.isGM===true || m?.uid===ADMIN_UID}
function zoneChatVisible(m,now=Date.now()){
  if(zoneChatIsGM(m))return true;
  const created=m?.createdAt?.toDate?.();
  return !!created && (now-created.getTime())<USER_ZONE_CHAT_TTL_MS;
}
function zoneChatExpired(m,now=Date.now()){
  if(zoneChatIsGM(m))return false;
  const created=m?.createdAt?.toDate?.();
  return !!created && (now-created.getTime())>=USER_ZONE_CHAT_TTL_MS;
}
function zoneChatUserName(m){
  if(zoneChatIsGM(m))return "Game Master";
  return cache.users.find(u=>u.id===m.uid)?.fullName||"-";
}
function zoneChatExpiryLabel(m){
  if(zoneChatIsGM(m))return "ถาวร";
  const created=m?.createdAt?.toDate?.();
  const until=created?created.getTime()+USER_ZONE_CHAT_TTL_MS:Date.now();
  const left=Math.max(0,until-Date.now()),h=Math.floor(left/3600000),min=Math.floor((left%3600000)/60000);
  return left>0?`${h}ชม. ${min}น.`:"หมดอายุ";
}
function renderZoneChatLog(){
  if(!$("zoneChatAdminList"))return;
  const visible=cache.zoneMessages.filter(zoneChatVisible);
  const user24=visible.filter(m=>!zoneChatIsGM(m)).length,gmCount=visible.filter(zoneChatIsGM).length;
  $("zoneChat24hMetric").textContent=user24;$("zoneChatGmMetric").textContent=gmCount;$("zoneChatTotalMetric").textContent=visible.length;
  $("zoneChatAdminList").innerHTML=visible.length?visible.map(m=>{
    const gm=zoneChatIsGM(m),dt=m.createdAt?.toDate?.();
    return `<article class="admin-zone-chat-message ${gm?"gm":"user"}">
      <div class="admin-zone-chat-avatar">${gm?"GM":esc(String(m.studentId||"?").slice(-2))}</div>
      <div class="admin-zone-chat-content">
        <div class="admin-zone-chat-meta"><strong>${gm?"GM · GAME MASTER":esc(m.studentId||"USER")}</strong><span>${esc(zoneChatUserName(m))}</span><time>${dt?dt.toLocaleString("th-TH"):"-"}</time></div>
        <p>${esc(m.text||"")}</p>
        <small>${gm?"ประกาศ GM · ไม่หมดอายุ":`ข้อความ User · เหลือ ${zoneChatExpiryLabel(m)}`}</small>
      </div>
      <button class="mini-delete" data-delete-zone-message="${m.id}">ลบ</button>
    </article>`;
  }).join(""):`<div class="empty">ยังไม่มีข้อความใน Zone</div>`;
  document.querySelectorAll("[data-delete-zone-message]").forEach(btn=>btn.onclick=async()=>{if(confirm("ลบข้อความนี้?"))await deleteDoc(doc(db,"zone_messages",btn.dataset.deleteZoneMessage))});
}
async function cleanupExpiredZoneMessages(showAlert=true){
  const expired=cache.zoneMessages.filter(zoneChatExpired);
  if(!expired.length){if(showAlert)alert("ไม่มี User Chat ที่หมดอายุ");return 0}
  let batch=writeBatch(db),count=0,total=0;
  for(const m of expired){batch.delete(doc(db,"zone_messages",m.id));count++;total++;if(count>=400){await batch.commit();batch=writeBatch(db);count=0}}
  if(count)await batch.commit();if(showAlert)alert(`ล้างข้อความหมดอายุ ${total} รายการแล้ว`);return total;
}
if($("cleanupExpiredZoneChat"))$("cleanupExpiredZoneChat").onclick=()=>cleanupExpiredZoneMessages(true);
if($("exportZoneChatCsv"))$("exportZoneChatCsv").onclick=()=>{
  const rows=cache.zoneMessages.filter(zoneChatVisible),q=v=>`"${String(v??"").replaceAll('"','""')}"`;
  const data=[["date","type","student_id","name","message","expires"].join(","),...rows.map(m=>[
    formatDate(m.createdAt),zoneChatIsGM(m)?"GM":"USER",zoneChatIsGM(m)?"GM":m.studentId,zoneChatUserName(m),m.text,zoneChatIsGM(m)?"PERMANENT":zoneChatExpiryLabel(m)
  ].map(q).join(","))].join("\n");
  downloadText(`zone_chat_${new Date().toISOString().slice(0,10)}.csv`,"\ufeff"+data,"text/csv;charset=utf-8");
};

$("levelForm").addEventListener("submit",async e=>{e.preventDefault();const n=Number($("editLevelNo").value),id=`level_${String(n).padStart(2,"0")}`;await setDoc(doc(db,"levels",id),{levelNo:n,title:$("editTitle").value.trim(),language:$("editLanguage").value.trim(),difficulty:$("editDifficulty").value,basePoints:Number($("editBasePoints").value),timeLimit:Number($("editTimeLimit").value),difficultyMultiplier:Number($("editMultiplier").value),description:$("editDescription").value.trim(),code:$("editCode").value,isActive:true,updatedAt:serverTimestamp()},{merge:true});e.target.reset();$("editBasePoints").value=100;$("editTimeLimit").value=90;$("editMultiplier").value=1});
$("seedDefaults").onclick=async()=>{if(!confirm("คืนค่า 4 โหมดและ 12 Level เริ่มต้น?"))return;const batch=writeBatch(db);DEFAULT_MODES.forEach(x=>{const {id,...data}=x;batch.set(doc(db,"game_modes",id),{...data,id,isActive:true},{merge:true})});DEFAULT_LEVELS.forEach(x=>batch.set(doc(db,"levels",`level_${String(x.levelNo).padStart(2,"0")}`),{...x,isActive:true},{merge:true}));await batch.commit()};
async function deleteCollectionDocs(name){const rows=await getDocs(collection(db,name));let batch=writeBatch(db),count=0;for(const item of rows.docs){batch.delete(item.ref);if(++count>=450){await batch.commit();batch=writeBatch(db);count=0}}if(count)await batch.commit()}
$("deleteResults").onclick=async()=>{if(confirm("ยืนยันลบผลทั้งหมด?"))await deleteCollectionDocs("attempts")};
$("deleteUsers").onclick=async()=>{if(confirm("ยืนยันลบข้อมูลสมาชิกทั้งหมดจาก Firestore? บัญชี Authentication จะไม่ถูกลบ"))await deleteCollectionDocs("users")};
function downloadFile(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
$("exportCsv").onclick=()=>{const h=["date","student_id","name","level","classroom","department","mode","game_level","status","score","wpm","accuracy","mistakes","time_seconds"],q=v=>`"${String(v??"").replaceAll('"','""')}"`,rows=cache.attempts.map(x=>[formatDate(x.createdAt),x.studentId,x.fullName,x.educationLevel,x.classroom,x.department,x.modeName,x.levelNo,x.status,x.score,x.wpm,x.accuracy,x.mistakes,x.elapsedSeconds].map(q).join(","));downloadFile("code_typing_results.csv","\ufeff"+h.join(",")+"\n"+rows.join("\n"),"text/csv;charset=utf-8")};
$("exportJson").onclick=()=>downloadFile("code_typing_backup.json",JSON.stringify({exportedAt:new Date().toISOString(),game_modes:cache.modes,levels:cache.levels,users:cache.users,attempts:cache.attempts},(k,v)=>v?.toDate?.()?v.toDate().toISOString():v,2),"application/json");
$("importJson").addEventListener("change",async e=>{const f=e.target.files[0];if(!f||!confirm("นำเข้าข้อมูล JSON?"))return;const data=JSON.parse(await f.text());for(const [name,rows] of Object.entries({game_modes:data.game_modes||[],levels:data.levels||[],users:data.users||[],attempts:data.attempts||[]})){for(const row of rows){const id=row.id||doc(collection(db,name)).id,copy={...row};delete copy.id;await setDoc(doc(db,name,id),copy,{merge:true})}}alert("นำเข้าสำเร็จ")});
document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".admin-tab-panel").forEach(x=>x.classList.add("hidden"));btn.classList.add("active");$(btn.dataset.tab).classList.remove("hidden")});
