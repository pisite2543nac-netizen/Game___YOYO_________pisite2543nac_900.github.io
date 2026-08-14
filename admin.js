import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc,
  writeBatch, serverTimestamp, onSnapshot, Timestamp, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";
import { firebaseConfig, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_UID } from "./firebase-config.js?v=4.9.0";
import { DEFAULT_MODES, DEFAULT_LEVELS } from "./default-data.js?v=4.9.0";
import { seasonIdFromDate, seasonRange, calculateRankMetrics, rankingClassKey } from "./ranking-system.js?v=4.9.0";
import { DEFAULT_TEACHER_QUESTS, clampQuestReward, questDifficultyName, questObjectiveLabel, defaultMinRankForDifficulty, rewardRange } from "./quest-system.js?v=4.9.0";

const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),cloudFunctions=getFunctions(app,"asia-southeast1"),$=id=>document.getElementById(id);
const adminResetStudentPassword=httpsCallable(cloudFunctions,"adminResetStudentPassword");
let cache={users:[],attempts:[],levels:[],modes:[],official:[],zonePositions:[],zoneModeration:[],zoneMessages:[],zoneArchive:[],rankingSettings:{},teacherQuests:[]},unsubs=[];
let knownUserIds=null;
let selectedAdminClass="";
let adminClassSearchTerm="";
let selectedAdminDepartment="";
let adminDepartmentSearchTerm="";
let selectedAdminMajor="";
let adminMajorSearchTerm="";
let adminRankClock=null;
let passwordResetTargetUid=null;

const isAdmin=user=>!!user&&user.uid===ADMIN_UID;
const dateValue=v=>{try{return v?.toDate?.()?.getTime?.()||0}catch{return 0}};
const formatDate=v=>{try{return v?.toDate?.().toLocaleString("th-TH")||"-"}catch{return "-"}};
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

function showAdminToast(title,message="",isError=false){
  const box=$("adminToast");if(!box)return;
  box.classList.remove("hidden","error");if(isError)box.classList.add("error");
  box.innerHTML=`<strong>${esc(title)}</strong><span>${esc(message)}</span>`;
  clearTimeout(showAdminToast.timer);
  showAdminToast.timer=setTimeout(()=>box.classList.add("hidden"),4500);
}

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
  clearInterval(adminRankClock);adminRankClock=null;
  if(ok){startRealtime();adminRankClock=setInterval(()=>{renderRanking();renderClassrooms();renderDepartments();renderMajors();renderRankingSchedule()},30000);}
});

