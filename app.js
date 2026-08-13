import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, where, orderBy, limit, onSnapshot, runTransaction
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js?v=4.3.0";
import { LANGUAGES, LESSONS, DIFFICULTIES } from "./lessons.js?v=4.3.0";
import { REWARD_ITEMS, RARITY_META } from "./reward-data.js?v=4.3.0";
import { DEFAULT_CHARACTER, DEFAULT_ZONE_STATE } from "./character-system.js?v=4.3.0";
import { OFFICIAL_STAGES, OFFICIAL_TOTAL_SCORE } from "./official-data.js?v=4.3.0";
import { RANKING_CONFIG, seasonIdFromDate, seasonRange, calculateRankMetrics } from "./ranking-system.js?v=4.3.0";

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
  pvpProgressTimer:null, pvpProgressLastSent:0, pvpResultSaved:false
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
    location.replace("./zone.html?v=4.3.0");
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
      <strong>${String(l.stage).padStart(2,"0")}</strong><span>${esc(l.title)}</span><small>${l.rewardPoints} pts ${l.stage>unlocked?"· 🔒":""}</small>
    </button>`).join("");
  document.querySelectorAll("[data-classic-stage]:not([disabled])").forEach(b=>b.onclick=()=>{
    state.lesson=languageLessons().find(x=>x.stage===Number(b.dataset.classicStage));
    renderClassicStages();renderStageSelector();renderLessonDetail();updateClassicSummary();
  });
}

function updateClassicSummary(){
  const ok=state.language&&state.difficulty&&state.lesson&&state.lesson.stage<=maxUnlocked(state.language.id);
  $("startClassicButton").disabled=!ok;
  $("classicLessonSummary").textContent=ok?`${state.language.name} · ${state.difficulty.name} · ด่าน ${state.lesson.stage} · รับ ${state.lesson.rewardPoints} แต้ม`:"เลือกภาษาระดับและด่านที่ปลดล็อกแล้ว";
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
  $("saveState").textContent=`รางวัล ${state.lesson.rewardPoints} Token`;
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
    score:0,rewardPoints:state.gameMode==="official"?0:state.lesson.rewardPoints,wpm:0,accuracy:0,mistakes:0,elapsedSeconds:0,createdAt:serverTimestamp()
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
  $("statScore").textContent=state.gameMode==="official"?"—":Number(state.lesson.rewardPoints||0);
  syncMobileStats();
}

async function awardCompletion(){
  const ref=doc(db,"users",state.uid);
  const lang=state.language.id;
  const stage=state.lesson.stage;
  const reward=Number(state.lesson.rewardPoints||0);
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

    await leaveRealFullscreen();
    showScreen("resultScreen");
    return;
  }

  if(state.attemptId)await updateDoc(doc(db,"attempts",state.attemptId),{
    status:"completed",score,rewardPoints:state.lesson.rewardPoints,wpm:wp,accuracy:acc,
    mistakes:state.mistakes,elapsedSeconds:Math.round(e*100)/100,finishedAt:serverTimestamp()
  });

  await awardCompletion();
  await updateMyRank();

  $("resultTitle").textContent=`ผ่าน Stage ${state.lesson.stage} +${state.lesson.rewardPoints} Token`;
  $("resultText").textContent=`${state.language.name} · ${state.difficulty.name} · ${state.lesson.title}`;
  $("resultScore").textContent=`+${state.lesson.rewardPoints} Token`;
  $("resultWpm").textContent=wp;
  $("resultAccuracy").textContent=`${acc}%`;
  $("resultTime").textContent=`${e.toFixed(2)}s`;
  $("nextLevelButton").style.display=state.lesson.stage<50?"":"none";

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
      <div class="reward-rarity">${RARITY_META[item.rarity]?.name||item.rarity}</div>
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
  const seasonId=seasonIdFromDate(new Date());
  const range=seasonRange(new Date());

  const attempts=[];
  // ใช้ข้อมูลจาก history listener ผ่าน Firestore query ใหม่ให้ชัดเจน
  const snap=await getDocs(query(collection(db,"attempts"),where("uid","==",state.uid)));
  snap.forEach(d=>{
    const a=d.data();
    const dt=a.createdAt?.toDate?.();
    if(dt && dt>=range.start && dt<=range.end)attempts.push(a);
  });

  const activeDays=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size;
  const metrics=calculateRankMetrics(attempts,activeDays);
  const rank={seasonId,...metrics,updatedAt:new Date().toISOString()};
  await updateDoc(doc(db,"users",state.uid),{rank,updatedAt:serverTimestamp()});
  state.player.rank=rank;
  renderUserRank();
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
    location.replace("./zone.html?v=4.3.0");
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
function listenTopRanking(){
  if(state.leaderboardUnsub)state.leaderboardUnsub();
  const q=query(collection(db,"public_profiles"),orderBy("rank.rating","desc"),limit(10));
  state.leaderboardUnsub=onSnapshot(q,snap=>{
    const rows=snap.docs.map(d=>({uid:d.id,...d.data()}));
    if($('leaderboardSeason'))$('leaderboardSeason').textContent=seasonIdFromDate(new Date());
    if($('topRankingList'))$('topRankingList').innerHTML=rows.length?rows.map((u,i)=>`<div class="ranking-row ${i<3?`podium-${i+1}`:''}">
      <div class="ranking-position">${i+1}</div>${rankShieldHTML(u.rank)}
      <div class="ranking-player"><strong>${esc(u.fullName||'-')}</strong><small>${esc(u.rank?.tierName||'Bronze')} · Season Rating</small></div>
      <div class="ranking-rating"><strong>${Number(u.rank?.rating||0)}</strong><small>RATING</small></div>
    </div>`).join(''):`<div class="empty-card">ยังไม่มีข้อมูล Ranking</div>`;
  },error=>{console.warn('top ranking:',error)});
}
function startSocialHub(){
  clearInterval(state.presenceTimer);
  syncPublicProfile();writePresence('portal');listenCommunityPlayers();listenTopRanking();
  state.presenceTimer=setInterval(()=>writePresence(document.body.classList.contains('game-active')?'game':'portal'),30000);
}
window.addEventListener('pagehide',()=>markOffline());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')writePresence(document.body.classList.contains('game-active')?'game':'portal')});

/* PVP V2.1 — Auto Room Code + Random Matchmaking */
function renderPvpConfig(){
  if(!state.language){
    setMatchmakingStatus("error","ยังไม่ได้เลือกภาษา","กรุณาเลือก HTML หรือ Python ก่อนเข้า PVP");
    return false;
  }

  if(!state.difficulty) state.difficulty = DIFFICULTIES[0];

  if(!state.lesson){
    state.lesson =
      languageLessons().find(x => x.stage <= maxUnlocked(state.language.id)) ||
      languageLessons()[0];
  }

  return !!state.lesson;
}

function setMatchmakingStatus(type, title, detail=""){
  const box = $("matchmakingStatus");
  if(!box) return;

  box.dataset.state = type || "idle";
  $("matchmakingStatusText").textContent = title;
  $("matchmakingStatusDetail").textContent = detail;
}

function setMatchButtonsBusy(busy){
  const create = $("createRoomButton");
  const find = $("findRoomButton");

  if(create) create.disabled = busy;
  if(find) find.disabled = busy;
}

function systemRoomCode(length=6){
  // ตัด I, O, 0, 1 ออก เพื่อไม่ให้ผู้เล่นอ่านสับสน
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(length);

  if(window.crypto?.getRandomValues){
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, n => chars[n % chars.length]).join("");
  }

  // fallback เฉพาะ Browser เก่ามาก
  let code = "";
  for(let i=0;i<length;i++){
    code += chars[Math.floor(Math.random()*chars.length)];
  }
  return code;
}

async function createUniqueRoomCode(){
  for(let attempt=0; attempt<15; attempt++){
    const code = systemRoomCode(6);
    const snap = await getDoc(doc(db,"pvp_rooms",code));
    if(!snap.exists()) return code;
  }

  throw new Error("ไม่สามารถสร้าง Room Code ที่ไม่ซ้ำได้ กรุณาลองอีกครั้ง");
}

function playerCount(room){
  return Object.keys(room?.players || {}).length;
}

function isJoinableRoom(room){
  if(!room) return false;
  if(room.status !== "waiting") return false;
  if(room.hostUid === state.uid) return false;
  if(playerCount(room) >= 2) return false;
  const created=room.createdAt?.toDate?.();
  if(created && Date.now()-created.getTime()>10*60*1000) return false;

  // ให้ค้นหาเฉพาะห้องภาษาเดียวกัน เพื่อเริ่มแข่งได้ทันที
  if(state.language?.id && room.languageId !== state.language.id) return false;

  return true;
}

async function leaveCurrentLobby({deleteEmptyHostRoom=true} = {}){
  if(state.roomUnsub){
    state.roomUnsub();
    state.roomUnsub = null;
  }

  const code = state.roomCode;
  const room = state.roomData;

  if(code && room){
    const ref = doc(db,"pvp_rooms",code);

    try{
      if(room.hostUid === state.uid && deleteEmptyHostRoom && room.status === "waiting"){
        // ถ้า Host ออกตอนยังรอ ให้ลบห้อง เพื่อไม่ให้เหลือ Lobby ร้าง
        await deleteDoc(ref);
      } else if(room.status === "waiting" && room.players?.[state.uid]){
        // Challenger ออกจาก Lobby: เอาตัวเองออกจาก players
        await runTransaction(db, async tx => {
          const snap = await tx.get(ref);
          if(!snap.exists()) return;

          const data = snap.data();
          const players = {...(data.players || {})};
          delete players[state.uid];

          tx.update(ref,{players});
        });
      }
    }catch(error){
      console.warn("leaveCurrentLobby:", error);
    }
  }

  state.roomCode = null;
  state.roomData = null;

  $("pvpLobby")?.classList.add("hidden");
  $("startPvpButton")?.classList.add("hidden");
  $("leaveLobbyButton")?.classList.add("hidden");

  setMatchButtonsBusy(false);
  setMatchmakingStatus("idle","พร้อมจับคู่","เลือก “สร้างห้อง” หรือ “ค้นหาห้อง”");
}

$("createRoomButton").onclick = async () => {
  if(!renderPvpConfig()) return;

  setMatchButtonsBusy(true);
  setMatchmakingStatus("searching","กำลังสร้างห้อง...","ระบบกำลังสุ่ม Room Code ที่ไม่ซ้ำ");

  try{
    await leaveCurrentLobby();

    const code = await createUniqueRoomCode();
    state.roomCode = code;

    await setDoc(doc(db,"pvp_rooms",code),{
      code,
      hostUid:state.uid,
      languageId:state.language.id,
      lessonId:state.lesson.id,
      difficultyId:state.lesson.difficulty,
      status:"waiting",
      matchType:"private_auto_code",
      createdAt:serverTimestamp(),
      players:{
        [state.uid]:{
          uid:state.uid,
          name:state.player.fullName,
          studentId:state.player.studentId,
          progress:0,
          finished:false,
          joinedAt:new Date().toISOString()
        }
      }
    });

    setMatchmakingStatus(
      "waiting",
      `สร้างห้อง ${code} แล้ว`,
      "Room Code ถูกสุ่มโดยระบบ กำลังรอผู้เล่นคนที่ 2"
    );

    listenRoom(code);
  }catch(error){
    console.error(error);
    setMatchButtonsBusy(false);
    setMatchmakingStatus("error","สร้างห้องไม่สำเร็จ",error.message || "กรุณาลองใหม่");
  }
};

$("findRoomButton").onclick = async () => {
  if(!renderPvpConfig()) return;

  setMatchButtonsBusy(true);
  setMatchmakingStatus(
    "searching",
    "กำลังค้นหาคู่แข่ง...",
    `ค้นหา Lobby ${state.language.name} ที่กำลังรอผู้เล่น`
  );

  try{
    await leaveCurrentLobby();

    // ดึงห้อง waiting แล้วสุ่มลำดับ เพื่อไม่ให้ทุกคนเข้าห้องแรกเหมือนกัน
    const waitingSnap = await getDocs(
      query(collection(db,"pvp_rooms"), where("status","==","waiting"))
    );

    const candidates = waitingSnap.docs
      .map(d => ({code:d.id, ...d.data()}))
      .filter(isJoinableRoom)
      .sort(() => Math.random() - 0.5);

    if(!candidates.length){
      setMatchButtonsBusy(false);
      setMatchmakingStatus(
        "empty",
        "ยังไม่พบห้องว่าง",
        `ตอนนี้ยังไม่มีผู้เล่น ${state.language.name} ที่กำลังรอ ลองค้นหาอีกครั้งหรือกดสร้างห้อง`
      );
      return;
    }

    let joinedCode = null;

    // ลองทีละห้องด้วย Transaction ป้องกันผู้เล่นหลายคนแย่งช่องเดียวกัน
    for(const candidate of candidates){
      try{
        const ref = doc(db,"pvp_rooms",candidate.code);

        const joined = await runTransaction(db, async tx => {
          const snap = await tx.get(ref);
          if(!snap.exists()) return false;

          const data = snap.data();
          if(!isJoinableRoom(data)) return false;

          const players = {...(data.players || {})};
          players[state.uid] = {
            uid:state.uid,
            name:state.player.fullName,
            studentId:state.player.studentId,
            progress:0,
            finished:false,
            joinedAt:new Date().toISOString()
          };

          tx.update(ref,{
            players,
            matchedAt:serverTimestamp()
          });

          return true;
        });

        if(joined){
          joinedCode = candidate.code;
          break;
        }
      }catch(error){
        console.warn("ข้ามห้องที่ถูกจับคู่ไปแล้ว:", candidate.code, error);
      }
    }

    if(!joinedCode){
      setMatchButtonsBusy(false);
      setMatchmakingStatus(
        "empty",
        "ห้องที่พบถูกจับคู่ไปแล้ว",
        "มีผู้เล่นอื่นเข้าห้องก่อนคุณ กดค้นหาห้องอีกครั้งได้ทันที"
      );
      return;
    }

    state.roomCode = joinedCode;
    setMatchmakingStatus(
      "matched",
      `พบห้อง ${joinedCode}`,
      "เข้าห้องสำเร็จแล้ว รอ Host เริ่มการแข่งขัน"
    );

    listenRoom(joinedCode);
  }catch(error){
    console.error(error);
    setMatchButtonsBusy(false);
    setMatchmakingStatus("error","ค้นหาห้องไม่สำเร็จ",error.message || "กรุณาลองอีกครั้ง");
  }
};

function listenRoom(code){
  if(state.roomUnsub) state.roomUnsub();

  state.roomCode = code;
  $("pvpLobby").classList.remove("hidden");
  $("leaveLobbyButton").classList.remove("hidden");

  state.roomUnsub = onSnapshot(doc(db,"pvp_rooms",code), snap => {
    if(!snap.exists()){
      state.roomCode = null;
      state.roomData = null;
      $("pvpLobby").classList.add("hidden");
      $("startPvpButton").classList.add("hidden");
      $("leaveLobbyButton").classList.add("hidden");
      setMatchButtonsBusy(false);
      setMatchmakingStatus("closed","ห้องถูกปิดแล้ว","สร้างห้องหรือค้นหาห้องใหม่ได้ทันที");
      return;
    }

    state.roomData = snap.data();
    const ps = Object.entries(state.roomData.players || {});

    $("roomCodeLabel").textContent = code;
    $("pvpPlayer1").textContent = ps[0]?.[1]?.name || "รอผู้เล่น...";
    $("pvpPlayer2").textContent = ps[1]?.[1]?.name || "รอผู้เล่น...";
    $("pvpStatus").textContent = String(state.roomData.status || "waiting").toUpperCase();

    const count = ps.length;
    const meIsHost = state.roomData.hostUid === state.uid;

    if(count < 2){
      $("pvpLobbyHint").textContent = "รอผู้เล่นอีก 1 คน";
      setMatchmakingStatus("waiting",`ห้อง ${code} กำลังรอคู่แข่ง`,`มีผู้เล่น ${count}/2 คน`);
    } else if(state.roomData.status === "waiting"){
      $("pvpLobbyHint").textContent = meIsHost ? "ผู้เล่นครบแล้ว กดเริ่มการแข่งขัน" : "ผู้เล่นครบแล้ว รอ Host เริ่ม";
      setMatchmakingStatus("matched","จับคู่สำเร็จแล้ว",meIsHost ? "กดเริ่มการแข่งขันได้เลย" : "กำลังรอ Host เริ่มเกม");
    } else if(state.roomData.status === "playing"){
      $("pvpLobbyHint").textContent = "การแข่งขันกำลังเริ่ม";
      setMatchmakingStatus("playing","เริ่มการแข่งขันแล้ว","กำลังเข้าสู่เกม PVP");
      enterPvpGame(state.roomData,code).catch(error=>console.error("enterPvpGame:",error));
    } else if(state.roomData.status === "finished"){
      $("pvpLobbyHint").textContent = "การแข่งขันจบแล้ว";
      updatePvpRoomProgress(state.roomData);
      handlePvpFinishedRoom(state.roomData).catch(error=>console.error("finish PVP:",error));
    }

    if(state.roomData.status === "playing") updatePvpRoomProgress(state.roomData);

    $("startPvpButton").classList.toggle(
      "hidden",
      !(meIsHost && count === 2 && state.roomData.status === "waiting")
    );

    // เมื่ออยู่ใน Lobby แล้ว ปิดปุ่มสร้าง/ค้นหา ป้องกันสร้างหลายห้องซ้อน
    setMatchButtonsBusy(true);
  }, error => {
    console.error(error);
    setMatchButtonsBusy(false);
    setMatchmakingStatus("error","การเชื่อมต่อ Lobby มีปัญหา",error.message || "");
  });
}

$("startPvpButton").onclick = async () => {
  if(!state.roomCode) return;

  await updateDoc(doc(db,"pvp_rooms",state.roomCode),{
    status:"playing",
    startedAt:serverTimestamp()
  });
};

$("leaveLobbyButton").onclick = async () => {
  await leaveCurrentLobby();
};

$("leavePvpButton").onclick = async () => {
  await forfeitPvpIfPlaying();
  clearInterval(state.pvpTimer);
  clearTimeout(state.pvpProgressTimer);
  state.pvpActiveRoom=null;state.pvpLesson=null;state.pvpFinished=false;state.pvpCorrectText="";
  await leaveCurrentLobby({deleteEmptyHostRoom:false});
  showScreen("userPortal");
};

function buildKeyboard(){
  const keyboard=$("keyboard"); if(!keyboard)return;
  keyboard.innerHTML="";
  const rows=[["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"],["Space"]];
  const map=new Map();
  rows.forEach(row=>{
    const r=document.createElement("div");r.className="keyboard-row";
    row.forEach(k=>{
      const el=document.createElement("div");el.className="key";el.textContent=k==="Space"?"":k;
      if(["Backspace","Tab","Caps","Enter","Shift"].includes(k))el.classList.add("wide");
      if(k==="Space")el.classList.add("space");
      r.appendChild(el);
      const n=(k==="Space"?" ":k).toLowerCase();if(!map.has(n))map.set(n,[]);map.get(n).push(el);
    });keyboard.appendChild(r);
  });
  const mk=k=>(k==="CapsLock"?"caps":k).toLowerCase();
  window.addEventListener("keydown",e=>(map.get(mk(e.key))||[]).forEach(x=>x.classList.add("active")));
  window.addEventListener("keyup",e=>(map.get(mk(e.key))||[]).forEach(x=>x.classList.remove("active")));
}


/* ===== V4.3 COMPLETE PVP REALTIME GAME ===== */
function pvpElapsed(){
  if(!state.pvpStartTime)return 0;
  return Math.max(0,(Date.now()-state.pvpStartTime)/1000);
}
function pvpAccuracy(){
  return state.pvpKeys?Math.max(0,(state.pvpCorrectText.length/state.pvpKeys)*100):100;
}
function pvpWpm(){
  const sec=Math.max(pvpElapsed(),0.1);
  return state.pvpCorrectText.length?((state.pvpCorrectText.length/5)/(sec/60)):0;
}
function pvpProgressPct(){
  const code=state.pvpLesson?.code||"";
  return code.length?Math.min(100,(state.pvpCorrectText.length/code.length)*100):0;
}
function renderPvpStrictCode(){
  const code=state.pvpLesson?.code||"";
  let html="";
  for(let i=0;i<code.length;i++){
    const cls=i<state.pvpCorrectText.length?"correct":(i===state.pvpCorrectText.length?"current":"pending");
    const ch=code[i];
    html+=`<span class="${cls}">${ch==="\n"?"\n":ch===" "?" ":esc(ch)}</span>`;
  }
  $("pvpTypingDisplay").innerHTML=html;
  $("pvpTypingDisplay").querySelector(".current")?.scrollIntoView({block:"nearest"});
  const pct=pvpProgressPct();
  $("myPvpBar").style.width=`${pct}%`;
  $("myPvpPct").textContent=`${Math.floor(pct)}%`;
  $("pvpProgress").textContent=`${Math.floor(pct)}%`;
}
function updatePvpStats(){
  $("pvpTime").textContent=fmtTime(pvpElapsed());
  $("pvpWpm").textContent=Math.round(pvpWpm());
  $("pvpAccuracy").textContent=`${pvpAccuracy().toFixed(0)}%`;
  $("pvpMistakes").textContent=state.pvpMistakes;
  $("pvpProgress").textContent=`${Math.floor(pvpProgressPct())}%`;
}
function pvpWrong(expected){
  const stage=$("pvpTypingStage");
  stage.classList.remove("wrong-shake","wrong-flash");
  void stage.offsetWidth;
  stage.classList.add("wrong-shake","wrong-flash");
  $("pvpGameStatus").textContent=`ผิด · ${expected==="\n"?"Enter":expected===" "?"Space":expected}`;
  setTimeout(()=>{stage.classList.remove("wrong-shake","wrong-flash");if(!state.pvpFinished)$("pvpGameStatus").textContent="PLAYING";},260);
}
async function createPvpAttempt(){
  if(state.pvpAttemptId||!state.pvpLesson)return;
  try{
    const r=await addDoc(collection(db,"attempts"),{
      uid:state.uid,studentId:state.player.studentId,fullName:state.player.fullName,
      educationLevel:state.player.educationLevel,classroom:state.player.classroom,department:state.player.department,
      language:state.language?.name||state.pvpLesson.language,languageId:state.pvpLesson.language,
      modeName:"PVP",difficulty:difficultyName(state.pvpLesson.difficulty),difficultyId:state.pvpLesson.difficulty,
      stage:state.pvpLesson.stage,lessonId:state.pvpLesson.id,levelTitle:state.pvpLesson.title,
      roomCode:state.roomCode,status:"playing",score:0,rewardPoints:0,wpm:0,accuracy:0,mistakes:0,
      elapsedSeconds:0,createdAt:serverTimestamp()
    });
    state.pvpAttemptId=r.id;
  }catch(error){console.warn("createPvpAttempt:",error)}
}
async function pushPvpProgress(force=false){
  if(!state.roomCode||!state.roomData||state.pvpFinished)return;
  const now=Date.now();
  if(!force&&now-state.pvpProgressLastSent<160)return;
  state.pvpProgressLastSent=now;
  const pct=Math.round(pvpProgressPct()*10)/10;
  try{
    await updateDoc(doc(db,"pvp_rooms",state.roomCode),{
      [`players.${state.uid}.progress`]:pct,
      [`players.${state.uid}.wpm`]:Math.round(pvpWpm()*100)/100,
      [`players.${state.uid}.accuracy`]:Math.round(pvpAccuracy()*100)/100,
      [`players.${state.uid}.mistakes`]:state.pvpMistakes,
      [`players.${state.uid}.lastUpdateAt`]:serverTimestamp()
    });
  }catch(error){console.warn("PVP progress:",error)}
}
function schedulePvpProgress(){
  clearTimeout(state.pvpProgressTimer);
  state.pvpProgressTimer=setTimeout(()=>pushPvpProgress(false),80);
}
async function savePvpAttempt(result){
  if(state.pvpResultSaved)return;
  state.pvpResultSaved=true;
  if(!state.pvpAttemptId){await createPvpAttempt();}
  if(!state.pvpAttemptId)return;
  try{
    await updateDoc(doc(db,"attempts",state.pvpAttemptId),{
      status:"completed",pvpResult:result,score:result==="win"?100:0,rewardPoints:0,
      wpm:Math.round(pvpWpm()*100)/100,accuracy:Math.round(pvpAccuracy()*100)/100,
      mistakes:state.pvpMistakes,elapsedSeconds:Math.round(pvpElapsed()*100)/100,
      finishedAt:serverTimestamp()
    });
  }catch(error){console.warn("savePvpAttempt:",error)}
}
async function declarePvpFinish(){
  if(state.pvpFinished||!state.roomCode)return;
  state.pvpFinished=true;
  clearInterval(state.pvpTimer);
  clearTimeout(state.pvpProgressTimer);
  $("pvpGameStatus").textContent="FINISHING";
  const ref=doc(db,"pvp_rooms",state.roomCode);
  try{
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);
      if(!snap.exists())return;
      const data=snap.data();
      const players={...(data.players||{})};
      players[state.uid]={...(players[state.uid]||{}),progress:100,finished:true,
        wpm:Math.round(pvpWpm()*100)/100,accuracy:Math.round(pvpAccuracy()*100)/100,
        mistakes:state.pvpMistakes,elapsedSeconds:Math.round(pvpElapsed()*100)/100};
      const winner=data.winnerUid||state.uid;
      tx.update(ref,{players,winnerUid:winner,status:"finished",finishedAt:serverTimestamp()});
    });
  }catch(error){
    console.warn("declarePvpFinish:",error);
    state.pvpFinished=false;
    $("pvpGameStatus").textContent="ERROR";
  }
}
async function handlePvpFinishedRoom(room){
  if(state.pvpActiveRoom!==state.roomCode)return;
  const won=room.winnerUid===state.uid;
  if(!state.pvpFinished){
    state.pvpFinished=true;
    clearInterval(state.pvpTimer);
    clearTimeout(state.pvpProgressTimer);
  }
  $("pvpTypingInput").disabled=true;
  $("pvpGameStatus").textContent=won?"WIN 🏆":"LOSE";
  $("pvpSaveState").textContent=won?"คุณชนะการแข่งขัน · บันทึกผลแล้ว":"คู่แข่งชนะ · บันทึกผลแล้ว";
  await savePvpAttempt(won?"win":"loss");
}
async function enterPvpGame(room,code){
  if(state.pvpActiveRoom===code)return;
  const lesson=LESSONS.find(x=>x.id===room.lessonId);
  if(!lesson){
    setMatchmakingStatus("error","ไม่พบโจทย์ PVP","Room นี้ใช้โจทย์ที่ไม่มีในเวอร์ชันปัจจุบัน");
    return;
  }
  state.pvpActiveRoom=code;
  state.pvpLesson=lesson;
  state.pvpAttemptId=null;
  state.pvpFinished=false;
  state.pvpResultSaved=false;
  state.pvpCorrectText="";
  state.pvpMistakes=0;
  state.pvpKeys=0;
  state.pvpProgressLastSent=0;
  clearInterval(state.pvpTimer);
  clearTimeout(state.pvpProgressTimer);
  $("pvpTypingInput").disabled=false;
  $("pvpTypingInput").value="";

  const startMs=room.startedAt?.toMillis?.()||Date.now();
  state.pvpStartTime=startMs;
  const entries=Object.entries(room.players||{});
  const opponent=entries.find(([id])=>id!==state.uid)?.[1]||null;
  $("pvpChallengeTitle").textContent=`Stage ${lesson.stage} · ${lesson.title}`;
  $("pvpChallengeDescription").textContent=lesson.description||"พิมพ์ Code ให้ครบก่อนคู่แข่ง";
  $("pvpRoomGame").textContent=`Room ${code}`;
  $("pvpOpponentName").textContent=`คู่แข่ง: ${opponent?.name||opponent?.studentId||"-"}`;
  $("myPvpName").textContent=state.player.fullName||state.player.studentId;
  $("oppPvpName").textContent=opponent?.name||opponent?.studentId||"OPPONENT";
  $("myPvpBar").style.width="0%";$("oppPvpBar").style.width=`${Number(opponent?.progress||0)}%`;
  $("myPvpPct").textContent="0%";$("oppPvpPct").textContent=`${Math.floor(Number(opponent?.progress||0))}%`;
  $("pvpGameStatus").textContent="PLAYING";
  $("pvpSaveState").textContent="Realtime · Strict Typing";
  renderPvpStrictCode();updatePvpStats();
  showScreen("pvpGameScreen");
  await createPvpAttempt();
  state.pvpTimer=setInterval(updatePvpStats,100);
  setTimeout(()=>$("pvpTypingInput").focus({preventScroll:true}),100);
}
function updatePvpRoomProgress(room){
  if(state.pvpActiveRoom!==state.roomCode)return;
  const players=room.players||{};
  const mine=players[state.uid]||{};
  const oppEntry=Object.entries(players).find(([id])=>id!==state.uid);
  const opp=oppEntry?.[1]||{};
  const myPct=Math.max(Number(mine.progress||0),pvpProgressPct());
  const oppPct=Number(opp.progress||0);
  $("myPvpBar").style.width=`${Math.min(100,myPct)}%`;
  $("myPvpPct").textContent=`${Math.floor(myPct)}%`;
  $("oppPvpBar").style.width=`${Math.min(100,oppPct)}%`;
  $("oppPvpPct").textContent=`${Math.floor(oppPct)}%`;
}
$("pvpTypingStage").onclick=()=>$("pvpTypingInput").focus({preventScroll:true});
$("pvpTypingInput").addEventListener("keydown",async e=>{
  if(state.pvpFinished){e.preventDefault();return;}
  if(["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
    e.preventDefault();$("pvpGameStatus").textContent="STRICT · พิมพ์ตัวเดิมใหม่";return;
  }
  const raw=keyToInput(e);
  if(raw===null)return;
  e.preventDefault();
  const code=state.pvpLesson?.code||"";
  const pos=state.pvpCorrectText.length;
  const expected=code[pos];
  if(expected===undefined)return;
  state.pvpKeys++;
  if(raw==="\t"){
    if(expected===" "){
      let count=0;while(code[pos+count]===" "&&count<4)count++;
      state.pvpCorrectText+=code.slice(pos,pos+count);
      renderPvpStrictCode();updatePvpStats();schedulePvpProgress();
      if(state.pvpCorrectText===code)await declarePvpFinish();
    }else{state.pvpMistakes++;pvpWrong(expected);updatePvpStats();schedulePvpProgress();}
    return;
  }
  if(raw===expected){
    state.pvpCorrectText+=raw;renderPvpStrictCode();updatePvpStats();schedulePvpProgress();
    $("pvpGameStatus").textContent="PLAYING";
    if(state.pvpCorrectText===code)await declarePvpFinish();
  }else{
    state.pvpMistakes++;pvpWrong(expected);updatePvpStats();schedulePvpProgress();
  }
});
async function forfeitPvpIfPlaying(){
  if(!state.roomCode||state.roomData?.status!=="playing"||state.pvpFinished)return;
  const opponentUid=Object.keys(state.roomData.players||{}).find(id=>id!==state.uid);
  if(!opponentUid)return;
  state.pvpFinished=true;clearInterval(state.pvpTimer);clearTimeout(state.pvpProgressTimer);
  try{
    await updateDoc(doc(db,"pvp_rooms",state.roomCode),{
      winnerUid:opponentUid,status:"finished",finishedAt:serverTimestamp(),forfeitUid:state.uid
    });
    await savePvpAttempt("forfeit");
  }catch(error){console.warn("forfeit:",error)}
}


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
  if(user.email==="pisit_2000@thc-nr.local"){location.replace("./admin.html?v=4.3.0");return;}
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
