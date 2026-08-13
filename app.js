import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, where, orderBy, limit, onSnapshot, runTransaction
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js?v=4.6.0";
import { LANGUAGES, LESSONS, DIFFICULTIES } from "./lessons.js?v=4.6.0";
import { REWARD_ITEMS, RARITY_META } from "./reward-data.js?v=4.6.0";
import { DEFAULT_CHARACTER, DEFAULT_ZONE_STATE } from "./character-system.js?v=4.6.0";
import { OFFICIAL_STAGES, OFFICIAL_TOTAL_SCORE } from "./official-data.js?v=4.6.0";
import { RANKING_CONFIG, seasonIdFromDate, seasonRange, calculateRankMetrics, rankingClassKey, rankProfiles } from "./ranking-system.js?v=4.6.0";
import { TOKEN_REWARD_CONFIG, calculateStageTokenReward, maxTokenForLesson, classKey } from "./economy-system.js?v=4.6.0";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const $ = id => document.getElementById(id);

const state = {
  uid:null, player:null, language:null, lesson:null, difficulty:null, gameMode:"classic",
  attemptId:null, started:false, finished:false, startTime:0, timer:null,
  mistakes:0, keystrokes:0, correctText:"",
  historyUnsub:null,
  roomUnsub:null, roomCode:null, roomData:null,
  officialProgress:{}, officialSelected:null, officialUnsub:null,
  presenceUnsub:null, leaderboardUnsub:null, presenceTimer:null, communityUnsub:null, presenceCache:new Map(),
  pvpStartTime:0, pvpTimer:null, pvpMistakes:0, pvpKeys:0, pvpCorrectText:"",
  pvpLesson:null, pvpAttemptId:null, pvpFinished:false, pvpActiveRoom:null,
  pvpProgressTimer:null, pvpProgressLastSent:0, pvpResultSaved:false,
  pvpRoomListUnsub:null,pvpStakeLocking:false,pvpCurrentShot:-1,pvpShotRecorded:-1,
  pvpAggregate:{typedChars:0,keys:0,mistakes:0,seconds:0},pvpPayoutClaimed:false,pvpWasActive:false,pvpTargetCode:"",pvpTurnSignature:null,pvpRecordedSignature:null,
  pvpCountdownTimer:null,pvpCountdownEndMs:0,rankSettingsUnsub:null,rankResetTimer:null,rankSettings:{},rankResetAppliedVersion:null
};

const studentEmail = id => `${String(id).trim()}@student.thc-nr.local`;
const esc = v => String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const fmtDate = v => { try { return v?.toDate?.().toLocaleString("th-TH") || "-"; } catch { return "-"; } };
const fmtTime = s => { s=Math.max(0,s); return `${Math.floor(s/60).toString().padStart(2,"0")}:${Math.floor(s%60).toString().padStart(2,"0")}`; };

function showScreen(id){
  ["authScreen","userPortal","gameScreen","resultScreen","pvpGameScreen"].forEach(x => $(x)?.classList.toggle("hidden", x !== id));
  const playing = id === "gameScreen" || id === "pvpGameScreen";
  document.body.classList.toggle("game-active", playing);
  if (!playing) window.scrollTo({top:0,behavior:"smooth"});
}

function difficultyName(id){ return DIFFICULTIES.find(x=>x.id===id)?.name || id; }
function difficultyIcon(id){ return DIFFICULTIES.find(x=>x.id===id)?.icon || "●"; }
function languageLessons(){ return LESSONS.filter(x => x.language === state.language?.id).sort((a,b)=>a.stage-b.stage); }
function maxUnlocked(languageId){
  return Number(state.player?.progress?.[languageId]?.maxUnlockedStage || 1);
}

async function ensureProfileDefaults(){
  if(!state.uid) return;
  const ref = doc(db,"users",state.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()) return;
  const d = snap.data();
  const patch = {};
  if(typeof d.tokenBalance !== "number") {
    patch.tokenBalance = typeof d.pointsBalance === "number" ? d.pointsBalance : 0;
  }
  if(typeof d.tokenLifetime !== "number") {
    patch.tokenLifetime = typeof d.pointsLifetime === "number" ? d.pointsLifetime : 0;
  }
  if(!Array.isArray(d.inventory)) patch.inventory = [];
  if(!d.progress) patch.progress = {html:{maxUnlockedStage:1},python:{maxUnlockedStage:1}};
  else {
    patch.progress = {
      html:{maxUnlockedStage:Number(d.progress?.html?.maxUnlockedStage || 1)},
      python:{maxUnlockedStage:Number(d.progress?.python?.maxUnlockedStage || 1)}
    };
  }
  if(!d.character) {
    patch.character = {...DEFAULT_CHARACTER,displayName:d.fullName||""};
  } else {
    patch.character = {
      ...DEFAULT_CHARACTER,
      ...d.character,
      displayName:d.character.displayName||d.fullName||"",
      equipped:{...DEFAULT_CHARACTER.equipped,...(d.character.equipped||{})}
    };
  }
  if(!d.classKey && d.educationLevel && d.classroom) patch.classKey=classKey(d.educationLevel,d.classroom);
  if(!d.zone) patch.zone = {...DEFAULT_ZONE_STATE};
  if(Object.keys(patch).length) await updateDoc(ref,patch);
  const refreshed = await getDoc(ref);
  state.player = {uid:state.uid,...refreshed.data()};
}

$("loginTab").onclick=()=>{$("loginTab").classList.add("active");$("registerTab").classList.remove("active");$("loginPanel").classList.remove("hidden");$("registerPanel").classList.add("hidden")};
$("registerTab").onclick=()=>{$("registerTab").classList.add("active");$("loginTab").classList.remove("active");$("registerPanel").classList.remove("hidden");$("loginPanel").classList.add("hidden")};
document.querySelectorAll("[data-toggle-password]").forEach(btn=>btn.onclick=()=>{const i=$(btn.dataset.togglePassword);i.type=i.type==="password"?"text":"password";btn.textContent=i.type==="password"?"แสดง":"ซ่อน"});

function registerValid(){
  return /^\d+$/.test($("studentId").value.trim()) &&
    $("fullName").value.trim() && $("educationLevel").value && $("classroom").value &&
    $("department").value.trim() && $("password").value.length >= 6 &&
    $("password").value === $("confirmPassword").value && $("acceptRules").checked;
}
function updateRegister(){ $("registerButton").disabled = !registerValid(); }
["studentId","fullName","educationLevel","classroom","department","password","confirmPassword","acceptRules"].forEach(id=>$(id).addEventListener("input",updateRegister));

$("registerForm").addEventListener("submit",async e=>{
  e.preventDefault(); if(!registerValid()) return;
  try{
    const sid=$("studentId").value.trim();
    const cred=await createUserWithEmailAndPassword(auth,studentEmail(sid),$("password").value);
    state.uid=cred.user.uid;
    const p={
      uid:state.uid,studentId:sid,fullName:$("fullName").value.trim(),
      educationLevel:$("educationLevel").value,classroom:$("classroom").value,
      classKey:classKey($("educationLevel").value,$("classroom").value),
      department:$("department").value.trim(),role:"student",status:"active",
      tokenBalance:0,tokenLifetime:0,inventory:[],
      officialProgress:{},officialSubmitted:false,
      rank:{seasonId:null,rating:0,tierId:"bronze",tierName:"Bronze"},
      progress:{html:{maxUnlockedStage:1},python:{maxUnlockedStage:1}},
      character:{...DEFAULT_CHARACTER,displayName:$("fullName").value.trim()},
      zone:{...DEFAULT_ZONE_STATE},
      createdAt:serverTimestamp(),updatedAt:serverTimestamp()
    };
    await setDoc(doc(db,"users",state.uid),p);
    await routeAuthenticatedStudent();
  }catch(err){
    $("registerMessage").textContent = err.code==="auth/email-already-in-use" ? "เลขนักศึกษานี้ลงทะเบียนแล้ว" : "ลงทะเบียนไม่สำเร็จ: "+err.message;
  }
});

$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{
    const cred=await signInWithEmailAndPassword(auth,studentEmail($("loginStudentId").value.trim()),$("loginPassword").value);
    state.uid=cred.user.uid;
    await routeAuthenticatedStudent();
  }catch{
    $("loginMessage").textContent="เลขนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
  }
});

async function routeAuthenticatedStudent(){
  // createUserWithEmailAndPassword จะยิง onAuthStateChanged ก่อน setDoc(users/{uid}) ได้
  // จึง retry สั้น ๆ เพื่อป้องกันหน้า Login กระพริบ/แจ้งไม่พบ User ตอนสมัครใหม่
  for(let i=0;i<6&&!state.player;i++){
    await ensureProfileDefaults();
    if(!state.player) await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!state.player) throw new Error("ไม่พบข้อมูลผู้ใช้");

  // มือถือ/แท็บเล็ต: Login/สมัครได้ที่หน้าแรก แต่หลังมีตัวละครแล้วเข้า Zone โดยตรง
  if(isMobileOrTabletDevice() && ["male","female"].includes(state.player?.character?.gender)){
    try{
      await syncPublicProfile();
      await writePresence("zone");
    }catch(error){
      console.warn("mobile route sync skipped:", error);
    }
    location.replace("./zone.html?v=4.6.0");
    return;
  }

  await enterPortal();
}

async function enterPortal(){
  await ensureProfileDefaults();
  showScreen("userPortal");
  $("portalWelcome").textContent=`${state.player.fullName} · ${state.player.studentId} · ${state.player.educationLevel}${state.player.classroom}`;
  $("userTokens").textContent=Number(state.player.tokenBalance||0).toLocaleString();
  renderUserRank();
  renderLanguages();
  renderRewardShop();
  listenHistory();
  startSocialHub();
  setupCharacterUi();

  if(!["male","female"].includes(state.player?.character?.gender)){
    $("characterSetupModal")?.classList.remove("hidden");
  }

  // คำนวณ Rank ของ Season ปัจจุบันเมื่อ User เข้าใช้งาน
  // ถ้าครบรอบ 60 วัน seasonId จะเปลี่ยนโดยอัตโนมัติ
  try {
    await updateMyRank();
    await ensureProfileDefaults();
    renderUserRank();
    await syncPublicProfile();
    await writePresence("portal");
  } catch (error) {
    console.warn("Ranking update skipped:", error);
  }
}

$("logoutUserButton").onclick=async()=>{
  await markOffline();
  if(state.historyUnsub) state.historyUnsub();
  if(state.presenceUnsub) state.presenceUnsub();
  if(state.communityUnsub) state.communityUnsub();
  if(state.leaderboardUnsub) state.leaderboardUnsub();
  if(state.pvpRoomListUnsub) state.pvpRoomListUnsub();
  if(state.rankSettingsUnsub) state.rankSettingsUnsub();
  clearInterval(state.rankResetTimer);
  clearInterval(state.pvpCountdownTimer);
  clearInterval(state.presenceTimer);
  await signOut(auth);
};

function renderLanguages(){
  $("languageCards").innerHTML=LANGUAGES.map(l=>`
    <button class="language-card ${state.language?.id===l.id?"selected":""} ${l.comingSoon?"coming-soon":""}" data-lang="${l.id}" ${l.comingSoon?"disabled":""}>
      <span>${l.icon}</span>
      <strong>${l.name}</strong>
      <b>${esc(l.tagline)}</b>
      <small>${esc(l.description)}</small>
      <em>${l.comingSoon?"COMING SOON":`${l.stageCount} ด่าน`}</em>
    </button>`).join("");
  document.querySelectorAll("[data-lang]:not([disabled])").forEach(b=>b.onclick=()=>selectLanguage(b.dataset.lang));
}

function selectLanguage(id){
  state.language=LANGUAGES.find(x=>x.id===id);
  state.lesson=null;
  state.difficulty=null;
  renderLanguages();
  $("learningSection").classList.remove("hidden");
  $("modeSection").classList.remove("hidden");
  $("classicConfig").classList.remove("hidden");
  $("learningTitle").textContent=`${state.language.icon} ${state.language.name} · 50 STAGES`;
  $("learningTagline").textContent=state.language.description;
  renderLessonTabs();
  renderDifficulty();
  renderClassicStages();
  renderLessonDetail();
  updateClassicSummary();
  $("learningSection").scrollIntoView({behavior:"smooth",block:"start"});
}

function renderLessonTabs(){
  $("lessonTabs").innerHTML=DIFFICULTIES.map(d=>`
    <button class="lesson-tab ${state.difficulty?.id===d.id?"active":""}" data-learn-diff="${d.id}">
      <span>${d.icon}</span><strong>${d.name}</strong><small>ด่าน ${d.from}–${d.to}</small>
    </button>`).join("");
  document.querySelectorAll("[data-learn-diff]").forEach(b=>b.onclick=()=>{
    state.difficulty=DIFFICULTIES.find(x=>x.id===b.dataset.learnDiff);
    const unlocked=maxUnlocked(state.language.id);
    const list=languageLessons().filter(x=>x.difficulty===state.difficulty.id);
    state.lesson=list.find(x=>x.stage<=unlocked) || list[0];
    renderLessonTabs();renderStageSelector();renderLessonDetail();renderDifficulty();renderClassicStages();updateClassicSummary();
  });
  renderStageSelector();
}