function startRealtime(){
  unsubs.push(onSnapshot(collection(db,"users"),snap=>{
    const next=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));
    const nextIds=new Set(next.map(x=>x.id));
    if(knownUserIds){next.filter(x=>!knownUserIds.has(x.id)).forEach(x=>showAdminToast(`สมาชิกใหม่ ${x.studentId||""}`,x.fullName||"ลงทะเบียนเรียบร้อย"));}
    knownUserIds=nextIds;cache.users=next;renderAll();
  },error=>showAdminToast("Users Realtime ขัดข้อง",error.message||String(error),true)));
  unsubs.push(onSnapshot(collection(db,"attempts"),snap=>{cache.attempts=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"levels"),snap=>{cache.levels=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>Number(a.levelNo)-Number(b.levelNo));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"game_modes"),snap=>{cache.modes=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"official_submissions"),snap=>{cache.official=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.submittedAt)-dateValue(a.submittedAt));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"zone_positions"),snap=>{cache.zonePositions=snap.docs.map(d=>({id:d.id,...d.data()}));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"zone_moderation"),snap=>{cache.zoneModeration=snap.docs.map(d=>({id:d.id,...d.data()}));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"teacher_quests"),snap=>{cache.teacherQuests=snap.docs.map(d=>({id:d.id,...d.data()}));renderAll()},error=>console.warn("teacher quests:",error)));
  unsubs.push(onSnapshot(doc(db,"system_settings","ranking"),snap=>{cache.rankingSettings=snap.exists()?snap.data():{};renderAll()},error=>console.warn("ranking settings:",error)));
  const chatQuery=query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(500));
  unsubs.push(onSnapshot(chatQuery,snap=>{cache.zoneMessages=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.zoneId===ACTIVE_ZONE_ID);renderAll()},error=>console.warn("live zone chat:",error)));
  const archiveQuery=query(collection(db,"zone_chat_archive"),orderBy("createdAt","desc"),limit(1000));
  unsubs.push(onSnapshot(archiveQuery,snap=>{cache.zoneArchive=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.zoneId===ACTIVE_ZONE_ID);renderAll()},error=>{cache.zoneArchive=[];console.warn("zone archive:",error)}));
}
function renderAll(){renderMetrics();renderResults();renderUsers();renderClassrooms();renderDepartments();renderMajors();renderLevels();renderOfficial();renderRanking();renderRankingSchedule();renderTeacherQuests();renderZoneControl();renderZoneChatLog()}
function renderMetrics(){
  const completed=cache.attempts.filter(x=>x.status==="completed");
  const avg=completed.length?Math.round(completed.reduce((s,x)=>s+Number(x.score||0),0)/completed.length):0;
  $("metricLevels").textContent=cache.levels.length;$("metricUsers").textContent=cache.users.length;
  $("metricCompleted").textContent=completed.length;$("metricAverage").textContent=avg.toLocaleString();if($("metricClasses"))$("metricClasses").textContent=new Set(cache.users.map(u=>rankingClassKey(u.educationLevel,u.classroom)).filter(Boolean)).size;
}
function renderResults(){
  $("resultsBody").innerHTML=cache.attempts.map(x=>{
    const stage=x.stage??x.levelNo??"-";
    const mode=x.modeName||x.mode||"-";
    const pvp=x.pvpResult?` · ${String(x.pvpResult).toUpperCase()}`:"";
    return `<tr><td>${formatDate(x.createdAt)}</td><td>${esc(x.studentId)}</td><td><strong>${esc(x.fullName)}</strong></td><td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td><td>${esc(x.department||"ไม่ระบุแผนก")}</td><td>${esc(x.major||"ไม่ระบุสาขาวิชา")}</td><td>${esc(mode)}${esc(pvp)}</td><td>${esc(stage)}</td><td><span class="status status-${esc(x.status)}">${esc(x.status)}</span></td><td><strong>${Number(x.score||0).toLocaleString()}</strong></td><td>${esc(x.wpm??0)}</td><td>${esc(x.accuracy??0)}%</td><td><button class="mini-delete" data-delete-attempt="${x.id}">ลบ</button></td></tr>`;
  }).join("")||`<tr><td colspan="13" class="empty">ยังไม่มีผลการเล่น</td></tr>`;
  document.querySelectorAll("[data-delete-attempt]").forEach(b=>b.onclick=async()=>{if(confirm("ลบผลรายการนี้?"))await deleteDoc(doc(db,"attempts",b.dataset.deleteAttempt))});
}
function compareStudentId(a,b){
  const av=String(a?.studentId??""),bv=String(b?.studentId??"");
  return av.localeCompare(bv,"th",{numeric:true,sensitivity:"base"});
}
function renderUsers(){
  const users=[...cache.users].sort(compareStudentId);
  $("usersBody").innerHTML=users.map(x=>`<tr><td>${formatDate(x.createdAt)}</td><td>${esc(x.studentId)}</td><td><strong>${esc(x.fullName)}</strong></td><td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td><td>${esc(x.department||"ไม่ระบุแผนก")}</td><td>${esc(x.major||"ไม่ระบุสาขาวิชา")}</td><td><strong>${Number(x.tokenBalance||0).toLocaleString()}</strong></td><td><span class="status status-active">${esc(x.status||"active")}</span></td><td><button class="btn btn-small secondary" data-reset-password="${x.id}">ตั้งรหัสใหม่</button></td><td><button class="mini-delete" data-delete-user="${x.id}">ลบข้อมูล</button></td></tr>`).join("")||`<tr><td colspan="10" class="empty">ยังไม่มีสมาชิก</td></tr>`;
  document.querySelectorAll("[data-delete-user]").forEach(b=>b.onclick=async()=>{if(confirm("ลบข้อมูลสมาชิกจาก Firestore? หมายเหตุ: บัญชี Authentication ต้องลบใน Firebase Console แยกต่างหาก"))await deleteDoc(doc(db,"users",b.dataset.deleteUser))});
  document.querySelectorAll("[data-reset-password]").forEach(btn=>btn.onclick=()=>{
    const user=cache.users.find(x=>x.id===btn.dataset.resetPassword);if(!user)return;
    passwordResetTargetUid=user.id;
    $("passwordResetStudent").textContent=user.studentId||"-";$("passwordResetName").textContent=user.fullName||"-";
    $("adminNewStudentPassword").value="";$("passwordResetModal").classList.remove("hidden");
  });
}
function randomTemporaryPassword(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";let out="";
  crypto.getRandomValues(new Uint32Array(10)).forEach(n=>out+=chars[n%chars.length]);return out;
}
if($("generateStudentPassword"))$("generateStudentPassword").onclick=()=>{$("adminNewStudentPassword").value=randomTemporaryPassword()};
if($("closePasswordResetModal"))$("closePasswordResetModal").onclick=()=>$("passwordResetModal").classList.add("hidden");
if($("confirmStudentPasswordReset"))$("confirmStudentPasswordReset").onclick=async()=>{
  const password=$("adminNewStudentPassword").value;if(!passwordResetTargetUid||password.length<6){alert("รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร");return}
  if(!confirm("ยืนยันตั้งรหัสผ่านใหม่ให้นักศึกษารายนี้?"))return;
  try{
    await adminResetStudentPassword({targetUid:passwordResetTargetUid,newPassword:password});
    $("passwordResetModal").classList.add("hidden");showAdminToast("ตั้งรหัสผ่านใหม่สำเร็จ","แจ้งรหัสใหม่ให้นักศึกษาได้เลย");
  }catch(error){showAdminToast("ตั้งรหัสผ่านไม่สำเร็จ",error.message||String(error),true)}
};
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
    <td>${esc(x.department||"ไม่ระบุแผนก")}</td>
    <td>${esc(x.major||"ไม่ระบุสาขาวิชา")}</td>
    <td>${esc(x.completedStages||0)}/30</td>
    <td><strong>${Number(x.totalScore||0).toFixed(2)} / ${Number(x.maxScore||40)}</strong></td>
    <td>${Number(x.avgAccuracy||0).toFixed(1)}%</td>
    <td>${Number(x.avgWpm||0).toFixed(1)}</td>
  </tr>`).join("")||`<tr><td colspan="13" class="empty">ยังไม่มีผู้ส่งงานทางการ</td></tr>`;
}

function tsMillis(v){
  try{return v?.toMillis?.()??v?.toDate?.()?.getTime?.()??0}catch{return 0}
}
function rankResetBoundaryMs(now=Date.now()){
  const cfg=cache.rankingSettings||{};
  const last=tsMillis(cfg.lastResetAt);
  const next=tsMillis(cfg.nextResetAt);
  return Math.max(last,(next&&next<=now)?next:0);
}
function effectiveSeasonRange(){
  const range=seasonRange(new Date()),boundary=rankResetBoundaryMs();
  return {start:new Date(Math.max(range.start.getTime(),boundary||0)),end:range.end,boundary};
}
function seasonAttemptsForUser(uid){
  const range=effectiveSeasonRange();
  return cache.attempts.filter(a=>{
    if(a.uid!==uid || a.status!=="completed")return false;
    const dt=a.createdAt?.toDate?.();
    return !!dt && dt>=range.start && dt<=range.end;
  });
}
function adminRankShieldHTML(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase(),letter={bronze:"B",silver:"S",gold:"G",platinum:"P",diamond:"D",master:"M"}[id]||"B";
  return `<span class="rank-shield rank-${id}" title="${esc(rank.tierName||"Bronze")} · ${Number(rank.rating||0)}"><span class="rank-shield-letter">${letter}</span></span>`;
}
function isClassicAttempt(a){return a.status==="completed" && String(a.modeName||a.mode||"").toLowerCase()==="classic"}
function userNormalScore(uid){return cache.attempts.filter(a=>a.uid===uid&&isClassicAttempt(a)).reduce((sum,a)=>sum+Number(a.score||0),0)}
function userPlayedStages(uid){
  const keys=new Set(cache.attempts.filter(a=>a.uid===uid&&isClassicAttempt(a)).map(a=>`${a.languageId||a.language||"?"}:${a.stage??a.levelNo??a.lessonId??"?"}`));
  return keys.size;
}
function officialForUser(uid){return cache.official.find(x=>x.uid===uid||x.id===uid)||null}
function classKeyForUser(u){return rankingClassKey(u.educationLevel,u.classroom)||"ไม่ระบุห้อง"}
function departmentKeyForUser(u){return rankingDepartmentKey(u)}
function majorKeyForUser(u){return rankingMajorKey(u)}
function assignScopedPosition(rows,keyName,positionName){
  const groups=new Map();
  rows.forEach(r=>{const key=r[keyName];if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)});
  for(const list of groups.values()){
    list.sort((a,b)=>b.rating-a.rating||compareStudentId(a.user,b.user));
    list.forEach((r,i)=>r[positionName]=i+1);
  }
}
function buildAdminRankingRows(){
  const rows=cache.users.map(u=>{
    const attempts=seasonAttemptsForUser(u.id);
    const days=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size;
    const m=calculateRankMetrics(attempts,days);
    return {user:u,classKey:classKeyForUser(u),departmentKey:departmentKeyForUser(u),majorKey:majorKeyForUser(u),...m};
  }).sort((a,b)=>b.rating-a.rating||compareStudentId(a.user,b.user));
  rows.forEach((r,i)=>r.globalPosition=i+1);
  assignScopedPosition(rows,"classKey","classPosition");
  assignScopedPosition(rows,"departmentKey","departmentPosition");
  assignScopedPosition(rows,"majorKey","majorPosition");
  return rows;
}
function adminClassKeys(){
  return [...new Set(cache.users.map(classKeyForUser))]
    .sort((a,b)=>a.localeCompare(b,"th",{numeric:true,sensitivity:"base"}));
}
function normalizeRoomSearch(v){
  return String(v||"").toLowerCase().replace(/\s+/g,"").replace(/\./g,"").replace(/ห้อง/g,"");
}
function roomLevelLabel(room){
  const m=String(room).match(/^(ปวช|ปวส)\.?(\d)/i);
  return m?`${m[1]}.${m[2]}`:"อื่น ๆ";
}
function adminDepartmentKeys(){
  return [...new Set(cache.users.map(departmentKeyForUser))].sort((a,b)=>a.localeCompare(b,"th",{numeric:true,sensitivity:"base"}));
}
function adminMajorKeys(){
  return [...new Set(cache.users.map(majorKeyForUser))].sort((a,b)=>a.localeCompare(b,"th",{numeric:true,sensitivity:"base"}));
}
function syncAdminClassSelectors(){
  const classes=adminClassKeys(),classSel=$("adminRankingClassFilter"),departmentSel=$("adminRankingDepartmentFilter"),majorSel=$("adminRankingMajorFilter");
  if(classSel){
    const old=classSel.value;
    classSel.innerHTML=`<option value="">ทุกห้อง</option>`+classes.map(k=>`<option value="${esc(k)}">${esc(k)}</option>`).join("");
    classSel.value=classes.includes(old)?old:"";
  }
  const departments=adminDepartmentKeys();
  if(departmentSel){
    const old=departmentSel.value;
    departmentSel.innerHTML=`<option value="">ทุกแผนก</option>`+departments.map(k=>`<option value="${esc(k)}">${esc(k)}</option>`).join("");
    departmentSel.value=departments.includes(old)?old:"";
  }
  const majors=adminMajorKeys();
  if(majorSel){
    const old=majorSel.value;
    majorSel.innerHTML=`<option value="">ทุกสาขาวิชา</option>`+majors.map(k=>`<option value="${esc(k)}">${esc(k)}</option>`).join("");
    majorSel.value=majors.includes(old)?old:"";
  }
  if(selectedAdminClass&&!classes.includes(selectedAdminClass))selectedAdminClass="";
}
function filteredAdminClassKeys(){
  const keys=adminClassKeys(),q=normalizeRoomSearch(adminClassSearchTerm);
  return q?keys.filter(k=>normalizeRoomSearch(k).includes(q)):keys;
}
function groupRoomKeys(keys){
  const order=["ปวช.1","ปวช.2","ปวช.3","ปวส.1","ปวส.2","อื่น ๆ"];
  const map=new Map(order.map(x=>[x,[]]));
  keys.forEach(k=>{
    const level=roomLevelLabel(k);
    if(!map.has(level))map.set(level,[]);
    map.get(level).push(k);
  });
  return [...map.entries()].filter(([,v])=>v.length);
}
function renderClassrooms(){
  if(!$("adminClassroomBody"))return;
  syncAdminClassSelectors();

  const rankingRows=buildAdminRankingRows(),allKeys=adminClassKeys(),keys=filteredAdminClassKeys();
  const q=normalizeRoomSearch(adminClassSearchTerm);
  const exact=keys.find(k=>normalizeRoomSearch(k)===q);
  if(exact)selectedAdminClass=exact;
  if(!selectedAdminClass&&keys.length===1)selectedAdminClass=keys[0];
  if(selectedAdminClass&&!allKeys.includes(selectedAdminClass))selectedAdminClass="";

  $("adminRoomTotal").textContent=`${allKeys.length} ห้อง`;
  $("adminRoomSearchResult").textContent=adminClassSearchTerm
    ? `พบ ${keys.length} ห้อง จากคำค้น “${adminClassSearchTerm}”`
    : "แสดงทุกห้อง";

  const groups=groupRoomKeys(keys);
  $("adminClassroomCards").innerHTML=groups.length?groups.map(([level,roomKeys])=>`
    <section class="admin-room-group">
      <div class="admin-room-group-title"><strong>${esc(level)}</strong><span>${roomKeys.length} ห้อง</span></div>
      <div class="admin-room-buttons">
        ${roomKeys.map(k=>{
          const members=rankingRows.filter(r=>r.classKey===k);
          const online=members.filter(r=>zonePositionOnline(zonePositionFor(r.user.id))).length;
          return `<button class="admin-room-button ${k===selectedAdminClass?"active":""}" data-admin-class="${esc(k)}">
            <span>${esc(k)}</span>
            <small>${members.length} คน${online?` · 🟢 ${online} online`:""}</small>
          </button>`;
        }).join("")}
      </div>
    </section>
  `).join(""):`<div class="admin-room-no-result">ไม่พบห้อง “${esc(adminClassSearchTerm)}”</div>`;

  document.querySelectorAll("[data-admin-class]").forEach(btn=>btn.onclick=()=>{
    selectedAdminClass=btn.dataset.adminClass;
    renderClassrooms();
    document.querySelector(".admin-room-table-wrap")?.scrollIntoView({behavior:"smooth",block:"nearest"});
  });

  if(!selectedAdminClass){
    $("adminClassroomTitle").textContent="เลือกห้องด้านบน";
    $("adminClassroomSummary").textContent="ยังไม่ได้เลือกห้อง";
    $("adminClassroomBody").innerHTML=`<tr><td colspan="13" class="empty">ค้นหาแล้วกดเลือกห้อง เช่น ปวช.2/1</td></tr>`;
    return;
  }

  const list=rankingRows.filter(r=>r.classKey===selectedAdminClass).sort((a,b)=>compareStudentId(a.user,b.user));
  $("adminClassroomTitle").textContent=selectedAdminClass;
  $("adminClassroomSummary").textContent=`${list.length} คน · เรียงตามรหัสนักศึกษาจากน้อยไปมาก`;
  $("adminClassroomBody").innerHTML=list.map((r,index)=>{
    const official=officialForUser(r.user.id),normal=userNormalScore(r.user.id),stages=userPlayedStages(r.user.id);
    return `<tr>
      <td>${index+1}</td><td><strong>${esc(r.user.studentId||"-")}</strong></td><td>${esc(r.user.fullName||"-")}</td>
      <td>${adminRankShieldHTML(r)}<br><small>${esc(r.tierName)} · ${r.rating}</small></td><td><strong>${stages}</strong></td>
      <td>${normal.toLocaleString()}</td><td><strong>${Number(official?.totalScore||0).toFixed(2)}</strong> / 40</td>
      <td><strong>#${r.classPosition||"-"}</strong> · ${r.rating}</td><td><strong>#${r.departmentPosition||"-"}</strong> · ${r.rating}</td><td><strong>#${r.majorPosition||"-"}</strong> · ${r.rating}</td><td><strong>#${r.globalPosition}</strong> · ${r.rating}</td>
      <td>${Number(r.user.tokenBalance||0).toLocaleString()}</td>
    </tr>`;
  }).join("")||`<tr><td colspan="13" class="empty">ยังไม่มีสมาชิกในห้องนี้</td></tr>`;
}
if($("adminClassSearchInput"))$("adminClassSearchInput").addEventListener("input",e=>{
  adminClassSearchTerm=e.target.value.trim();renderClassrooms();
});
if($("clearAdminClassSearch"))$("clearAdminClassSearch").onclick=()=>{
  adminClassSearchTerm="";
  if($("adminClassSearchInput"))$("adminClassSearchInput").value="";
  renderClassrooms();
};
if($("adminRankingClassFilter"))$("adminRankingClassFilter").onchange=()=>renderRanking();

function filterNamedKeys(keys,term){
  const q=String(term||"").toLowerCase().replace(/\s+/g,"");
  return q?keys.filter(k=>String(k).toLowerCase().replace(/\s+/g,"").includes(q)):keys;
}
function scopedAdminRow(r,index,scope){
  const official=officialForUser(r.user.id),normal=userNormalScore(r.user.id),stages=userPlayedStages(r.user.id);
  const scopeFirst=scope==="department"
    ?`<td>${esc(r.majorKey)}</td><td>${esc(r.classKey)}</td>`
    :`<td>${esc(r.departmentKey)}</td><td>${esc(r.classKey)}</td>`;
  const positions=scope==="department"
    ?`<td><strong>#${r.departmentPosition||"-"}</strong> · ${r.rating}</td><td><strong>#${r.majorPosition||"-"}</strong> · ${r.rating}</td>`
    :`<td><strong>#${r.majorPosition||"-"}</strong> · ${r.rating}</td><td><strong>#${r.departmentPosition||"-"}</strong> · ${r.rating}</td>`;
  return `<tr><td>${index+1}</td><td><strong>${esc(r.user.studentId||"-")}</strong></td><td>${esc(r.user.fullName||"-")}</td>${scopeFirst}
    <td>${adminRankShieldHTML(r)}<br><small>${esc(r.tierName)} · ${r.rating}</small></td>
    <td>${stages}</td><td>${normal.toLocaleString()}</td><td><strong>${Number(official?.totalScore||0).toFixed(2)}</strong> / 40</td>
    ${positions}<td><strong>#${r.classPosition||"-"}</strong> · ${r.rating}</td><td><strong>#${r.globalPosition||"-"}</strong> · ${r.rating}</td>
    <td>${Number(r.user.tokenBalance||0).toLocaleString()}</td></tr>`;
}
function renderDepartments(){
  if(!$("adminDepartmentBody"))return;
  const rows=buildAdminRankingRows(),all=adminDepartmentKeys(),keys=filterNamedKeys(all,adminDepartmentSearchTerm);
  if(selectedAdminDepartment&&!all.includes(selectedAdminDepartment))selectedAdminDepartment="";
  if(!selectedAdminDepartment&&keys.length===1)selectedAdminDepartment=keys[0];
  $("adminDepartmentTotal").textContent=`${all.length} แผนก`;
  $("adminDepartmentSearchResult").textContent=adminDepartmentSearchTerm?`พบ ${keys.length} แผนก`:"แสดงทุกแผนก";
  $("adminDepartmentCards").innerHTML=keys.map(k=>{
    const members=rows.filter(r=>r.departmentKey===k);
    return `<button class="admin-major-button ${k===selectedAdminDepartment?"active":""}" data-admin-department="${esc(k)}"><strong>${esc(k)}</strong><small>${members.length} คน · ${new Set(members.map(r=>r.majorKey)).size} สาขาวิชา</small></button>`;
  }).join("")||`<div class="admin-room-no-result">ไม่พบแผนก</div>`;
  document.querySelectorAll("[data-admin-department]").forEach(btn=>btn.onclick=()=>{selectedAdminDepartment=btn.dataset.adminDepartment;renderDepartments()});
  if(!selectedAdminDepartment){
    $("adminDepartmentTitle").textContent="เลือกแผนกด้านบน";$("adminDepartmentSummary").textContent="ยังไม่ได้เลือกแผนก";
    $("adminDepartmentBody").innerHTML=`<tr><td colspan="14" class="empty">เลือกแผนกเพื่อดูรายชื่อ</td></tr>`;return;
  }
  const list=rows.filter(r=>r.departmentKey===selectedAdminDepartment).sort((a,b)=>compareStudentId(a.user,b.user));
  $("adminDepartmentTitle").textContent=selectedAdminDepartment;$("adminDepartmentSummary").textContent=`${list.length} คน · เรียงตามรหัสนักศึกษา`;
  $("adminDepartmentBody").innerHTML=list.map((r,i)=>scopedAdminRow(r,i,"department")).join("")||`<tr><td colspan="14" class="empty">ยังไม่มีสมาชิก</td></tr>`;
}
function renderMajors(){
  if(!$("adminMajorBody"))return;
  const rows=buildAdminRankingRows(),all=adminMajorKeys(),keys=filterNamedKeys(all,adminMajorSearchTerm);
  if(selectedAdminMajor&&!all.includes(selectedAdminMajor))selectedAdminMajor="";
  if(!selectedAdminMajor&&keys.length===1)selectedAdminMajor=keys[0];
  $("adminMajorTotal").textContent=`${all.length} สาขาวิชา`;
  $("adminMajorSearchResult").textContent=adminMajorSearchTerm?`พบ ${keys.length} สาขาวิชา`:"แสดงทุกสาขาวิชา";
  $("adminMajorCards").innerHTML=keys.map(k=>{
    const members=rows.filter(r=>r.majorKey===k);
    return `<button class="admin-major-button ${k===selectedAdminMajor?"active":""}" data-admin-major="${esc(k)}"><strong>${esc(k)}</strong><small>${members.length} คน · ${new Set(members.map(r=>r.departmentKey)).size} แผนก</small></button>`;
  }).join("")||`<div class="admin-room-no-result">ไม่พบสาขาวิชา</div>`;
  document.querySelectorAll("[data-admin-major]").forEach(btn=>btn.onclick=()=>{selectedAdminMajor=btn.dataset.adminMajor;renderMajors()});
  if(!selectedAdminMajor){
    $("adminMajorTitle").textContent="เลือกสาขาวิชาด้านบน";$("adminMajorSummary").textContent="ยังไม่ได้เลือกสาขาวิชา";
    $("adminMajorBody").innerHTML=`<tr><td colspan="14" class="empty">เลือกสาขาวิชาเพื่อดูรายชื่อ</td></tr>`;return;
  }
  const list=rows.filter(r=>r.majorKey===selectedAdminMajor).sort((a,b)=>compareStudentId(a.user,b.user));
  $("adminMajorTitle").textContent=selectedAdminMajor;$("adminMajorSummary").textContent=`${list.length} คน · เรียงตามรหัสนักศึกษา`;
  $("adminMajorBody").innerHTML=list.map((r,i)=>scopedAdminRow(r,i,"major")).join("")||`<tr><td colspan="14" class="empty">ยังไม่มีสมาชิก</td></tr>`;
}
if($("adminDepartmentSearchInput"))$("adminDepartmentSearchInput").oninput=e=>{adminDepartmentSearchTerm=e.target.value.trim();renderDepartments()};
if($("clearAdminDepartmentSearch"))$("clearAdminDepartmentSearch").onclick=()=>{adminDepartmentSearchTerm="";$("adminDepartmentSearchInput").value="";renderDepartments()};
if($("adminMajorSearchInput"))$("adminMajorSearchInput").oninput=e=>{adminMajorSearchTerm=e.target.value.trim();renderMajors()};
if($("clearAdminMajorSearch"))$("clearAdminMajorSearch").onclick=()=>{adminMajorSearchTerm="";$("adminMajorSearchInput").value="";renderMajors()};
if($("adminRankingDepartmentFilter"))$("adminRankingDepartmentFilter").onchange=()=>renderRanking();
if($("adminRankingMajorFilter"))$("adminRankingMajorFilter").onchange=()=>renderRanking();