function renderStageSelector(){
  if(!state.language){$("stageSelector").innerHTML="";return;}
  const d=state.difficulty || DIFFICULTIES[0];
  const unlocked=maxUnlocked(state.language.id);
  const list=languageLessons().filter(x=>x.difficulty===d.id);
  $("stageSelector").innerHTML=`<div class="stage-selector-head"><strong>บทเรียน ${d.name}</strong><span>ปลดล็อกถึงด่าน ${unlocked}</span></div><div class="mini-stage-grid">${
    list.map(l=>`<button data-learn-stage="${l.stage}" class="${state.lesson?.stage===l.stage?"selected":""}" ${l.stage>unlocked?"disabled":""}>${l.stage}${l.stage>unlocked?" 🔒":""}</button>`).join("")
  }</div>`;
  document.querySelectorAll("[data-learn-stage]:not([disabled])").forEach(b=>b.onclick=()=>{
    state.lesson=languageLessons().find(x=>x.stage===Number(b.dataset.learnStage));
    state.difficulty=DIFFICULTIES.find(x=>x.id===state.lesson.difficulty);
    renderLessonTabs();renderStageSelector();renderLessonDetail();renderDifficulty();renderClassicStages();updateClassicSummary();
  });
}

function previewSrcdoc(l){
  if(l.language==="html") return l.code;
  return "";
}

function renderLessonDetail(){
  const l=state.lesson || languageLessons()[0];
  if(!l) return;
  state.lesson=l;
  const preview=l.language==="html";
  $("lessonDetail").innerHTML=`<div class="education-grid">
    <div class="edu-info">
      <div class="edu-card"><h3>📘 คำอธิบาย</h3><p>${esc(l.description)}</p></div>
      <div class="edu-card"><h3>🛠️ วิธีการใช้งาน</h3><p>${esc(l.usage)}</p></div>
      <div class="edu-card benefit"><h3>💡 ประโยชน์</h3><p>${esc(l.benefit)}</p></div>
      <div class="edu-card"><h3>🔎 อธิบายผลลัพธ์</h3><p>${esc(l.outputExplain)}</p></div>
    </div>
    <div>
      <h3 class="edu-heading">Stage ${l.stage} · ตัวอย่าง Code</h3>
      <pre class="lesson-code"><code>${esc(l.code)}</code></pre>
      <div class="preview-panel">
        <div class="preview-bar"><i></i><i></i><i></i><span>${preview?"LIVE PREVIEW":"EXPECTED RESULT"}</span></div>
        ${preview?`<iframe id="lessonPreview" sandbox="allow-scripts"></iframe>`:`<pre class="terminal-output">${esc(l.output||l.outputExplain)}</pre>`}
      </div>
    </div>
  </div>`;
  if(preview) setTimeout(()=>{const f=$("lessonPreview");if(f)f.srcdoc=previewSrcdoc(l)},20);
}

document.querySelectorAll("[data-game-mode]").forEach(b=>b.onclick=()=>{
  state.gameMode=b.dataset.gameMode;
  document.querySelectorAll("[data-game-mode]").forEach(x=>x.classList.toggle("selected",x===b));
  $("classicConfig").classList.toggle("hidden",state.gameMode!=="classic");
  $("officialConfig").classList.toggle("hidden",state.gameMode!=="official");
  $("pvpConfig").classList.toggle("hidden",state.gameMode!=="pvp");
  if(state.gameMode==="official") renderOfficialStages();
});

function renderDifficulty(){
  $("difficultyCards").innerHTML=DIFFICULTIES.map(d=>`
    <button class="difficulty-card ${state.difficulty?.id===d.id?"selected":""}" data-difficulty="${d.id}">
      <span>${d.icon}</span><strong>${d.name}</strong><small>${d.description}</small><b>Score ×${d.multiplier.toFixed(2)}</b>
    </button>`).join("");
  document.querySelectorAll("[data-difficulty]").forEach(b=>b.onclick=()=>{
    state.difficulty=DIFFICULTIES.find(x=>x.id===b.dataset.difficulty);
    const unlocked=maxUnlocked(state.language.id);
    const list=languageLessons().filter(x=>x.difficulty===state.difficulty.id);
    state.lesson=list.find(x=>x.stage<=unlocked) || null;
    renderDifficulty();renderClassicStages();renderLessonTabs();renderStageSelector();if(state.lesson)renderLessonDetail();updateClassicSummary();
  });
}

function renderClassicStages(){
  if(!state.language || !state.difficulty){$("classicStageGrid").innerHTML=`<p class="empty-card">เลือกระดับความยากก่อน</p>`;return;}
  const unlocked=maxUnlocked(state.language.id);
  const list=languageLessons().filter(x=>x.difficulty===state.difficulty.id);
  $("classicStageGrid").innerHTML=list.map(l=>`
    <button class="classic-stage ${state.lesson?.id===l.id?"selected":""}" data-classic-stage="${l.stage}" ${l.stage>unlocked?"disabled":""}>
      <strong>${String(l.stage).padStart(2,"0")}</strong><span>${esc(l.title)}</span><small>${maxTokenForLesson(l)} Token สูงสุด ${l.stage>unlocked?"· 🔒":""}</small>
    </button>`).join("");
  document.querySelectorAll("[data-classic-stage]:not([disabled])").forEach(b=>b.onclick=()=>{
    state.lesson=languageLessons().find(x=>x.stage===Number(b.dataset.classicStage));
    renderClassicStages();renderStageSelector();renderLessonDetail();updateClassicSummary();
  });
}

function updateClassicSummary(){
  const ok=state.language&&state.difficulty&&state.lesson&&state.lesson.stage<=maxUnlocked(state.language.id);
  $("startClassicButton").disabled=!ok;
  $("classicLessonSummary").textContent=ok?`${state.language.name} · ${state.difficulty.name} · ด่าน ${state.lesson.stage} · สูงสุด ${maxTokenForLesson(state.lesson)} Token`:"เลือกภาษาระดับและด่านที่ปลดล็อกแล้ว";
}

$("startClassicButton").onclick=async()=>{
  if(!state.lesson)return;
  prepareClassic();
  showScreen("gameScreen");
  await requestRealFullscreen();
  setTimeout(()=>$("typingInput").focus({preventScroll:true}),150);
};

async function requestRealFullscreen(){
  document.body.classList.add("game-active");
  updateDeviceUX();

  // CSS 100dvh เป็นตัวหลักสำหรับมือถือ โดยเฉพาะ iOS Safari
  // Fullscreen API ใช้เสริมเมื่อ Browser รองรับและอนุญาต
  try{
    const canFullscreen = document.documentElement.requestFullscreen;
    if (canFullscreen && !document.fullscreenElement && !isPhoneLayout()) {
      await document.documentElement.requestFullscreen();
    }
  }catch(error){
    console.warn("Fullscreen API unavailable:", error);
  }
}
async function leaveRealFullscreen(){
  try{if(document.fullscreenElement)await document.exitFullscreen()}catch{}
}
$("fullscreenButton").onclick=requestRealFullscreen;

function elapsed(){return state.started?(performance.now()-state.startTime)/1000:0}
function accuracy(){return state.keystrokes?Math.max(0,(state.correctText.length/state.keystrokes)*100):100}
function wpm(){return state.correctText.length?((state.correctText.length/5)/Math.max(elapsed()/60,1/600)):0}
function liveScore(){
  if(!state.started)return 0;
  const base=Number(state.lesson.basePoints||100)*(state.difficulty?.multiplier||1);
  return Math.max(0,Math.round(base*(accuracy()/100)+Math.min(base*.35,wpm()*2)-state.mistakes*4));
}

function prepareClassic(){
  $("resultExplanation")?.classList.add("hidden");
  state.attemptId=null;state.started=false;state.finished=false;state.mistakes=0;state.keystrokes=0;state.correctText="";
  clearInterval(state.timer);$("typingInput").value="";
  $("modeBadge").textContent=`⌨️ CLASSIC · ${state.language.name}`;
  $("challengeTitle").textContent=`Stage ${state.lesson.stage} · ${state.lesson.title}`;
  $("challengeDescription").textContent=state.lesson.description;
  $("playerName").textContent=state.player.fullName;
  $("statLevel").textContent=String(state.lesson.stage).padStart(2,"0");
  $("languageLabel").textContent=state.language.name;
  $("difficultyLabel").textContent=state.difficulty.name;
  $("timeRuleLabel").textContent=`เป้าหมาย ${state.lesson.timeLimit}s`;
  $("fileName").textContent=`${state.language.id}_stage_${String(state.lesson.stage).padStart(2,"0")}`;
  $("typingStatus").textContent="พิมพ์ตัวแรกเพื่อเริ่มจับเวลา";
  $("saveState").textContent=`รางวัลสูงสุด ${maxTokenForLesson(state.lesson)} Token`;
  $("statTime").textContent="00:00";
  ["statWpm","statMistakes","statScore"].forEach(id=>$(id).textContent="0");
  $("statAccuracy").textContent="100%";
  renderStrictCode();
  updateDeviceUX();
  syncMobileStats();
}

async function startClassic(){
  if(state.started)return;
  state.started=true;state.startTime=performance.now();$("typingStatus").textContent="กำลังเล่น...";
  const r=await addDoc(collection(db,"attempts"),{
    uid:state.uid,studentId:state.player.studentId,fullName:state.player.fullName,
    educationLevel:state.player.educationLevel,classroom:state.player.classroom,department:state.player.department,
    language:state.language.name,languageId:state.language.id,modeName:state.gameMode==="official"?"Official":"Classic",
    difficulty:state.difficulty.name,difficultyId:state.difficulty.id,stage:state.lesson.stage,
    lessonId:state.lesson.id,levelTitle:state.lesson.title,status:"playing",
    score:0,rewardPoints:0,maxRewardPoints:state.gameMode==="official"?0:maxTokenForLesson(state.lesson),wpm:0,accuracy:0,mistakes:0,elapsedSeconds:0,createdAt:serverTimestamp()
  });
  state.attemptId=r.id;
  state.timer=setInterval(updateClassicStats,100);
}

function renderStrictCode(){
  const code=state.lesson?.code||"";
  let h="";
  for(let i=0;i<code.length;i++){
    let cls=i<state.correctText.length?"correct":(i===state.correctText.length?"current":"pending");
    const ch=code[i];
    const display=ch==="\n"?"\n":ch===" "?" ":esc(ch);
    h+=`<span class="${cls}">${display}</span>`;
  }
  $("typingDisplay").innerHTML=h;
  const pct=code.length?state.correctText.length/code.length*100:0;
  $("progressBar").style.width=`${pct}%`;
  $("progressText").textContent=`${state.correctText.length} / ${code.length}`;
  $("typingDisplay").querySelector(".current")?.scrollIntoView({block:"nearest"});
}

function shakeWrong(expected,pressed){
  const shell=$("gameShell");
  shell.classList.remove("wrong-shake");
  void shell.offsetWidth;
  shell.classList.add("wrong-shake");
  $("typingStage").classList.add("wrong-flash");
  $("typingStatus").textContent=`ผิด: ต้องพิมพ์ ${expected==="\n"?"Enter":expected===" "?"Space":expected}`;
  setTimeout(()=>{$("typingStage").classList.remove("wrong-flash");shell.classList.remove("wrong-shake");$("typingStatus").textContent="พิมพ์ตัวเดิมใหม่ให้ถูก — ไม่ต้อง Backspace";},260);
}

function keyToInput(e){
  if(e.key==="Enter")return "\n";
  if(e.key==="Tab")return "\t";
  if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey)return e.key;
  return null;
}

$("typingStage").onclick=()=> $("typingInput").focus({preventScroll:true});

$("typingInput").addEventListener("keydown",async e=>{
  if(state.finished){e.preventDefault();return;}
  if(["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
    e.preventDefault();$("typingStatus").textContent="Strict Mode: ไม่ต้องลบ พิมพ์ตัวที่ค้างให้ถูก";return;
  }
  const raw=keyToInput(e);
  if(raw===null)return;
  e.preventDefault();
  if(!state.started)await startClassic();

  const code=state.lesson.code;
  const pos=state.correctText.length;
  const expected=code[pos];
  state.keystrokes++;

  if(raw==="\t"){
    if(expected===" "){
      let count=0;
      while(code[pos+count]===" "&&count<4)count++;
      state.correctText+=code.slice(pos,pos+count);
      renderStrictCode();updateClassicStats();
      if(state.correctText===code)finishClassic();
    }else{
      state.mistakes++;shakeWrong(expected,"Tab");updateClassicStats();
    }
    return;
  }

  if(raw===expected){
    state.correctText+=raw;
    renderStrictCode();
    $("typingStatus").textContent="ถูก ✓";
    updateClassicStats();
    if(state.correctText===code)finishClassic();
  }else{
    state.mistakes++;
    shakeWrong(expected,raw);
    updateClassicStats();
  }
});

function updateClassicStats(){
  $("statTime").textContent=fmtTime(elapsed());
  $("statWpm").textContent=Math.round(wpm());
  $("statAccuracy").textContent=`${accuracy().toFixed(0)}%`;
  $("statMistakes").textContent=state.mistakes;
  if(state.gameMode==="official") $("statScore").textContent="—";
  else { const live=calculateStageTokenReward(state.lesson,wpm(),accuracy()); $("statScore").textContent=`${live.earned}/${live.maxToken}`; }
  syncMobileStats();
}

async function awardCompletion(reward){
  const ref=doc(db,"users",state.uid);
  const lang=state.language.id;
  const stage=state.lesson.stage;
  reward=Math.min(70,Math.max(0,Number(reward||0)));
  await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    if(!snap.exists())return;
    const d=snap.data();
    const currentUnlocked=Number(d.progress?.[lang]?.maxUnlockedStage||1);
    const newUnlocked=Math.max(currentUnlocked,Math.min(50,stage+1));
    const progress={...(d.progress||{})};
    progress[lang]={...(progress[lang]||{}),maxUnlockedStage:newUnlocked};
    tx.update(ref,{
      tokenBalance:Number(d.tokenBalance||0)+reward,
      tokenLifetime:Number(d.tokenLifetime||0)+reward,
      progress,
      updatedAt:serverTimestamp()
    });
  });
  await ensureProfileDefaults();
}

function renderResultExplanation(lesson){
  const box=$("resultExplanation");
  if(!box||!lesson)return;
  box.classList.remove("hidden");
  $("resultCodeUsage").textContent=lesson.usage||lesson.description||"ฝึกโครงสร้างและไวยากรณ์ของโค้ด";
  $("resultCodeBenefit").textContent=lesson.benefit||"ช่วยให้เข้าใจวิธีนำโค้ดไปต่อยอดในงานจริง";
  $("resultCodeOutput").textContent=lesson.outputExplain||lesson.output||lesson.description||"ผลลัพธ์ตามคำสั่งที่พิมพ์";
  $("resultCodeSample").textContent=lesson.code||"";
}

async function finishClassic(){
  if(state.finished)return;
  state.finished=true;
  clearInterval(state.timer);

  const e=elapsed();
  const wp=Math.round(((state.correctText.length/5)/Math.max(e/60,1/60))*100)/100;
  const acc=Math.round(accuracy()*100)/100;
  const score=liveScore();

  if(state.gameMode==="official"){
    const item=state.officialSelected;
    const officialScore=calculateOfficialStageScore(item,acc,wp,e);

    if(state.attemptId)await updateDoc(doc(db,"attempts",state.attemptId),{
      status:"completed",
      modeName:"Official",
      officialStage:item.officialStage,
      academicScore:officialScore,
      academicMaxScore:item.maxScore,
      score:0,
      rewardPoints:0,
      wpm:wp,accuracy:acc,mistakes:state.mistakes,
      elapsedSeconds:Math.round(e*100)/100,
      finishedAt:serverTimestamp()
    });

    await saveOfficialStage(item,officialScore,acc,wp,Math.round(e*100)/100);
    await updateMyRank();

    $("resultTitle").textContent=`ผ่านด่านทางการ ${item.officialStage}/30`;
    $("resultText").textContent="ผลคะแนนถูกเก็บสำหรับครู และจะส่งจริงเมื่อทำครบ 30 ด่านแล้วกดส่งงาน";
    $("resultScore").textContent="บันทึกแล้ว";
    $("resultWpm").textContent=wp;
    $("resultAccuracy").textContent=`${acc}%`;
    $("resultTime").textContent=`${e.toFixed(2)}s`;
    $("nextLevelButton").style.display="none";
    renderResultExplanation(state.lesson);

    await leaveRealFullscreen();
    showScreen("resultScreen");
    return;
  }

  const tokenResult=calculateStageTokenReward(state.lesson,wp,acc);
  const earnedToken=Math.min(70,tokenResult.earned);
  if(state.attemptId)await updateDoc(doc(db,"attempts",state.attemptId),{
    status:"completed",score,rewardPoints:earnedToken,maxRewardPoints:tokenResult.maxToken,wpm:wp,accuracy:acc,
    mistakes:state.mistakes,elapsedSeconds:Math.round(e*100)/100,finishedAt:serverTimestamp()
  });

  await awardCompletion(earnedToken);
  await updateMyRank();

  $("resultTitle").textContent=`ผ่าน Stage ${state.lesson.stage} +${earnedToken} Token`;
  $("resultText").textContent=`${state.language.name} · ${state.difficulty.name} · ${state.lesson.title} · สูงสุด ${tokenResult.maxToken} Token`;
  $("resultScore").textContent=`+${earnedToken} / ${tokenResult.maxToken} Token`;
  $("resultWpm").textContent=wp;
  $("resultAccuracy").textContent=`${acc}%`;
  $("resultTime").textContent=`${e.toFixed(2)}s`;
  $("nextLevelButton").style.display=state.lesson.stage<50?"":"none";
  renderResultExplanation(state.lesson);

  await leaveRealFullscreen();
  showScreen("resultScreen");
}

$("quitButton").onclick=async()=>{
  if(state.attemptId&&!state.finished)await updateDoc(doc(db,"attempts",state.attemptId),{status:"abandoned",finishedAt:serverTimestamp()});
  clearInterval(state.timer);await leaveRealFullscreen();showScreen("userPortal");
};
$("playAgainButton").onclick=async()=>{prepareClassic();showScreen("gameScreen");await requestRealFullscreen();setTimeout(()=>$("typingInput").focus(),100)};
$("nextLevelButton").onclick=async()=>{
  const next=languageLessons().find(x=>x.stage===state.lesson.stage+1);
  if(!next)return;
  state.lesson=next;state.difficulty=DIFFICULTIES.find(x=>x.id===next.difficulty);
  prepareClassic();showScreen("gameScreen");await requestRealFullscreen();setTimeout(()=>$("typingInput").focus({preventScroll:true}),100);
};
$("portalButton").onclick=async()=>{await ensureProfileDefaults();await enterPortal()};

function renderRewardShop(){
  if(!$("rewardShop"))return;
  const balance=Number(state.player?.tokenBalance||0);
  const owned=new Set(state.player?.inventory||[]);

  const items=[...REWARD_ITEMS].sort((a,b)=>
    (RARITY_META[a.rarity]?.order||0)-(RARITY_META[b.rarity]?.order||0) || a.cost-b.cost
  );

  $("rewardShop").innerHTML=items.map(item=>`
    <article class="reward-card rarity-${item.rarity} ${owned.has(item.id)?"owned":""}">
      <div class="reward-rarity">${RARITY_META[item.rarity]?.name||item.rarity}${item.set==="set2"?" · SET 2 +30%":""}</div>
      <div class="reward-icon">${item.icon}</div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.description)}</p>
      <div class="reward-slot">SLOT · ${item.slot.toUpperCase()}</div>
      <div class="reward-cost">${item.cost.toLocaleString()} Token</div>
      <button class="btn ${owned.has(item.id)?"ghost":"secondary"}" data-redeem="${item.id}" ${owned.has(item.id)||balance<item.cost?"disabled":""}>
        ${owned.has(item.id)?"มีแล้ว":balance<item.cost?"Token ไม่พอ":"แลกไอเท็ม"}
      </button>
    </article>`).join("");

  document.querySelectorAll("[data-redeem]:not([disabled])").forEach(b=>{
    b.onclick=()=>redeemReward(b.dataset.redeem);
  });
}
async function redeemReward(id){
  const item=REWARD_ITEMS.find(x=>x.id===id);
  if(!item)return;
  const ref=doc(db,"users",state.uid);
  try{
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);
      const d=snap.data();
      const balance=Number(d.tokenBalance||0);
      const inv=Array.isArray(d.inventory)?d.inventory:[];
      if(inv.includes(id))throw new Error("มีไอเทมแล้ว");
      if(balance<item.cost)throw new Error("แต้มไม่พอ");
      tx.update(ref,{tokenBalance:balance-item.cost,inventory:[...inv,id],updatedAt:serverTimestamp()});
    });
    await ensureProfileDefaults();
    $("userTokens").textContent=Number(state.player.tokenBalance||0).toLocaleString();
  renderUserRank();
    renderRewardShop();
    if(!$("characterProfileModal")?.classList.contains("hidden")) renderCharacterProfile();
  }catch(err){alert(err.message)}
}

function listenHistory(){
  if(state.historyUnsub)state.historyUnsub();
  state.historyUnsub=onSnapshot(query(collection(db,"attempts"),where("uid","==",state.uid)),snap=>{
    const rows=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.toDate?.()?.getTime?.()||0)-(a.createdAt?.toDate?.()?.getTime?.()||0));
    const done=rows.filter(x=>x.status==="completed");
    $("userTotalAttempts").textContent=rows.length;
    $("userCompleted").textContent=done.length;
    $("userBestScore").textContent=Math.max(0,...done.map(x=>Number(x.score||0))).toLocaleString();
    $("userBestWpm").textContent=Math.max(0,...done.map(x=>Number(x.wpm||0))).toFixed(0);
    $("userHistoryBody").innerHTML=rows.slice(0,10).map(x=>`<tr><td>${fmtDate(x.createdAt)}</td><td>${esc(x.language||"-")}</td><td>${esc(x.modeName||"-")}</td><td>${esc(x.difficulty||"-")}</td><td>${esc(x.status)}</td><td>${Number(x.score||0).toLocaleString()}</td><td>${Number(x.wpm||0).toFixed(1)}</td><td>${Number(x.accuracy||0).toFixed(1)}%</td></tr>`).join("")||`<tr><td colspan="8" class="empty">ยังไม่มีประวัติ</td></tr>`;
  });
}


function timestampMs(v){try{return v?.toMillis?.()??v?.toDate?.()?.getTime?.()??0}catch{return 0}}
function rankBoundaryFromSettings(settings=state.rankSettings,now=Date.now()){
  const last=timestampMs(settings?.lastResetAt),next=timestampMs(settings?.nextResetAt);return Math.max(last,(next&&next<=now)?next:0);
}
function effectiveRankForProfile(p){
  const boundary=rankBoundaryFromSettings();if(!boundary)return p?.rank||{};const updated=Date.parse(p?.rank?.updatedAt||"")||0;
  if(updated>=boundary)return p?.rank||{};
  return {tierId:"bronze",tierName:"Bronze",tierIcon:"🥉",rating:0};
}
function renderRankResetNotice(){
  const box=$("rankResetNotice");if(!box)return;const cfg=state.rankSettings||{},next=timestampMs(cfg.nextResetAt),last=timestampMs(cfg.lastResetAt),now=Date.now();
  const activeBoundary=rankBoundaryFromSettings(cfg,now),localUpdated=Date.parse(state.player?.rank?.updatedAt||"")||0;
  if(!next){
    box.classList.add("hidden");
    if(activeBoundary&&state.uid&&state.player&&localUpdated<activeBoundary){
      const version=cfg.resetVersion||`manual_${activeBoundary}`;
      if(state.rankResetAppliedVersion!==version){state.rankResetAppliedVersion=version;updateMyRank().then(async()=>{await syncPublicProfile();renderUserRank();listenTopRanking()}).catch(error=>console.warn("apply manual rank reset:",error));}
    }
    return;
  }
  box.classList.remove("hidden");
  const d=new Date(next),future=next>now;$("rankResetNoticeTitle").textContent=future?"ประกาศกำหนดรีแรงค์":"เริ่มรอบ Ranking ใหม่แล้ว";
  $("rankResetNoticeText").textContent=`${cfg.notice||"ระบบจะเริ่ม Ranking รอบใหม่"} · ${d.toLocaleString("th-TH")}`;
  const left=Math.max(0,next-now),day=Math.floor(left/86400000),h=Math.floor((left%86400000)/3600000),m=Math.floor((left%3600000)/60000),sec=Math.floor((left%60000)/1000);
  $("rankResetNoticeCountdown").textContent=future?`เหลือ ${day} วัน ${h} ชม. ${m} นาที ${sec} วินาที`:`รีแรงค์มีผลแล้ว · คะแนนก่อนเวลานี้ไม่ถูกนำมาคำนวณรอบใหม่`;
  const version=cfg.resetVersion||`scheduled_${next}`;
  if(!future&&state.uid&&state.player&&state.rankResetAppliedVersion!==version){
    state.rankResetAppliedVersion=version;
    updateMyRank().then(async()=>{await syncPublicProfile();renderUserRank();listenTopRanking()}).catch(error=>console.warn("apply scheduled rank reset:",error));
  }
}
function listenRankResetNotice(){
  if(state.rankSettingsUnsub)state.rankSettingsUnsub();clearInterval(state.rankResetTimer);
  state.rankSettingsUnsub=onSnapshot(doc(db,"system_settings","ranking"),snap=>{state.rankSettings=snap.exists()?snap.data():{};renderRankResetNotice();listenTopRanking();},error=>console.warn("rank reset notice:",error));
  state.rankResetTimer=setInterval(renderRankResetNotice,1000);
}

function renderUserRank(){
  const rank=state.player?.rank || {};
  const tierIcon=rank.tierIcon || "🥉";
  const tierName=rank.tierName || "Bronze";
  const rating=Number(rank.rating||0);
  $("userRank").innerHTML=`${rankShieldHTML(rank,"small")} <span>${tierName} ${rating}</span>`;
  const range=seasonRange(new Date());
  $("rankSeasonLabel").textContent=`${seasonIdFromDate(new Date())} · ${range.end.toLocaleDateString("th-TH")}`;
}

function officialStageSource(item){
  return LESSONS.find(l=>l.language===item.language && Number(l.stage)===Number(item.sourceStage));
}