function renderRanking(){
  if(!$("rankingBody"))return;
  syncAdminClassSelectors();
  const seasonId=seasonIdFromDate(new Date()),range=effectiveSeasonRange();
  const classFilter=$("adminRankingClassFilter")?.value||"";
  const departmentFilter=$("adminRankingDepartmentFilter")?.value||"";
  const majorFilter=$("adminRankingMajorFilter")?.value||"";
  $("adminSeasonId").textContent=seasonId;
  $("adminSeasonRange").textContent=`${range.start.toLocaleString("th-TH")} – ${range.end.toLocaleString("th-TH")}`;
  let rows=buildAdminRankingRows();
  if(departmentFilter)rows=rows.filter(r=>r.departmentKey===departmentFilter);
  if(majorFilter)rows=rows.filter(r=>r.majorKey===majorFilter);
  if(classFilter)rows=rows.filter(r=>r.classKey===classFilter);
  $("rankingBody").innerHTML=rows.map(r=>`<tr>
    <td><strong>#${r.globalPosition}</strong></td><td><strong>#${r.departmentPosition||"-"}</strong></td>
    <td><strong>#${r.majorPosition||"-"}</strong></td><td><strong>#${r.classPosition||"-"}</strong></td>
    <td>${esc(r.user.fullName)}<br><small>${esc(r.user.studentId)}</small></td>
    <td><small>${esc(r.departmentKey)}<br>${esc(r.majorKey)}<br>${esc(r.classKey)}</small></td>
    <td>${adminRankShieldHTML(r)} <strong>${esc(r.tierName)}</strong></td>
    <td><strong>${r.rating}</strong></td><td>${r.diligence}</td><td>${r.accuracy}</td><td>${r.speed}</td><td>${r.consistency}</td><td>${r.avgWpm}</td>
  </tr>`).join("")||`<tr><td colspan="13" class="empty">ยังไม่มีข้อมูล Ranking</td></tr>`;
}