function officialProgressMap(){
  return state.player?.officialProgress || {};
}

function renderOfficialStages(){
  const progress=officialProgressMap();
  const done=OFFICIAL_STAGES.filter(s=>progress[String(s.officialStage)]?.completed).length;
  $("officialCompletedCount").textContent=done;
  $("officialSubmitStatus").textContent=state.player?.officialSubmitted ? "ส่งแล้ว" : "ยังไม่ส่ง";
  $("submitOfficialButton").disabled = done !== OFFICIAL_STAGES.length || !!state.player?.officialSubmitted;

  $("officialStageGrid").innerHTML=OFFICIAL_STAGES.map(item=>{
    const p=progress[String(item.officialStage)]||{};
    return `<button class="official-stage ${p.completed?"completed":""}" data-official="${item.officialStage}">
      <span>${String(item.officialStage).padStart(2,"0")}</span>
      <strong>${item.languageName} · ${esc(item.title)}</strong>
      <small>${p.completed?"✓ ทำแล้ว":"ยังไม่ทำ"} · ${item.maxScore} คะแนน</small>
    </button>`;
  }).join("");

  document.querySelectorAll("[data-official]").forEach(b=>b.onclick=()=>startOfficialStage(Number(b.dataset.official)));
}

async function startOfficialStage(stageNo){
  const item=OFFICIAL_STAGES.find(x=>x.officialStage===stageNo);
  const lesson=officialStageSource(item);
  if(!item||!lesson)return;
  state.gameMode="official";
  state.officialSelected=item;
  state.language=LANGUAGES.find(x=>x.id===item.language);
  state.lesson=lesson;
  state.difficulty=DIFFICULTIES.find(x=>x.id===lesson.difficulty);
  prepareClassic();
  $("modeBadge").textContent=`📋 ทางการ · ${item.languageName}`;
  $("challengeTitle").textContent=`ทางการ ${stageNo}/30 · ${item.title}`;
  $("statScore").textContent="—";
  $("saveState").textContent=`คะแนนเต็ม ${item.maxScore} · ส่งให้ Admin เมื่อส่งงานครบ`;
  showScreen("gameScreen");
  await requestRealFullscreen();
  setTimeout(()=>$("typingInput").focus({preventScroll:true}),120);
}

function calculateOfficialStageScore(item, acc, wp, elapsedSeconds){
  // คะแนนทางการเน้นความถูกต้องก่อน แล้วค่อยโบนัสความเร็ว
  const accuracyRatio=Math.max(0,Math.min(1,acc/100));
  const timeTarget=Number(state.lesson?.timeLimit||90);
  const speedRatio=Math.max(0,Math.min(1,timeTarget/Math.max(elapsedSeconds,1)));
  const normalized=accuracyRatio*0.85 + speedRatio*0.15;
  return Math.max(0,Math.min(item.maxScore,Math.round(item.maxScore*normalized*100)/100));
}

async function saveOfficialStage(item, score, acc, wp, elapsedSeconds){
  const ref=doc(db,"users",state.uid);
  await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    if(!snap.exists())return;
    const d=snap.data();
    const officialProgress={...(d.officialProgress||{})};
    const prev=officialProgress[String(item.officialStage)];
    // เก็บผลดีที่สุดของด่าน
    if(!prev || Number(score)>Number(prev.score||0)){
      officialProgress[String(item.officialStage)]={
        completed:true,
        score,
        maxScore:item.maxScore,
        accuracy:acc,
        wpm:wp,
        elapsedSeconds,
        lessonId:state.lesson.id,
        updatedAt:new Date().toISOString()
      };
    }
    tx.update(ref,{officialProgress,updatedAt:serverTimestamp()});
  });
  await ensureProfileDefaults();
}

$("submitOfficialButton").onclick=async()=>{
  const progress=officialProgressMap();
  const completed=OFFICIAL_STAGES.filter(s=>progress[String(s.officialStage)]?.completed);
  if(completed.length!==30){alert("ต้องทำครบ 30 ด่านก่อนส่งงาน");return;}
  if(state.player?.officialSubmitted){alert("ส่งงานทางการแล้ว");return;}

  const totalScore=OFFICIAL_STAGES.reduce((sum,s)=>sum+Number(progress[String(s.officialStage)]?.score||0),0);
  const avgAccuracy=OFFICIAL_STAGES.reduce((sum,s)=>sum+Number(progress[String(s.officialStage)]?.accuracy||0),0)/30;
  const avgWpm=OFFICIAL_STAGES.reduce((sum,s)=>sum+Number(progress[String(s.officialStage)]?.wpm||0),0)/30;

  const submission={
    uid:state.uid,
    studentId:state.player.studentId,
    fullName:state.player.fullName,
    educationLevel:state.player.educationLevel,
    classroom:state.player.classroom,
    department:state.player.department,
    completedStages:30,
    totalScore:Math.round(totalScore*100)/100,
    maxScore:OFFICIAL_TOTAL_SCORE,
    avgAccuracy:Math.round(avgAccuracy*10)/10,
    avgWpm:Math.round(avgWpm*10)/10,
    progress,
    submittedAt:serverTimestamp()
  };

  await setDoc(doc(db,"official_submissions",state.uid),submission);
  await updateDoc(doc(db,"users",state.uid),{officialSubmitted:true,officialSubmittedAt:serverTimestamp()});
  await ensureProfileDefaults();
  renderOfficialStages();
  alert("ส่งงานทางการให้ครูเรียบร้อยแล้ว");
}

async function updateMyRank(){
  const seasonId=seasonIdFromDate(new Date()),range=seasonRange(new Date());
  try{const settingsSnap=await getDoc(doc(db,"system_settings","ranking"));state.rankSettings=settingsSnap.exists()?settingsSnap.data():state.rankSettings||{};}catch{}
  const boundary=rankBoundaryFromSettings(state.rankSettings),startMs=Math.max(range.start.getTime(),boundary||0),attempts=[];
  const snap=await getDocs(query(collection(db,"attempts"),where("uid","==",state.uid)));
  snap.forEach(d=>{const a=d.data(),dt=a.createdAt?.toDate?.();if(dt&&dt.getTime()>=startMs&&dt<=range.end&&a.status==="completed")attempts.push(a)});
  const activeDays=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size,metrics=calculateRankMetrics(attempts,activeDays);
  const rank={seasonId,...metrics,updatedAt:new Date().toISOString(),resetBoundaryAt:boundary?new Date(boundary).toISOString():null};
  await updateDoc(doc(db,"users",state.uid),{rank,updatedAt:serverTimestamp()});state.player.rank=rank;renderUserRank();
}



/* ===== V3.8 CHARACTER PROFILE + TOKEN FASHION ===== */
function setupCharacterUi(){
  if($("openCharacterProfileButton")) $("openCharacterProfileButton").onclick=openCharacterProfile;
  if($("closeCharacterProfileButton")) $("closeCharacterProfileButton").onclick=()=>$("characterProfileModal").classList.add("hidden");
  if($("selectMaleCharacter")) $("selectMaleCharacter").onclick=()=>saveCharacterGender("male");
  if($("selectFemaleCharacter")) $("selectFemaleCharacter").onclick=()=>saveCharacterGender("female");
  if($("unequipAllButton")) $("unequipAllButton").onclick=unequipAllItems;
}

async function saveCharacterGender(gender){
  if(!state.uid||!["male","female"].includes(gender))return;

  const character={
    ...DEFAULT_CHARACTER,
    ...(state.player.character||{}),
    gender,
    displayName:state.player.fullName||"",
    equipped:{...DEFAULT_CHARACTER.equipped,...(state.player.character?.equipped||{})}
  };

  await updateDoc(doc(db,"users",state.uid),{character,updatedAt:serverTimestamp()});
  state.player.character=character;
  $("characterSetupModal").classList.add("hidden");
  await syncPublicProfile();

  // มือถือ/แท็บเล็ตใช้เฉพาะ 2D Zone หลังเลือกตัวละครเสร็จ
  if(isMobileOrTabletDevice()){
    location.replace("./zone.html?v=4.6.0");
  }
}

function characterEquippedItem(slot){
  const id=state.player?.character?.equipped?.[slot];
  return REWARD_ITEMS.find(x=>x.id===id)||null;
}

function applyCharacterVisual(){
  const el=$("profileCharacter");
  if(!el)return;

  el.className=`game-character ${state.player?.character?.gender||"male"}`;

  ["head","face","top","bottom","back","hand","pet"].forEach(slot=>{
    const node=el.querySelector(`.char-${slot}-item`);
    const item=characterEquippedItem(slot);
    if(node){
      node.dataset.visual=item?.visual||"";
      node.dataset.rarity=item?.rarity||"";
      node.title=item?.name||"";
    }
  });

  const aura=characterEquippedItem("aura");
  const auraNode=el.querySelector(".char-aura");
  if(auraNode){
    auraNode.dataset.visual=aura?.visual||"";
    auraNode.dataset.rarity=aura?.rarity||"";
  }

  const shoes=characterEquippedItem("shoes");
  el.querySelectorAll(".char-shoe").forEach(node=>{
    node.dataset.equipped=shoes?.visual||"";
  });
}

function renderCharacterProfile(){
  if(!state.player)return;

  $("characterProfileStudentId").textContent=state.player.studentId||"-";
  $("characterTokenBalance").textContent=Number(state.player.tokenBalance||0).toLocaleString();
  $("characterRankName").textContent=state.player.rank?.tierName||"Bronze";
  $("characterOwnedCount").textContent=(state.player.inventory||[]).length;

  applyCharacterVisual();

  const owned=new Set(state.player.inventory||[]);
  const equippedIds=new Set(Object.values(state.player.character?.equipped||{}).filter(Boolean));

  const items=REWARD_ITEMS
    .filter(item=>owned.has(item.id))
    .sort((a,b)=>(RARITY_META[b.rarity]?.order||0)-(RARITY_META[a.rarity]?.order||0)||b.cost-a.cost);

  $("characterInventoryList").innerHTML=items.length?items.map(item=>`
    <article class="wardrobe-item rarity-${item.rarity} ${equippedIds.has(item.id)?"equipped":""}">
      <div class="wardrobe-icon">${item.icon}</div>
      <div class="wardrobe-info">
        <span>${RARITY_META[item.rarity]?.name||item.rarity}</span>
        <strong>${esc(item.name)}</strong>
        <small>${esc(item.description)}</small>
      </div>
      <div class="wardrobe-action">
        <small>${item.slot.toUpperCase()}</small>
        <button data-equip-item="${item.id}" class="btn ${equippedIds.has(item.id)?"ghost":"secondary"}" type="button">
          ${equippedIds.has(item.id)?"ถอด":"สวมใส่"}
        </button>
      </div>
    </article>
  `).join(""):`<div class="empty-card">ยังไม่มีไอเท็มแต่งตัว ไปที่ Token Shop เพื่อแลกไอเท็ม</div>`;

  document.querySelectorAll("[data-equip-item]").forEach(btn=>{
    btn.onclick=()=>toggleEquipItem(btn.dataset.equipItem);
  });
}

async function openCharacterProfile(){
  await ensureProfileDefaults();
  renderCharacterProfile();
  $("characterProfileModal").classList.remove("hidden");
}

async function toggleEquipItem(itemId){
  const item=REWARD_ITEMS.find(x=>x.id===itemId);
  if(!item||!(state.player.inventory||[]).includes(itemId))return;

  const equipped={...DEFAULT_CHARACTER.equipped,...(state.player.character?.equipped||{})};
  equipped[item.slot]=equipped[item.slot]===item.id?null:item.id;

  const character={...DEFAULT_CHARACTER,...state.player.character,equipped};
  await updateDoc(doc(db,"users",state.uid),{character,updatedAt:serverTimestamp()});
  state.player.character=character;

  renderCharacterProfile();
  await syncPublicProfile();
}

async function unequipAllItems(){
  const character={
    ...DEFAULT_CHARACTER,
    ...state.player.character,
    equipped:{...DEFAULT_CHARACTER.equipped}
  };
  await updateDoc(doc(db,"users",state.uid),{character,updatedAt:serverTimestamp()});
  state.player.character=character;
  renderCharacterProfile();
  await syncPublicProfile();
}

/* ===== V3.4 SOCIAL HUB: Community + Presence + Top 10 ===== */
const ONLINE_STALE_MS = 90 * 1000;

function rankTierMeta(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase();
  const map={bronze:{name:"Bronze",letter:"B"},silver:{name:"Silver",letter:"S"},gold:{name:"Gold",letter:"G"},platinum:{name:"Platinum",letter:"P"},diamond:{name:"Diamond",letter:"D"},master:{name:"Master",letter:"M"}};
  return {id,...(map[id]||map.bronze)};
}
function rankShieldHTML(rank,size="normal"){
  const t=rankTierMeta(rank);
  return `<span class="rank-shield rank-${t.id} ${size}" title="${t.name} · ${Number(rank?.rating||0)} Rating"><span class="rank-shield-letter">${t.letter}</span></span>`;
}
async function syncPublicProfile(){
  if(!state.uid||!state.player)return;
  try{
    await setDoc(doc(db,"public_profiles",state.uid),{
      uid:state.uid,
      fullName:state.player.fullName,
      studentId:state.player.studentId,
      educationLevel:state.player.educationLevel||"",
      classroom:state.player.classroom||"",
      classKey:classKey(state.player.educationLevel,state.player.classroom),
      rank:state.player.rank||{tierId:"bronze",tierName:"Bronze",rating:0},
      avatarId:state.player.character?.avatarId||"default_student",
      character:{
        gender:state.player.character?.gender||null,
        equipped:{...DEFAULT_CHARACTER.equipped,...(state.player.character?.equipped||{})},
        showcaseItemIds:(Array.isArray(state.player.inventory)?state.player.inventory:[]).slice(0,3)
      },
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("public profile:",error)}
}
async function writePresence(area="portal"){
  if(!state.uid||!state.player)return;
  try{
    await setDoc(doc(db,"presence",state.uid),{
      uid:state.uid,fullName:state.player.fullName,studentId:state.player.studentId,
      rank:state.player.rank||null,area,online:true,lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("presence:",error)}
}
async function markOffline(){
  if(!state.uid)return;
  try{await setDoc(doc(db,"presence",state.uid),{online:false,lastSeenAt:serverTimestamp()},{merge:true})}catch{}
}
function presenceOnline(p){
  if(!p?.online)return false;
  const d=p.lastSeenAt?.toDate?.();
  return !d || Date.now()-d.getTime()<=ONLINE_STALE_MS;
}
function renderCommunity(profiles){
  if(!$('communityPlayersList'))return;
  const list=[...profiles].sort((a,b)=>{
    const ao=presenceOnline(state.presenceCache.get(a.uid));
    const bo=presenceOnline(state.presenceCache.get(b.uid));
    if(ao!==bo)return bo-ao;
    return Number(b.rank?.rating||0)-Number(a.rank?.rating||0);
  });
  $('communityPlayersList').innerHTML=list.length?list.map(p=>{
    const pr=state.presenceCache.get(p.uid)||{};
    const online=presenceOnline(pr), me=p.uid===state.uid;
    return `<div class="community-player-row ${online?'online':'offline'} ${me?'me':''}">
      <div class="community-avatar">${esc(String(p.fullName||'?').trim().slice(0,1).toUpperCase())}</div>
      <div class="community-player-info"><strong>${esc(p.fullName||'-')} ${me?'<em>YOU</em>':''}</strong><small>${esc(p.rank?.tierName||'Bronze')} · ${Number(p.rank?.rating||0)} Rating${online?` · ${pr.area==='zone'?'อยู่ใน 2D Zone':'Online'}`:' · Offline'}</small></div>
      ${rankShieldHTML(p.rank,'small')}
      <span class="community-status ${online?'on':'off'}">${online?'ONLINE':'OFFLINE'}</span>
    </div>`;
  }).join(''):`<div class="empty-card">ยังไม่มีผู้เล่นในระบบ</div>`;
}
function listenCommunityPlayers(){
  if(state.communityUnsub)state.communityUnsub();
  let profiles=[];
  state.communityUnsub=onSnapshot(collection(db,"public_profiles"),snap=>{
    profiles=snap.docs.map(d=>({uid:d.id,...d.data()}));renderCommunity(profiles);
  });
  if(state.presenceUnsub)state.presenceUnsub();
  state.presenceUnsub=onSnapshot(collection(db,"presence"),snap=>{
    state.presenceCache=new Map(snap.docs.map(d=>[d.id,{uid:d.id,...d.data()}]));
    const online=[...state.presenceCache.values()].filter(presenceOnline).length;
    if($('onlinePlayerCount'))$('onlinePlayerCount').textContent=online;
    renderCommunity(profiles);
  });
}
function rankingRowsHtml(rows,scopeLabel){
  return rows.length?rows.map((u,i)=>`<div class="ranking-row ${i<3?`podium-${i+1}`:''} ${u.uid===state.uid?'me':''}">
    <div class="ranking-position">${i+1}</div>${rankShieldHTML(u.rank)}
    <div class="ranking-player"><strong>${esc(u.fullName||u.studentId||'-')}</strong><small>${esc(u.studentId||'-')} · ${esc(u.rank?.tierName||'Bronze')} · ${scopeLabel}</small></div>
    <div class="ranking-rating"><strong>${Number(u.rank?.rating||0)}</strong><small>RATING</small></div>
  </div>`).join(''):`<div class="empty-card">ยังไม่มีข้อมูล Ranking</div>`;
}
function setupRankingModeSwitch(){
  const overall=$("rankingModeOverall"),room=$("rankingModeClass");
  if(overall)overall.onclick=()=>{overall.classList.add("active");room?.classList.remove("active");$("topRankingList")?.classList.remove("hidden");$("classRankingList")?.classList.add("hidden")};
  if(room)room.onclick=()=>{room.classList.add("active");overall?.classList.remove("active");$("classRankingList")?.classList.remove("hidden");$("topRankingList")?.classList.add("hidden")};
}
function listenTopRanking(){
  if(state.leaderboardUnsub)state.leaderboardUnsub();
  const myClass=classKey(state.player?.educationLevel,state.player?.classroom);
  if($("classRankingLabel"))$("classRankingLabel").textContent=myClass||"ห้องของฉัน";
  if($("leaderboardSeason"))$("leaderboardSeason").textContent=seasonIdFromDate(new Date());
  setupRankingModeSwitch();
  state.leaderboardUnsub=onSnapshot(collection(db,"public_profiles"),snap=>{
    const all=snap.docs.map(d=>({uid:d.id,...d.data()})).filter(x=>x.uid!=="TWUrLjOh3BTa1cBNwDXKk4X2IAg1").map(x=>({...x,rank:effectiveRankForProfile(x)}));
    const overall=rankProfiles(all,10);
    const room=rankProfiles(all.filter(x=>(x.classKey||classKey(x.educationLevel,x.classroom))===myClass),10);
    if($("topRankingList"))$("topRankingList").innerHTML=rankingRowsHtml(overall,"แรงค์รวม");
    if($("classRankingList"))$("classRankingList").innerHTML=rankingRowsHtml(room,myClass||"แรงค์ห้อง");
  },error=>console.warn("dual ranking:",error));
}
function startSocialHub(){
  clearInterval(state.presenceTimer);
  syncPublicProfile();writePresence('portal');listenCommunityPlayers();listenRankResetNotice();listenTopRanking();
  state.presenceTimer=setInterval(()=>writePresence(document.body.classList.contains('game-active')?'game':'portal'),30000);
}
window.addEventListener('pagehide',()=>markOffline());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')writePresence(document.body.classList.contains('game-active')?'game':'portal')});

/* ===== V4.6 PVP MULTI ROOM · 1/3/5 SHOT · 1V1/2V2 RELAY · TOKEN WAGER ===== */
const PVP_ROOM_STALE_MS=20*60*1000;
const PVP_CREATE_FEE=6;
const PVP_COUNTDOWN_MS=3000;
function pvpSettings(){
  const teamMode=$("pvpTeamMode")?.value||"1v1";
  const shotCount=Number($("pvpShotCount")?.value||3);
  return {teamMode,shotCount,wager:Number($("pvpWager")?.value||0),maxPlayers:teamMode==="2v2"?4:2};
}
function renderPvpConfig(){
  if(!state.language){setMatchmakingStatus("error","ยังไม่ได้เลือกภาษา","กรุณาเลือก HTML หรือ Python ก่อนเข้า PVP");return false;}
  if(!state.difficulty)state.difficulty=DIFFICULTIES[0];
  if(!state.lesson)state.lesson=languageLessons().find(x=>x.stage<=maxUnlocked(state.language.id))||languageLessons()[0];
  startPvpRoomBrowser();
  return !!state.lesson;
}
function setMatchmakingStatus(type,title,detail=""){
  const box=$("matchmakingStatus");if(!box)return;box.dataset.state=type||"idle";
  $("matchmakingStatusText").textContent=title;$("matchmakingStatusDetail").textContent=detail;
}
function setMatchButtonsBusy(busy){
  ["createRoomButton","refreshRoomsButton","joinRoomCodeButton"].forEach(id=>{if($(id))$(id).disabled=busy});
}
function systemRoomCode(length=6){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",bytes=new Uint32Array(length);
  if(window.crypto?.getRandomValues){window.crypto.getRandomValues(bytes);return Array.from(bytes,n=>chars[n%chars.length]).join("");}
  return Array.from({length},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}
async function createUniqueRoomCode(){for(let i=0;i<20;i++){const code=systemRoomCode();if(!(await getDoc(doc(db,"pvp_rooms",code))).exists())return code;}throw new Error("สร้าง Room Code ไม่สำเร็จ");}
function roomPlayers(room){return Object.values(room?.players||{}).sort((a,b)=>Number(a.joinedOrder||0)-Number(b.joinedOrder||0));}
function playerCount(room){return roomPlayers(room).length;}
function roomFull(room){return playerCount(room)>=Number(room?.maxPlayers||2);}
function roomFresh(room){const d=room?.createdAt?.toDate?.();return !d||Date.now()-d.getTime()<PVP_ROOM_STALE_MS;}
function isJoinableRoom(room){return !!room&&room.status==="waiting"&&roomFresh(room)&&!room.players?.[state.uid]&&playerCount(room)<Number(room.maxPlayers||2)&&(!state.language?.id||room.languageId===state.language.id);}
function teamMembers(room,team){return roomPlayers(room).filter(p=>p.team===team);}
function activeUidForTeam(room,team){const m=teamMembers(room,team);if(!m.length)return null;if(room?.teamMode!=="2v2")return m[0]?.uid||null;const leg=Math.max(0,Math.min(1,Number(room?.relayLegs?.[team]||0)));return m[leg]?.uid||m[0]?.uid||null;}
function activePlayerForTeam(room,team){return room?.players?.[activeUidForTeam(room,team)]||null;}
function myPvpTeam(room=state.roomData){return room?.players?.[state.uid]?.team||null;}
function isMyTurn(room=state.roomData){if(!room)return false;if(room.teamMode!=="2v2")return !!room.players?.[state.uid];return activeUidForTeam(room,myPvpTeam(room))===state.uid;}
function splitRelayCode(code){const src=String(code||"");if(src.length<2)return [src,""];let mid=Math.floor(src.length/2),best=-1;for(let d=0;d<Math.min(80,src.length);d++){for(const pos of [mid+d,mid-d]){if(pos>0&&pos<src.length&&src[pos]==="\n"){best=pos+1;break}}if(best>0)break;}if(best<0){for(let d=0;d<Math.min(50,src.length);d++){for(const pos of [mid+d,mid-d]){if(pos>0&&pos<src.length&&/\s/.test(src[pos])){best=pos+1;break}}if(best>0)break;}}if(best<0)best=mid;return [src.slice(0,best),src.slice(best)];}
function pvpCodeForMyTurn(room,lesson){if(room?.teamMode!=="2v2")return lesson?.code||"";const team=myPvpTeam(room),leg=Math.max(0,Math.min(1,Number(room?.relayLegs?.[team]||0)));return splitRelayCode(lesson?.code||"")[leg]||"";}
function teamProgress(room,team){const active=activePlayerForTeam(room,team)||{},seg=Math.max(0,Math.min(100,Number(active.progress||0)));if(room?.teamMode!=="2v2")return seg;const leg=Math.max(0,Math.min(1,Number(room?.relayLegs?.[team]||0)));return Math.min(100,leg*50+seg*.5);}

function teamAssignment(players,mode){const n=Object.keys(players||{}).length;if(mode==="1v1")return {team:n===0?"A":"B",teamSlot:0};const seq=[{team:"A",teamSlot:0},{team:"B",teamSlot:0},{team:"A",teamSlot:1},{team:"B",teamSlot:1}];return seq[Math.min(n,3)];}
function choosePvpLessons(count){
  let pool=languageLessons().filter(x=>x.difficulty===(state.difficulty?.id||"easy")&&x.stage<=maxUnlocked(state.language.id));
  if(pool.length<count)pool=languageLessons().filter(x=>x.stage<=maxUnlocked(state.language.id));
  if(!pool.length)pool=languageLessons();
  const shuffled=[...pool].sort(()=>Math.random()-.5),ids=[];for(let i=0;i<count;i++)ids.push(shuffled[i%shuffled.length].id);return ids;
}
function pvpRoomRuleText(room){return `${room.teamMode.toUpperCase()} · ${room.shotCount} SHOT · เดิมพัน ${Number(room.wager||0)} TOKEN · ค่าสร้าง ${Number(room.creationFee??PVP_CREATE_FEE)}T · ${playerCount(room)}/${room.maxPlayers}`;}
function renderAvailableRooms(rooms){
  const box=$("availablePvpRooms");if(!box)return;const list=rooms.filter(isJoinableRoom).sort((a,b)=>Number(b.createdAt?.seconds||0)-Number(a.createdAt?.seconds||0));
  $("availableRoomCount").textContent=`${list.length} ห้อง`;
  box.innerHTML=list.length?list.map(r=>`<article class="available-room-card"><div><span>ROOM</span><strong>${r.code}</strong></div><div><b>${r.teamMode.toUpperCase()}</b><small>${r.shotCount} Shot · ${Number(r.wager||0)} Token · ${playerCount(r)}/${r.maxPlayers}</small></div><button class="btn secondary" data-join-pvp-room="${r.code}" type="button">เข้าห้อง</button></article>`).join(""):`<div class="empty-card">ยังไม่มีห้อง ${esc(state.language?.name||"")} ที่กำลังรอ — สร้างห้องใหม่ได้ทันที</div>`;
  document.querySelectorAll("[data-join-pvp-room]").forEach(b=>b.onclick=()=>joinRoomByCode(b.dataset.joinPvpRoom));
}
function startPvpRoomBrowser(){
  if(state.pvpRoomListUnsub)state.pvpRoomListUnsub();
  state.pvpRoomListUnsub=onSnapshot(query(collection(db,"pvp_rooms"),where("status","==","waiting")),snap=>renderAvailableRooms(snap.docs.map(d=>({code:d.id,...d.data()}))),err=>{console.warn("room browser:",err);if($("availablePvpRooms"))$("availablePvpRooms").innerHTML='<div class="empty-card">โหลดรายการห้องไม่สำเร็จ</div>'});
}
async function refreshRoomBrowser(){startPvpRoomBrowser();setMatchmakingStatus("idle","รีเฟรชรายการห้องแล้ว","เลือกห้องจากรายการหรือกรอก Room Code");}
$("refreshRoomsButton").onclick=refreshRoomBrowser;
$("pvpTeamMode").onchange=()=>setMatchmakingStatus("idle","ปรับรูปแบบทีมแล้ว",$("pvpTeamMode").value==="2v2"?"2v2 Relay: สมาชิกทีมสลับกันพิมพ์คนละครึ่งของ Code ในทุก Shot":"1v1: แข่ง Code เต็มชุด");

async function leaveCurrentLobby(){
  if(state.roomUnsub){state.roomUnsub();state.roomUnsub=null;}
  const code=state.roomCode;if(code){const roomRef=doc(db,"pvp_rooms",code),userRef=doc(db,"users",state.uid);
    try{await runTransaction(db,async tx=>{const rs=await tx.get(roomRef);if(!rs.exists())return;const room=rs.data();if(room.status!=="waiting"||!room.players?.[state.uid])return;const players={...(room.players||{})},mine=players[state.uid],wager=Number(room.wager||0);if(mine.stakeLocked&&wager>0){const us=await tx.get(userRef);if(us.exists())tx.update(userRef,{tokenBalance:Number(us.data().tokenBalance||0)+wager,updatedAt:serverTimestamp()});}delete players[state.uid];const left=Object.keys(players);if(!left.length){tx.delete(roomRef);return;}let hostUid=room.hostUid;if(hostUid===state.uid)hostUid=left[0];tx.update(roomRef,{players,hostUid,lastActivityAt:serverTimestamp()});});}catch(e){console.warn("leave lobby:",e)} }
  state.roomCode=null;state.roomData=null;state.pvpActiveRoom=null;state.pvpCurrentShot=-1;state.pvpAttemptId=null;state.pvpResultSaved=false;state.pvpTurnSignature=null;state.pvpRecordedSignature=null;state.pvpTargetCode="";state.pvpAggregate={typedChars:0,keys:0,mistakes:0,seconds:0};
  $("pvpLobby")?.classList.add("hidden");$("startPvpButton")?.classList.add("hidden");$("leaveLobbyButton")?.classList.add("hidden");setMatchButtonsBusy(false);setMatchmakingStatus("idle","พร้อมใช้งาน","สร้างห้อง เลือกห้อง หรือกรอก Room Code");await ensureProfileDefaults();if($("userTokens"))$("userTokens").textContent=Number(state.player?.tokenBalance||0).toLocaleString();
}

async function createRoom(){
  if(!renderPvpConfig())return;const cfg=pvpSettings(),required=PVP_CREATE_FEE+cfg.wager;
  if(Number(state.player?.tokenBalance||0)<required){setMatchmakingStatus("error","Token ไม่พอ",`สร้างห้องใช้ ${PVP_CREATE_FEE} Token และควรเหลือเดิมพัน ${cfg.wager} Token · ต้องมีอย่างน้อย ${required}`);return;}
  setMatchButtonsBusy(true);setMatchmakingStatus("searching","กำลังสร้างห้อง...",`หักค่าสร้าง ${PVP_CREATE_FEE} Token และสุ่ม Room Code`);
  try{
    await leaveCurrentLobby();const code=await createUniqueRoomCode(),lessonIds=choosePvpLessons(cfg.shotCount),assign=teamAssignment({},cfg.teamMode),roomRef=doc(db,"pvp_rooms",code),userRef=doc(db,"users",state.uid);state.roomCode=code;
    await runTransaction(db,async tx=>{
      const us=await tx.get(userRef),rs=await tx.get(roomRef);if(!us.exists())throw new Error("ไม่พบ User");if(rs.exists())throw new Error("Room Code ถูกใช้แล้ว กรุณาลองใหม่");
      const bal=Number(us.data().tokenBalance||0);if(bal<PVP_CREATE_FEE+cfg.wager)throw new Error(`Token ไม่พอ ต้องมี ${PVP_CREATE_FEE+cfg.wager}`);
      tx.update(userRef,{tokenBalance:bal-PVP_CREATE_FEE,updatedAt:serverTimestamp()});
      tx.set(roomRef,{code,hostUid:state.uid,languageId:state.language.id,difficultyId:state.difficulty?.id||state.lesson.difficulty,teamMode:cfg.teamMode,shotCount:cfg.shotCount,maxPlayers:cfg.maxPlayers,wager:cfg.wager,creationFee:PVP_CREATE_FEE,creationFeePaid:true,lessonIds,shotIndex:0,relayLegs:{A:0,B:0},scores:{A:0,B:0},shotResults:{},status:"waiting",createdAt:serverTimestamp(),lastActivityAt:serverTimestamp(),players:{[state.uid]:{uid:state.uid,name:state.player.fullName,studentId:state.player.studentId,educationLevel:state.player.educationLevel,classroom:state.player.classroom,...assign,joinedOrder:0,stakeLocked:cfg.wager===0,progress:0,shotFinished:false,joinedAt:new Date().toISOString()}}});
    });
    await ensureProfileDefaults();if($("userTokens"))$("userTokens").textContent=Number(state.player?.tokenBalance||0).toLocaleString();
    setMatchmakingStatus("waiting",`สร้างห้อง ${code} แล้ว · จ่าย ${PVP_CREATE_FEE} Token`,`ค่าสร้างไม่คืน · ส่ง Code ให้เพื่อน หรือรอผู้เล่นเลือกห้อง`);listenRoom(code);
  }catch(e){console.error(e);state.roomCode=null;setMatchButtonsBusy(false);setMatchmakingStatus("error","สร้างห้องไม่สำเร็จ",e.message||"");}
}
$("createRoomButton").onclick=createRoom;

async function joinRoomByCode(rawCode){
  if(!renderPvpConfig())return;const code=String(rawCode||"").trim().toUpperCase();if(code.length!==6){setMatchmakingStatus("error","Room Code ไม่ถูกต้อง","Code ต้องมี 6 ตัวอักษร");return;}
  setMatchButtonsBusy(true);setMatchmakingStatus("searching",`กำลังเข้าห้อง ${code}...`,`ตรวจสอบที่ว่างและกติกาห้อง`);
  try{await leaveCurrentLobby();const ref=doc(db,"pvp_rooms",code);await runTransaction(db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())throw new Error("ไม่พบห้องนี้");const room=snap.data();if(!isJoinableRoom(room))throw new Error("ห้องเต็ม เริ่มแล้ว หมดอายุ หรือภาษาไม่ตรง");if(Number(state.player?.tokenBalance||0)<Number(room.wager||0))throw new Error(`Token ไม่พอ ต้องมี ${Number(room.wager||0)} Token`);const players={...(room.players||{})},assign=teamAssignment(players,room.teamMode);players[state.uid]={uid:state.uid,name:state.player.fullName,studentId:state.player.studentId,educationLevel:state.player.educationLevel,classroom:state.player.classroom,...assign,joinedOrder:Object.keys(players).length,stakeLocked:Number(room.wager||0)===0,progress:0,shotFinished:false,joinedAt:new Date().toISOString()};tx.update(ref,{players,lastActivityAt:serverTimestamp()});});state.roomCode=code;setMatchmakingStatus("matched",`เข้าห้อง ${code} แล้ว`,`รอสมาชิกครบและระบบล็อก Token`);listenRoom(code);
  }catch(e){console.error(e);setMatchButtonsBusy(false);setMatchmakingStatus("error","เข้าห้องไม่สำเร็จ",e.message||"");}
}
$("joinRoomCodeButton").onclick=()=>joinRoomByCode($("joinRoomCodeInput").value);
$("joinRoomCodeInput").addEventListener("input",e=>e.target.value=e.target.value.toUpperCase().replace(/[^A-Z2-9]/g,"").slice(0,6));

async function ensureMyStakeLocked(room){
  if(state.pvpStakeLocking||room.status!=="waiting"||!roomFull(room)||room.players?.[state.uid]?.stakeLocked)return;
  state.pvpStakeLocking=true;const wager=Number(room.wager||0),roomRef=doc(db,"pvp_rooms",state.roomCode),userRef=doc(db,"users",state.uid);
  try{await runTransaction(db,async tx=>{const rs=await tx.get(roomRef);if(!rs.exists())return;const r=rs.data(),mine=r.players?.[state.uid];if(r.status!=="waiting"||!mine||mine.stakeLocked)return;const players={...(r.players||{})};if(wager>0){const us=await tx.get(userRef);if(!us.exists())throw new Error("ไม่พบ User");const bal=Number(us.data().tokenBalance||0);if(bal<wager)throw new Error("TOKEN_LOW");tx.update(userRef,{tokenBalance:bal-wager,updatedAt:serverTimestamp()});}players[state.uid]={...mine,stakeLocked:true,stakeLockedAt:new Date().toISOString()};tx.update(roomRef,{players,lastActivityAt:serverTimestamp()});});await ensureProfileDefaults();if($("userTokens"))$("userTokens").textContent=Number(state.player?.tokenBalance||0).toLocaleString();
  }catch(e){if(e.message==="TOKEN_LOW"){alert(`Token ไม่พอสำหรับห้องนี้ (${wager} Token)`);await leaveCurrentLobby();}else console.warn("stake lock:",e)}finally{state.pvpStakeLocking=false;}
}
function allStakesLocked(room){return roomFull(room)&&roomPlayers(room).every(p=>p.stakeLocked===true);}
function renderLobbyPlayers(room){
  const activeA=activeUidForTeam(room,"A"),activeB=activeUidForTeam(room,"B");
  $("pvpPlayersGrid").innerHTML=roomPlayers(room).map(p=>`<div class="pvp-player-slot team-${p.team.toLowerCase()}"><span>TEAM ${p.team} · SLOT ${Number(p.teamSlot||0)+1}</span><strong>${esc(p.name||p.studentId)}</strong><small>${esc(p.studentId||'-')} · ${p.stakeLocked?'🔒 TOKEN READY':'⏳ LOCK TOKEN'}</small></div>`).join("");
  $("pvpLobbyRule").textContent=pvpRoomRuleText(room);
}
function listenRoom(code){
  if(state.roomUnsub)state.roomUnsub();state.roomCode=code;$("pvpLobby").classList.remove("hidden");$("leaveLobbyButton").classList.remove("hidden");
  state.roomUnsub=onSnapshot(doc(db,"pvp_rooms",code),async snap=>{if(!snap.exists()){await leaveCurrentLobby();setMatchmakingStatus("closed","ห้องถูกปิดแล้ว","เลือกห้องใหม่ได้ทันที");return;}state.roomData=snap.data();const room=state.roomData;$("roomCodeLabel").textContent=code;$("pvpStatus").textContent=String(room.status||"waiting").toUpperCase();renderLobbyPlayers(room);const full=roomFull(room),host=room.hostUid===state.uid;
    if(room.status==="waiting"&&full&&!room.players?.[state.uid]?.stakeLocked)ensureMyStakeLocked(room);
    if(room.status==="waiting"){const ready=allStakesLocked(room);$("pvpLobbyHint").textContent=!full?`รอผู้เล่น ${playerCount(room)}/${room.maxPlayers}`:ready?(host?"พร้อมแล้ว กดเริ่มการแข่งขัน":"พร้อมแล้ว รอ Host เริ่ม"):"สมาชิกครบแล้ว กำลังล็อก Token";$("startPvpButton").classList.toggle("hidden",!(host&&ready));setMatchmakingStatus(full?"matched":"waiting",full?"สมาชิกครบแล้ว":`ห้อง ${code} กำลังรอ`,pvpRoomRuleText(room));}
    if(room.status==="playing"){setMatchmakingStatus("playing","การแข่งขันกำลังดำเนินอยู่",pvpRoomRuleText(room));syncPvpGameFromRoom(room,code);}
    if(room.status==="finished"){syncPvpGameFromRoom(room,code);await handlePvpFinishedRoom(room);}setMatchButtonsBusy(true);
  },e=>{console.error(e);setMatchButtonsBusy(false);setMatchmakingStatus("error","Lobby ขัดข้อง",e.message||"")});
}
$("startPvpButton").onclick=async()=>{if(!state.roomCode)return;const ref=doc(db,"pvp_rooms",state.roomCode);try{await runTransaction(db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())return;const r=snap.data();if(r.hostUid!==state.uid||r.status!=="waiting"||!allStakesLocked(r))throw new Error("ห้องยังไม่พร้อม");const players={};for(const [id,p] of Object.entries(r.players||{}))players[id]={...p,progress:0,shotFinished:false,wpm:0,accuracy:100,mistakes:0};tx.update(ref,{status:"playing",shotIndex:0,relayLegs:{A:0,B:0},scores:{A:0,B:0},shotResults:{},players,startedAt:serverTimestamp(),countdownDurationMs:PVP_COUNTDOWN_MS,shotStartedAt:serverTimestamp(),lastActivityAt:serverTimestamp()});});}catch(e){alert(e.message)}};
$("leaveLobbyButton").onclick=leaveCurrentLobby;

function pvpInitialCountdownEnd(room=state.roomData){const started=room?.startedAt?.toMillis?.()||room?.startedAt?.toDate?.()?.getTime?.()||0;return started&&Number(room?.shotIndex||0)===0?started+Number(room?.countdownDurationMs||0):0}
function pvpCountdownActive(){return state.pvpCountdownEndMs===-1 || (!!state.pvpCountdownEndMs&&Date.now()<state.pvpCountdownEndMs)}
function clearPvpCountdown(){clearInterval(state.pvpCountdownTimer);state.pvpCountdownTimer=null;state.pvpCountdownEndMs=0;$("pvpCountdownOverlay")?.classList.add("hidden")}
function startPvpCountdown(room,turn){
  const duration=Number(room?.countdownDurationMs||0),end=pvpInitialCountdownEnd(room);
  if(duration>0&&!end){
    if(state.pvpCountdownEndMs===-1)return;
    clearInterval(state.pvpCountdownTimer);state.pvpCountdownEndMs=-1;$("pvpTypingInput").disabled=true;$("pvpCountdownOverlay").classList.remove("hidden");$("pvpCountdownNumber").textContent="SYNC";$("pvpGameStatus").textContent="COUNTDOWN";return;
  }
  if(end&&state.pvpCountdownEndMs===end)return;
  clearInterval(state.pvpCountdownTimer);state.pvpCountdownEndMs=end;
  if(!end){$("pvpCountdownOverlay")?.classList.add("hidden");$("pvpTypingInput").disabled=!turn;state.pvpStartTime=Date.now();return;}
  state.pvpStartTime=end;
  if(Date.now()>=end){$("pvpCountdownOverlay")?.classList.add("hidden");$("pvpTypingInput").disabled=!turn;$("pvpGameStatus").textContent=turn?"PLAYING":"WATCHING";return;}
  $("pvpTypingInput").disabled=true;$("pvpCountdownOverlay").classList.remove("hidden");$("pvpGameStatus").textContent="COUNTDOWN";
  const tick=()=>{const left=end-Date.now();if(left<=0){clearInterval(state.pvpCountdownTimer);state.pvpCountdownTimer=null;$("pvpCountdownNumber").textContent="GO!";$("pvpGameStatus").textContent=turn?"PLAYING":"WATCHING";setTimeout(()=>{$("pvpCountdownOverlay").classList.add("hidden")},420);$("pvpTypingInput").disabled=!turn;if(turn)setTimeout(()=>$('pvpTypingInput').focus({preventScroll:true}),80);return;}$("pvpCountdownNumber").textContent=String(Math.min(3,Math.max(1,Math.ceil(left/1000))));};tick();state.pvpCountdownTimer=setInterval(tick,60);
}

function pvpElapsed(){return state.pvpStartTime?Math.max(0,(Date.now()-state.pvpStartTime)/1000):0;}
function pvpAccuracy(){return state.pvpKeys?Math.max(0,(state.pvpCorrectText.length/state.pvpKeys)*100):100;}
function pvpWpm(){const sec=Math.max(pvpElapsed(),.1);return state.pvpCorrectText.length?((state.pvpCorrectText.length/5)/(sec/60)):0;}
function pvpProgressPct(){const code=state.pvpTargetCode||state.pvpLesson?.code||"";return code.length?Math.min(100,state.pvpCorrectText.length/code.length*100):0;}
function aggregatePvpStats(){const a=state.pvpAggregate,includeCurrent=state.pvpTurnSignature&&state.pvpRecordedSignature!==state.pvpTurnSignature&&state.pvpWasActive,chars=a.typedChars+(includeCurrent?state.pvpCorrectText.length:0),keys=a.keys+(includeCurrent?state.pvpKeys:0),seconds=a.seconds+(includeCurrent?pvpElapsed():0),mistakes=a.mistakes+(includeCurrent?state.pvpMistakes:0);return {wpm:chars?((chars/5)/(Math.max(seconds,.1)/60)):0,accuracy:keys?Math.max(0,chars/keys*100):100,mistakes,seconds,chars,keys};}
function recordCurrentPvpShot(){if(!state.pvpTurnSignature||state.pvpRecordedSignature===state.pvpTurnSignature)return;state.pvpRecordedSignature=state.pvpTurnSignature;if(state.pvpWasActive){state.pvpAggregate.typedChars+=state.pvpCorrectText.length;state.pvpAggregate.keys+=state.pvpKeys;state.pvpAggregate.mistakes+=state.pvpMistakes;state.pvpAggregate.seconds+=pvpElapsed();}}
function renderPvpStrictCode(){const code=state.pvpTargetCode||state.pvpLesson?.code||"";let html="";for(let i=0;i<code.length;i++){const cls=i<state.pvpCorrectText.length?"correct":i===state.pvpCorrectText.length?"current":"pending",ch=code[i];html+=`<span class="${cls}">${ch==="\n"?"\n":ch===" "?" ":esc(ch)}</span>`;}$("pvpTypingDisplay").innerHTML=html;$("pvpTypingDisplay").querySelector(".current")?.scrollIntoView({block:"nearest"});$("pvpProgress").textContent=`${Math.floor(pvpProgressPct())}%`;}
function updatePvpStats(){$("pvpTime").textContent=fmtTime(pvpElapsed());$("pvpWpm").textContent=Math.round(pvpWpm());$("pvpAccuracy").textContent=`${pvpAccuracy().toFixed(0)}%`;$("pvpMistakes").textContent=state.pvpMistakes;$("pvpProgress").textContent=`${Math.floor(pvpProgressPct())}%`;}
function pvpWrong(expected){const stage=$("pvpTypingStage");stage.classList.remove("wrong-shake","wrong-flash");void stage.offsetWidth;stage.classList.add("wrong-shake","wrong-flash");$("pvpGameStatus").textContent=`ผิด · ${expected==="\n"?"Enter":expected===" "?"Space":expected}`;setTimeout(()=>{stage.classList.remove("wrong-shake","wrong-flash");if(!state.pvpFinished)$("pvpGameStatus").textContent="PLAYING"},260);}
async function createPvpAttempt(){if(state.pvpAttemptId)return;const room=state.roomData;if(!room)return;try{const r=await addDoc(collection(db,"attempts"),{uid:state.uid,studentId:state.player.studentId,fullName:state.player.fullName,educationLevel:state.player.educationLevel,classroom:state.player.classroom,department:state.player.department,language:state.language?.name||room.languageId,languageId:room.languageId,modeName:"PVP",difficulty:difficultyName(room.difficultyId),difficultyId:room.difficultyId,stage:0,lessonId:"multi_shot",levelTitle:`PVP ${room.shotCount} Shot ${room.teamMode}`,roomCode:state.roomCode,teamMode:room.teamMode,shotCount:room.shotCount,tokenWager:Number(room.wager||0),team:myPvpTeam(room),status:"playing",score:0,rewardPoints:0,wpm:0,accuracy:0,mistakes:0,elapsedSeconds:0,createdAt:serverTimestamp()});state.pvpAttemptId=r.id;}catch(e){console.warn("attempt:",e)}}
async function pushPvpProgress(force=false){if(!state.roomCode||!state.roomData||state.roomData.status!=="playing"||!isMyTurn())return;const now=Date.now();if(!force&&now-state.pvpProgressLastSent<180)return;state.pvpProgressLastSent=now;try{await updateDoc(doc(db,"pvp_rooms",state.roomCode),{[`players.${state.uid}.progress`]:Math.round(pvpProgressPct()*10)/10,[`players.${state.uid}.wpm`]:Math.round(pvpWpm()*100)/100,[`players.${state.uid}.accuracy`]:Math.round(pvpAccuracy()*100)/100,[`players.${state.uid}.mistakes`]:state.pvpMistakes,[`players.${state.uid}.lastUpdateAt`]:serverTimestamp()});}catch(e){console.warn("pvp progress:",e)}}
function schedulePvpProgress(){clearTimeout(state.pvpProgressTimer);state.pvpProgressTimer=setTimeout(()=>pushPvpProgress(false),90);}
function renderPvpTeams(room){const a=teamMembers(room,"A"),b=teamMembers(room,"B"),aa=activeUidForTeam(room,"A"),bb=activeUidForTeam(room,"B");const fmt=(arr,active)=>arr.map(p=>`${p.uid===active?'▶ ':''}${esc(p.studentId||p.name)}`).join(' · ')||'-';$("teamAPlayers").innerHTML=fmt(a,aa);$("teamBPlayers").innerHTML=fmt(b,bb);$("pvpShotScore").textContent=`TEAM A ${Number(room.scores?.A||0)} : ${Number(room.scores?.B||0)} TEAM B`;const ap=room.players?.[aa]||{},bp=room.players?.[bb]||{},av=teamProgress(room,"A"),bv=teamProgress(room,"B");$("teamABar").style.width=`${av}%`;$("teamBBar").style.width=`${bv}%`;$("teamAPct").textContent=`${Math.floor(av)}%`;$("teamBPct").textContent=`${Math.floor(bv)}%`;$("pvpTurnInfo").textContent=room.teamMode==="2v2"?`Relay คนละครึ่ง Code · A: ${ap.studentId||'-'} · B: ${bp.studentId||'-'}`:"แข่งกันพิมพ์ Code ชุดเดียวให้จบก่อน";}
async function enterPvpShot(room,code){
  const idx=Number(room.shotIndex||0),team=myPvpTeam(room),activeUid=activeUidForTeam(room,team),signature=`${idx}:${activeUid||"none"}`;
  if(state.pvpActiveRoom===code&&state.pvpTurnSignature===signature)return;
  const newMatch=state.pvpActiveRoom!==code;
  if(newMatch){state.pvpAttemptId=null;state.pvpResultSaved=false;state.pvpPayoutClaimed=false;state.pvpAggregate={typedChars:0,keys:0,mistakes:0,seconds:0};state.pvpTurnSignature=null;state.pvpRecordedSignature=null;state.pvpCurrentShot=-1;}else{recordCurrentPvpShot();}
  const lesson=LESSONS.find(x=>x.id===room.lessonIds?.[idx]);
  if(!lesson){setMatchmakingStatus("error","ไม่พบโจทย์ PVP","lessonIds ไม่ตรงกับเวอร์ชัน");return;}
  state.pvpActiveRoom=code;state.pvpCurrentShot=idx;state.pvpTurnSignature=signature;state.pvpRecordedSignature=null;state.pvpLesson=lesson;state.pvpCorrectText="";state.pvpMistakes=0;state.pvpKeys=0;state.pvpProgressLastSent=0;state.pvpFinished=false;clearInterval(state.pvpTimer);clearTimeout(state.pvpProgressTimer);$("pvpTypingInput").value="";
  const turn=isMyTurn(room);state.pvpWasActive=turn;state.pvpTargetCode=pvpCodeForMyTurn(room,lesson);$("pvpTypingInput").disabled=!turn;state.pvpStartTime=Date.now();
  const relayLeg=room.teamMode==="2v2"?Number(room.relayLegs?.[team]||0)+1:null;
  $("pvpChallengeTitle").textContent=`Shot ${idx+1}/${room.shotCount} · Stage ${lesson.stage} · ${lesson.title}${relayLeg?` · ส่วน ${relayLeg}/2`:""}`;
  $("pvpChallengeDescription").textContent=room.teamMode==="2v2"?"Relay 2v2: สมาชิกแต่ละทีมสลับกันพิมพ์คนละครึ่งของ Code · PVP ไม่มีคำอธิบายหลังจบ":"PVP ไม่มีคำอธิบายหลังจบ · พิมพ์ Code เต็มชุดให้จบก่อน";
  $("pvpRoomGame").textContent=`Room ${code}`;$("pvpMatchMeta").textContent=`${room.teamMode.toUpperCase()} · ${room.shotCount} Shot · ${Number(room.wager||0)} Token`;$("pvpShotLabel").textContent=`SHOT ${idx+1}/${room.shotCount}`;$("pvpActiveRole").textContent=turn?"YOUR TURN":"WATCHING";$("pvpGameStatus").textContent=turn?"PLAYING":"รอเพื่อนร่วมทีม";$("pvpSaveState").textContent=turn?(room.teamMode==="2v2"?`Relay Part ${relayLeg}/2 · Strict Typing`:"Strict Typing · Realtime"):"Relay Mode · รอรอบของคุณ";
  renderPvpStrictCode();renderPvpTeams(room);updatePvpStats();showScreen("pvpGameScreen");await createPvpAttempt();state.pvpTimer=setInterval(updatePvpStats,100);if(idx===0&&Number(room.countdownDurationMs||0)>0)startPvpCountdown(room,turn);else{clearPvpCountdown();$("pvpTypingInput").disabled=!turn;state.pvpStartTime=Date.now();if(turn)setTimeout(()=>$('pvpTypingInput').focus({preventScroll:true}),100);}
}
function syncPvpGameFromRoom(room,code){if(room.status==="playing"){enterPvpShot(room,code).catch(console.error);renderPvpTeams(room);if(Number(room.shotIndex||0)===0&&Number(room.countdownDurationMs||0)>0)startPvpCountdown(room,isMyTurn(room));}else if(room.status==="finished")renderPvpTeams(room);}
async function declarePvpShotFinish(){
  if(!state.roomCode||state.roomData?.status!=="playing"||!isMyTurn())return;
  state.pvpFinished=true;clearInterval(state.pvpTimer);clearTimeout(state.pvpProgressTimer);recordCurrentPvpShot();
  const ref=doc(db,"pvp_rooms",state.roomCode),shot=state.pvpCurrentShot;
  try{await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);if(!snap.exists())return;const r=snap.data();if(r.status!=="playing"||Number(r.shotIndex)!==shot)return;
    const me=r.players?.[state.uid];if(!me)return;
    // 2v2 Relay: คนแรกพิมพ์ครึ่งแรกเสร็จ -> ส่งไม้ให้เพื่อนร่วมทีม โดยยังไม่ตัดสิน Shot
    if(r.teamMode==="2v2"&&Number(r.relayLegs?.[me.team]||0)===0){
      const relayLegs={A:Number(r.relayLegs?.A||0),B:Number(r.relayLegs?.B||0)};relayLegs[me.team]=1;
      const players={...(r.players||{})};players[state.uid]={...(players[state.uid]||{}),progress:100,relayPartFinished:true,wpm:Math.round(pvpWpm()*100)/100,accuracy:Math.round(pvpAccuracy()*100)/100,mistakes:state.pvpMistakes};
      const nextUid=teamMembers(r,me.team)[1]?.uid;if(nextUid)players[nextUid]={...(players[nextUid]||{}),progress:0,shotFinished:false};
      tx.update(ref,{relayLegs,players,lastActivityAt:serverTimestamp()});return;
    }
    const key=String(shot),results={...(r.shotResults||{})};if(results[key])return;
    const scores={A:Number(r.scores?.A||0),B:Number(r.scores?.B||0)};scores[me.team]+=1;results[key]={winnerUid:state.uid,winnerTeam:me.team,finishedAt:new Date().toISOString()};
    const players={};for(const [id,p] of Object.entries(r.players||{}))players[id]={...p,progress:0,shotFinished:false,relayPartFinished:false};players[state.uid]={...players[state.uid],shotFinished:true,wpm:Math.round(pvpWpm()*100)/100,accuracy:Math.round(pvpAccuracy()*100)/100,mistakes:state.pvpMistakes};
    if(shot+1>=Number(r.shotCount||1)){tx.update(ref,{scores,shotResults:results,players,winnerTeam:scores.A>scores.B?"A":"B",status:"finished",finishedAt:serverTimestamp(),lastActivityAt:serverTimestamp()});}
    else{tx.update(ref,{scores,shotResults:results,players,shotIndex:shot+1,relayLegs:{A:0,B:0},shotStartedAt:serverTimestamp(),lastActivityAt:serverTimestamp()});}
  });}catch(e){console.warn("finish shot:",e);state.pvpFinished=false;}
}
async function claimPvpPayout(room){const wager=Number(room.wager||0),my=room.players?.[state.uid];if(!my||wager<=0||my.team!==room.winnerTeam)return 0;const winners=teamMembers(room,room.winnerTeam).length||1,pot=wager*playerCount(room),share=Math.floor(pot/winners),roomRef=doc(db,"pvp_rooms",state.roomCode),userRef=doc(db,"users",state.uid);let paid=0;try{await runTransaction(db,async tx=>{const rs=await tx.get(roomRef);if(!rs.exists())return;const r=rs.data(),claims={...(r.payoutClaims||{})};if(r.status!=="finished"||r.winnerTeam!==my.team||claims[state.uid])return;const us=await tx.get(userRef);if(!us.exists())return;tx.update(userRef,{tokenBalance:Number(us.data().tokenBalance||0)+share,tokenLifetime:Number(us.data().tokenLifetime||0)+0,updatedAt:serverTimestamp()});claims[state.uid]=true;tx.update(roomRef,{payoutClaims:claims});paid=share;});}catch(e){console.warn("payout:",e)}if(paid){await ensureProfileDefaults();if($("userTokens"))$("userTokens").textContent=Number(state.player.tokenBalance||0).toLocaleString();}return paid;}
async function savePvpAttempt(result,payout=0){if(state.pvpResultSaved)return;state.pvpResultSaved=true;if(!state.pvpAttemptId)await createPvpAttempt();if(!state.pvpAttemptId)return;recordCurrentPvpShot();const a=aggregatePvpStats(),room=state.roomData,wager=Number(room?.wager||0);try{await updateDoc(doc(db,"attempts",state.pvpAttemptId),{status:"completed",pvpResult:result,winnerTeam:room?.winnerTeam||null,team:myPvpTeam(room),score:result==="win"?100:0,rewardPoints:0,tokenWager:wager,tokenPayout:payout,netToken:payout-wager,wpm:Math.round(a.wpm*100)/100,accuracy:Math.round(a.accuracy*100)/100,mistakes:a.mistakes,elapsedSeconds:Math.round(((Date.now()-(room?.startedAt?.toMillis?.()||Date.now()))/1000)*100)/100,finishedAt:serverTimestamp()});}catch(e){console.warn("save pvp:",e)}}
async function handlePvpFinishedRoom(room){if(state.pvpActiveRoom!==state.roomCode)return;recordCurrentPvpShot();state.pvpFinished=true;clearInterval(state.pvpTimer);clearTimeout(state.pvpProgressTimer);$("pvpTypingInput").disabled=true;const won=myPvpTeam(room)===room.winnerTeam,payout=await claimPvpPayout(room);$("pvpGameStatus").textContent=won?"WIN 🏆":"LOSE";$("pvpSaveState").textContent=won?`ทีมคุณชนะ · รับ ${payout} Token จาก Pot`:`ทีม ${room.winnerTeam} ชนะ · เสีย ${Number(room.wager||0)} Token`;await savePvpAttempt(won?"win":"loss",payout);}
$("pvpTypingStage").onclick=()=>{if(isMyTurn())$("pvpTypingInput").focus({preventScroll:true})};
$("pvpTypingInput").addEventListener("keydown",async e=>{if(state.roomData?.status!=="playing"||!isMyTurn()||state.pvpFinished||pvpCountdownActive()){e.preventDefault();if(pvpCountdownActive())$("pvpGameStatus").textContent="COUNTDOWN";return;}if(["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();$("pvpGameStatus").textContent="STRICT · พิมพ์ตัวเดิมใหม่";return;}const raw=keyToInput(e);if(raw===null)return;e.preventDefault();const code=state.pvpTargetCode||state.pvpLesson?.code||"",pos=state.pvpCorrectText.length,expected=code[pos];if(expected===undefined)return;state.pvpKeys++;if(raw==="\t"){if(expected===" "){let count=0;while(code[pos+count]===" "&&count<4)count++;state.pvpCorrectText+=code.slice(pos,pos+count);renderPvpStrictCode();updatePvpStats();schedulePvpProgress();if(state.pvpCorrectText===code)await declarePvpShotFinish();}else{state.pvpMistakes++;pvpWrong(expected);updatePvpStats();}return;}if(raw===expected){state.pvpCorrectText+=raw;renderPvpStrictCode();updatePvpStats();schedulePvpProgress();$("pvpGameStatus").textContent="PLAYING";if(state.pvpCorrectText===code)await declarePvpShotFinish();}else{state.pvpMistakes++;pvpWrong(expected);updatePvpStats();schedulePvpProgress();}});
async function forfeitPvpIfPlaying(){if(!state.roomCode||state.roomData?.status!=="playing")return;const room=state.roomData,myTeam=myPvpTeam(room),other=myTeam==="A"?"B":"A";try{await updateDoc(doc(db,"pvp_rooms",state.roomCode),{winnerTeam:other,status:"finished",forfeitUid:state.uid,finishedAt:serverTimestamp()});}catch(e){console.warn("forfeit:",e)}}
$("leavePvpButton").onclick=async()=>{await forfeitPvpIfPlaying();clearInterval(state.pvpTimer);clearTimeout(state.pvpProgressTimer);clearPvpCountdown();state.pvpActiveRoom=null;state.pvpLesson=null;state.pvpFinished=false;state.pvpCorrectText="";showScreen("userPortal");};


/* ===== Responsive Device UX ===== */
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function isPhoneLayout() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function isMobileOrTabletDevice() {
  const ua = navigator.userAgent || "";
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(ua);
  const iPadDesktopMode = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const coarseTablet = window.matchMedia("(pointer: coarse)").matches
    && Math.min(screen.width || innerWidth, screen.height || innerHeight) <= 1024;
  return mobileUa || iPadDesktopMode || coarseTablet;
}

function isZoneOnlyDevice() {
  return isMobileOrTabletDevice();
}

function applyZoneOnlyPortalMode() {
  const zoneOnly = isZoneOnlyDevice();
  document.documentElement.classList.toggle("zone-only-device", zoneOnly);
  document.body?.classList.toggle("zone-only-device", zoneOnly);

  const notice = $("mobileZoneOnlyNotice");
  if (notice) notice.classList.toggle("hidden", !zoneOnly);

  const zoneOnlyButton = $("mobileZoneOnlyEnter");
  if (zoneOnlyButton) zoneOnlyButton.setAttribute("href", "zone.html");

  const headTitle = document.querySelector("#userPortal .user-portal-head h2");
  if (headTitle && zoneOnly) headTitle.textContent = "เข้าใช้งาน 2D Zone";
  if (headTitle && !zoneOnly) headTitle.textContent = "เลือกภาษาและโหมดการเรียนรู้";
}

function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

function updateDeviceUX() {
  const hint = $("deviceHint");
  if (!hint) return;

  const touch = isTouchDevice();
  const phone = isPhoneLayout();
  const zoneOnly = isZoneOnlyDevice();

  document.documentElement.classList.toggle("touch-device", touch);
  document.documentElement.classList.toggle("phone-layout", phone);
  document.documentElement.classList.toggle("landscape-layout", isLandscape());

  if (zoneOnly) {
    hint.textContent = phone ? (isLandscape() ? "มือถือ · เข้า 2D Zone เท่านั้น" : "มือถือ · เข้า 2D Zone เท่านั้น") : "แท็บเล็ต · เข้า 2D Zone เท่านั้น";
  } else if (phone) {
    hint.textContent = isLandscape() ? "มือถือ · แนวนอน" : "มือถือ · แนวตั้ง";
  } else if (touch) {
    hint.textContent = "Tablet / Touch";
  } else {
    hint.textContent = "Desktop";
  }

  applyZoneOnlyPortalMode();
}

function syncMobileStats() {
  const map = [
    ["mobileStatLevel", "statLevel"],
    ["mobileStatTime", "statTime"],
    ["mobileStatWpm", "statWpm"],
    ["mobileStatAccuracy", "statAccuracy"],
    ["mobileStatMistakes", "statMistakes"],
    ["mobileStatToken", "statScore"]
  ];
  map.forEach(([mobileId, sourceId]) => {
    const mobile = $(mobileId);
    const source = $(sourceId);
    if (mobile && source) mobile.textContent = source.textContent;
  });
}

window.addEventListener("resize", updateDeviceUX);
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    updateDeviceUX();
    $("typingInput")?.focus({preventScroll:true});
  }, 250);
});