async function persistRanking(){
  const seasonId=seasonIdFromDate(new Date()),rows=buildAdminRankingRows();
  let batch=writeBatch(db),writes=0;
  for(const r of rows){
    const rank={seasonId,rating:r.rating,tierId:r.tierId,tierName:r.tierName,tierIcon:r.tierIcon,diligence:r.diligence,accuracy:r.accuracy,speed:r.speed,consistency:r.consistency,avgWpm:r.avgWpm,avgAccuracy:r.avgAccuracy,completedAttempts:r.completedAttempts,activeDayCount:r.activeDayCount,updatedAt:new Date().toISOString(),resetBoundaryAt:rankResetBoundaryMs()?new Date(rankResetBoundaryMs()).toISOString():null};
    batch.set(doc(db,"rankings",`${seasonId}_${r.user.id}`),{seasonId,uid:r.user.id,studentId:r.user.studentId,fullName:r.user.fullName,classKey:r.classKey,department:r.departmentKey,major:r.majorKey,globalPosition:r.globalPosition,departmentPosition:r.departmentPosition,majorPosition:r.majorPosition,classPosition:r.classPosition,...rank,updatedAt:serverTimestamp()},{merge:true});writes++;
    batch.set(doc(db,"users",r.user.id),{rank,updatedAt:serverTimestamp()},{merge:true});writes++;
    batch.set(doc(db,"public_profiles",r.user.id),{rank,educationLevel:r.user.educationLevel||"",classroom:r.user.classroom||"",classKey:r.classKey,department:r.departmentKey,major:r.majorKey,updatedAt:serverTimestamp()},{merge:true});writes++;
    if(writes>=420){await batch.commit();batch=writeBatch(db);writes=0;}
  }
  if(writes)await batch.commit();
}
function bronzeResetRank(resetAt){return {seasonId:seasonIdFromDate(resetAt),rating:0,tierId:"bronze",tierName:"Bronze",tierIcon:"🥉",diligence:0,accuracy:0,speed:0,consistency:0,avgWpm:0,avgAccuracy:0,completedAttempts:0,activeDayCount:0,updatedAt:resetAt.toISOString(),resetBoundaryAt:resetAt.toISOString()}}
async function executeRankingResetNow(){
  if(!confirm("ยืนยันรีแรงค์ตอนนี้? Rank ของ User ทุกคนจะกลับ Bronze 0 และผลงานก่อนเวลานี้จะไม่ถูกนำมาคำนวณในรอบใหม่"))return;
  const now=new Date(),rank=bronzeResetRank(now),version=`manual_${now.getTime()}`;
  await setDoc(doc(db,"system_settings","ranking"),{lastResetAt:Timestamp.fromDate(now),nextResetAt:null,notice:"",resetVersion:version,updatedAt:serverTimestamp()},{merge:true});
  let batch=writeBatch(db),writes=0;
  for(const u of cache.users){batch.set(doc(db,"users",u.id),{rank,updatedAt:serverTimestamp()},{merge:true});batch.set(doc(db,"public_profiles",u.id),{rank,updatedAt:serverTimestamp()},{merge:true});writes+=2;if(writes>=420){await batch.commit();batch=writeBatch(db);writes=0;}}
  if(writes)await batch.commit();
  await setDoc(doc(collection(db,"rank_reset_history")),{type:"manual",resetAt:Timestamp.fromDate(now),resetVersion:version,adminUid:ADMIN_UID,createdAt:serverTimestamp()});
  showAdminToast("รีแรงค์สำเร็จ",`เริ่มรอบใหม่ ${now.toLocaleString("th-TH")}`);
}
function renderRankingSchedule(){
  if(!$("adminRankResetStatus"))return;
  const cfg=cache.rankingSettings||{},next=tsMillis(cfg.nextResetAt),last=tsMillis(cfg.lastResetAt),now=Date.now();
  if(next){$("adminRankResetStatus").textContent=next>now?`กำหนด ${new Date(next).toLocaleString("th-TH")}`:`มีผลแล้ว ${new Date(next).toLocaleString("th-TH")}`;}
  else if(last)$("adminRankResetStatus").textContent=`รีล่าสุด ${new Date(last).toLocaleString("th-TH")}`;
  else $("adminRankResetStatus").textContent="ยังไม่ได้กำหนด";
  if($("rankResetMessage")&&document.activeElement!==$("rankResetMessage"))$("rankResetMessage").value=cfg.notice||"";
  if($("rankResetAtInput")&&document.activeElement!==$("rankResetAtInput")){const d=next?new Date(next):null;$("rankResetAtInput").value=d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}T${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`:"";}
}
if($("saveRankResetSchedule"))$("saveRankResetSchedule").onclick=async()=>{
  const raw=$("rankResetAtInput").value,date=new Date(raw),notice=$("rankResetMessage").value.trim();
  if(!raw||Number.isNaN(date.getTime())||date.getTime()<=Date.now()){alert("กรุณากำหนดวันและเวลาในอนาคต");return;}
  await setDoc(doc(db,"system_settings","ranking"),{nextResetAt:Timestamp.fromDate(date),notice,resetVersion:`scheduled_${date.getTime()}`,updatedAt:serverTimestamp()},{merge:true});
  showAdminToast("บันทึกกำหนดรีแรงค์แล้ว",date.toLocaleString("th-TH"));
};
if($("clearRankResetSchedule"))$("clearRankResetSchedule").onclick=async()=>{await setDoc(doc(db,"system_settings","ranking"),{nextResetAt:null,notice:"",updatedAt:serverTimestamp()},{merge:true});showAdminToast("ยกเลิกกำหนดการแล้ว")};
if($("resetRankingNow"))$("resetRankingNow").onclick=executeRankingResetNow;
if($("recalculateRanking"))$("recalculateRanking").onclick=async()=>{await persistRanking();showAdminToast("คำนวณ Ranking ใหม่แล้ว","อัปเดตแรงค์รวม / แผนก / สาขาวิชา / ห้อง")};

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

function teacherQuestById(id){return cache.teacherQuests.find(q=>q.id===id)}
function syncTeacherQuestRewardHint(){
  const diff=$("teacherQuestDifficulty")?.value||"easy",range=rewardRange(diff);
  if($("teacherQuestRewardHint"))$("teacherQuestRewardHint").textContent=`${questDifficultyName(diff)} ${range.min}–${range.max} Token`;
  if($("teacherQuestMinRank")&&!$("teacherQuestEditId")?.value)$("teacherQuestMinRank").value=defaultMinRankForDifficulty(diff);
  const input=$("teacherQuestReward");
  if(input){input.min=range.min;input.max=range.max;input.value=clampQuestReward(diff,input.value)}
}
function resetTeacherQuestForm(){
  $("teacherQuestForm")?.reset();if($("teacherQuestEditId"))$("teacherQuestEditId").value="";
  if($("teacherQuestStage"))$("teacherQuestStage").value=1;
  if($("teacherQuestReward"))$("teacherQuestReward").value=4;
  if($("teacherQuestActive"))$("teacherQuestActive").checked=true;
  syncTeacherQuestRewardHint();
}
function renderTeacherQuests(){
  if(!$("teacherQuestBody"))return;
  const rows=[...cache.teacherQuests].sort((a,b)=>(a.active===false)-(b.active===false)||String(a.title||"").localeCompare(String(b.title||""),"th"));
  $("teacherQuestBody").innerHTML=rows.map(q=>`<tr>
    <td><strong>${esc(q.title||"-")}</strong><br><small>${esc(q.description||"")}</small></td>
    <td>${esc(String(q.languageId||"").toUpperCase())} ${Number(q.stage||0)}</td>
    <td>${esc(questDifficultyName(q.difficulty))}</td>
    <td>${esc(questObjectiveLabel(q))}</td>
    <td>${esc(q.minRank||"-")}</td>
    <td><strong>${clampQuestReward(q.difficulty,q.rewardToken)}</strong></td>
    <td><span class="status ${q.active===false?"status-abandoned":"status-completed"}">${q.active===false?"ปิด":"เปิด"}</span></td>
    <td><button class="btn btn-small ghost" data-edit-teacher-quest="${q.id}">แก้ไข</button> <button class="btn btn-small danger" data-delete-teacher-quest="${q.id}">ลบ</button></td>
  </tr>`).join("")||`<tr><td colspan="8" class="empty">ยังไม่มีภารกิจ · กด “สร้างภารกิจตัวอย่าง” ได้</td></tr>`;
  document.querySelectorAll("[data-edit-teacher-quest]").forEach(btn=>btn.onclick=()=>{
    const q=teacherQuestById(btn.dataset.editTeacherQuest);if(!q)return;
    $("teacherQuestEditId").value=q.id;$("teacherQuestTitle").value=q.title||"";$("teacherQuestLanguage").value=q.languageId||"html";$("teacherQuestStage").value=q.stage||1;
    $("teacherQuestDifficulty").value=q.difficulty||"easy";$("teacherQuestObjective").value=q.objectiveType||"pass";$("teacherQuestTarget").value=q.targetValue||0;
    $("teacherQuestReward").value=q.rewardToken||4;$("teacherQuestMinRank").value=q.minRank||"bronze";$("teacherQuestDescription").value=q.description||"";$("teacherQuestActive").checked=q.active!==false;
    syncTeacherQuestRewardHint();$("teacherQuestForm")?.scrollIntoView({behavior:"smooth",block:"center"});
  });
  document.querySelectorAll("[data-delete-teacher-quest]").forEach(btn=>btn.onclick=async()=>{if(confirm("ลบภารกิจนี้?"))await deleteDoc(doc(db,"teacher_quests",btn.dataset.deleteTeacherQuest))});
}
if($("teacherQuestDifficulty"))$("teacherQuestDifficulty").onchange=syncTeacherQuestRewardHint;
if($("teacherQuestForm"))$("teacherQuestForm").onsubmit=async e=>{
  e.preventDefault();
  const id=$("teacherQuestEditId").value||doc(collection(db,"teacher_quests")).id,diff=$("teacherQuestDifficulty").value;
  const data={
    title:$("teacherQuestTitle").value.trim(),languageId:$("teacherQuestLanguage").value,stage:Math.max(1,Math.min(50,Number($("teacherQuestStage").value||1))),
    difficulty:diff,objectiveType:$("teacherQuestObjective").value,targetValue:Number($("teacherQuestTarget").value||0),
    rewardToken:clampQuestReward(diff,$("teacherQuestReward").value),minRank:$("teacherQuestMinRank").value,
    description:$("teacherQuestDescription").value.trim(),active:$("teacherQuestActive").checked,updatedAt:serverTimestamp()
  };
  if(!$("teacherQuestEditId").value)data.createdAt=serverTimestamp();
  await setDoc(doc(db,"teacher_quests",id),data,{merge:true});resetTeacherQuestForm();showAdminToast("บันทึกภารกิจแล้ว",data.title);
};
if($("cancelTeacherQuestEdit"))$("cancelTeacherQuestEdit").onclick=resetTeacherQuestForm;
if($("seedTeacherQuests"))$("seedTeacherQuests").onclick=async()=>{
  if(!confirm("สร้าง/อัปเดตภารกิจตัวอย่าง 6 รายการ?"))return;
  const batch=writeBatch(db);
  DEFAULT_TEACHER_QUESTS.forEach(q=>{const {id,...data}=q;batch.set(doc(db,"teacher_quests",id),{...data,updatedAt:serverTimestamp()},{merge:true})});
  await batch.commit();showAdminToast("สร้างภารกิจตัวอย่างแล้ว","6 รายการ");
};
syncTeacherQuestRewardHint();

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
function combinedZoneChatArchive(){
  const map=new Map();
  cache.zoneMessages.forEach(m=>map.set(m.id,m));
  cache.zoneArchive.forEach(m=>map.set(m.messageId||m.id,m));
  return [...map.values()].sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));
}

function renderZoneChatLog(){
  if(!$("zoneChatAdminList"))return;
  const rows=combinedZoneChatArchive();
  const user24=rows.filter(m=>!zoneChatIsGM(m)&&zoneChatVisible(m)).length;
  const gmCount=rows.filter(zoneChatIsGM).length;
  $("zoneChat24hMetric").textContent=user24;
  $("zoneChatGmMetric").textContent=gmCount;
  $("zoneChatTotalMetric").textContent=rows.length;
  $("zoneChatAdminList").innerHTML=rows.length?rows.map(m=>{
    const gm=zoneChatIsGM(m),dt=m.createdAt?.toDate?.(),expired=!gm&&!zoneChatVisible(m);
    return `<article class="admin-zone-chat-message ${gm?"gm":expired?"expired":"user"}">
      <div class="admin-zone-chat-avatar">${gm?"GM":esc(String(m.studentId||"?").slice(-2))}</div>
      <div class="admin-zone-chat-content">
        <div class="admin-zone-chat-meta"><strong>${gm?"GM":esc(m.studentId||"USER")}</strong><span>${esc(zoneChatUserName(m))}</span><time>${dt?dt.toLocaleString("th-TH"):"-"}</time></div>
        <p>${esc(m.text||"")}</p>
        <small>${gm?"ประกาศ GM · ถาวร":expired?"หมดอายุจากหน้า User แล้ว · เก็บใน Admin Archive":`ข้อความ User · เหลือ ${zoneChatExpiryLabel(m)}`}</small>
      </div>
      <button class="btn danger btn-small" data-delete-zone-message="${esc(m.messageId||m.id)}">ลบ Log</button>
    </article>`;
  }).join(""):`<div class="empty">ยังไม่มีประวัติแชต</div>`;
  document.querySelectorAll("[data-delete-zone-message]").forEach(btn=>btn.onclick=async()=>{
    if(!confirm("ลบข้อความและ Archive รายการนี้?"))return;
    const id=btn.dataset.deleteZoneMessage,batch=writeBatch(db);
    batch.delete(doc(db,"zone_messages",id));batch.delete(doc(db,"zone_chat_archive",id));
    try{await batch.commit()}catch(error){console.warn("delete chat log:",error)}
  });
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
  const rows=combinedZoneChatArchive(),q=v=>`"${String(v??"").replaceAll('"','""')}"`;
  const data=[["date","type","student_id","name","message","expires"].join(","),...rows.map(m=>[
    formatDate(m.createdAt),zoneChatIsGM(m)?"GM":"USER",zoneChatIsGM(m)?"GM":m.studentId,zoneChatUserName(m),m.text,zoneChatIsGM(m)?"PERMANENT":(zoneChatVisible(m)?zoneChatExpiryLabel(m):"EXPIRED_ARCHIVED")
  ].map(q).join(","))].join("\n");
  downloadText(`zone_chat_${new Date().toISOString().slice(0,10)}.csv`,"\ufeff"+data,"text/csv;charset=utf-8");
};

async function sendGmWorldChat(){
  const input=$("gmWorldChatInput"),clean=String(input?.value||"").trim().slice(0,120);if(!clean)return;
  const messageRef=doc(collection(db,"zone_messages"));
  const payload={uid:ADMIN_UID,studentId:"GM",text:clean,zoneId:ACTIVE_ZONE_ID,isGM:true,createdAt:serverTimestamp()};
  try{
    await setDoc(messageRef,payload);
    input.value="";
    showAdminToast("ส่งข้อความ GM แล้ว","ข้อความเข้า World Chat แล้ว");
    try{
      await setDoc(doc(db,"zone_chat_archive",messageRef.id),{
        uid:ADMIN_UID,studentId:"GM",text:clean,zoneId:ACTIVE_ZONE_ID,isGM:true,
        messageId:messageRef.id,createdAt:serverTimestamp(),archivedAt:serverTimestamp()
      });
    }catch(archiveError){console.warn("GM archive:",archiveError)}
  }catch(error){showAdminToast("ส่งแชตไม่สำเร็จ",error.message||String(error),true)}
}
if($("sendGmWorldChat"))$("sendGmWorldChat").onclick=sendGmWorldChat;
if($("gmWorldChatInput"))$("gmWorldChatInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendGmWorldChat()}});

$("levelForm").addEventListener("submit",async e=>{e.preventDefault();const n=Number($("editLevelNo").value),id=`level_${String(n).padStart(2,"0")}`;await setDoc(doc(db,"levels",id),{levelNo:n,title:$("editTitle").value.trim(),language:$("editLanguage").value.trim(),difficulty:$("editDifficulty").value,basePoints:Number($("editBasePoints").value),timeLimit:Number($("editTimeLimit").value),difficultyMultiplier:Number($("editMultiplier").value),description:$("editDescription").value.trim(),code:$("editCode").value,isActive:true,updatedAt:serverTimestamp()},{merge:true});e.target.reset();$("editBasePoints").value=100;$("editTimeLimit").value=90;$("editMultiplier").value=1});
$("seedDefaults").onclick=async()=>{if(!confirm("คืนค่า 4 โหมดและ 12 Level เริ่มต้น?"))return;const batch=writeBatch(db);DEFAULT_MODES.forEach(x=>{const {id,...data}=x;batch.set(doc(db,"game_modes",id),{...data,id,isActive:true},{merge:true})});DEFAULT_LEVELS.forEach(x=>batch.set(doc(db,"levels",`level_${String(x.levelNo).padStart(2,"0")}`),{...x,isActive:true},{merge:true}));await batch.commit()};
async function deleteCollectionDocs(name){const rows=await getDocs(collection(db,name));let batch=writeBatch(db),count=0;for(const item of rows.docs){batch.delete(item.ref);if(++count>=450){await batch.commit();batch=writeBatch(db);count=0}}if(count)await batch.commit()}
$("deleteResults").onclick=async()=>{if(confirm("ยืนยันลบผลทั้งหมด?"))await deleteCollectionDocs("attempts")};
$("deleteUsers").onclick=async()=>{if(confirm("ยืนยันลบข้อมูลสมาชิกทั้งหมดจาก Firestore? บัญชี Authentication จะไม่ถูกลบ"))await deleteCollectionDocs("users")};
function downloadFile(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
$("exportCsv").onclick=()=>{const h=["date","student_id","name","level","classroom","department","mode","game_level","status","score","wpm","accuracy","mistakes","time_seconds"],q=v=>`"${String(v??"").replaceAll('"','""')}"`,rows=cache.attempts.map(x=>[formatDate(x.createdAt),x.studentId,x.fullName,x.educationLevel,x.classroom,x.department,x.modeName,(x.stage??x.levelNo),x.status,x.score,x.wpm,x.accuracy,x.mistakes,x.elapsedSeconds].map(q).join(","));downloadFile("code_typing_results.csv","\ufeff"+h.join(",")+"\n"+rows.join("\n"),"text/csv;charset=utf-8")};
$("exportJson").onclick=()=>downloadFile("code_typing_backup.json",JSON.stringify({
  exportedAt:new Date().toISOString(),game_modes:cache.modes,levels:cache.levels,users:cache.users,attempts:cache.attempts,
  official_submissions:cache.official,zone_moderation:cache.zoneModeration,zone_chat_archive:combinedZoneChatArchive(),teacher_quests:cache.teacherQuests
},(k,v)=>v?.toDate?.()?v.toDate().toISOString():v,2),"application/json");
$("importJson").addEventListener("change",async e=>{const f=e.target.files[0];if(!f||!confirm("นำเข้าข้อมูล JSON?"))return;const data=JSON.parse(await f.text());for(const [name,rows] of Object.entries({
  game_modes:data.game_modes||[],levels:data.levels||[],users:data.users||[],attempts:data.attempts||[],
  official_submissions:data.official_submissions||[],zone_moderation:data.zone_moderation||[],zone_chat_archive:data.zone_chat_archive||[],teacher_quests:data.teacher_quests||[]
})){for(const row of rows){const id=row.id||doc(collection(db,name)).id,copy={...row};delete copy.id;await setDoc(doc(db,name,id),copy,{merge:true})}}alert("นำเข้าสำเร็จ")});
document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".admin-tab-panel").forEach(x=>x.classList.add("hidden"));btn.classList.add("active");$(btn.dataset.tab).classList.remove("hidden")});