if ($("mobileFocusButton")) {
  $("mobileFocusButton").onclick = () => {
    $("typingInput")?.focus({preventScroll:true});
    $("typingStage")?.scrollIntoView({block:"nearest"});
  };
}

if ($("mobileStatsButton")) {
  $("mobileStatsButton").onclick = () => {
    syncMobileStats();
    $("mobileStatsSheet")?.classList.remove("hidden");
  };
}

if ($("closeMobileStats")) {
  $("closeMobileStats").onclick = () => {
    $("mobileStatsSheet")?.classList.add("hidden");
    $("typingInput")?.focus({preventScroll:true});
  };
}

if ($("mobileStatsSheet")) {
  $("mobileStatsSheet").addEventListener("click", (e) => {
    if (e.target === $("mobileStatsSheet")) {
      $("mobileStatsSheet").classList.add("hidden");
      $("typingInput")?.focus({preventScroll:true});
    }
  });
}

if ($("mobileExitButton")) {
  $("mobileExitButton").onclick = () => $("quitButton")?.click();
}

updateDeviceUX();

onAuthStateChanged(auth,async user=>{
  if(!user){state.uid=null;state.player=null;showScreen("authScreen");return;}
  if(user.email==="pisit_2000@thc-nr.local"){location.replace("./admin.html?v=4.6.0");return;}
  state.uid=user.uid;
  try{
    await routeAuthenticatedStudent();
  }catch(error){
    console.error("auth route:",error);
    showScreen("authScreen");
    $("loginMessage").textContent="เปิดบัญชีไม่สำเร็จ กรุณา Reload แล้วลองใหม่";
  }
});

buildKeyboard();
updateRegister();
