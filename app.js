import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc,
  serverTimestamp, query, where, onSnapshot, runTransaction
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { LANGUAGES, LESSONS, DIFFICULTIES } from "./lessons.js";
import { REWARD_ITEMS } from "./reward-data.js";
import { DEFAULT_CHARACTER, DEFAULT_ZONE_STATE } from "./character-system.js";

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
  pvpStartTime:0, pvpTimer:null, pvpMistakes:0, pvpKeys:0, pvpCorrectText:""
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
  if(typeof d.pointsBalance !== "number") patch.pointsBalance = 0;
  if(typeof d.pointsLifetime !== "number") patch.pointsLifetime = 0;
  if(!Array.isArray(d.inventory)) patch.inventory = [];
  if(!d.progress) patch.progress = {html:{maxUnlockedStage:1},python:{maxUnlockedStage:1}};
  else {
    patch.progress = {
      html:{maxUnlockedStage:Number(d.progress?.html?.maxUnlockedStage || 1)},
      python:{maxUnlockedStage:Number(d.progress?.python?.maxUnlockedStage || 1)}
    };
  }
  if(!d.character) patch.character = {...DEFAULT_CHARACTER,displayName:d.fullName||""};
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
      pointsBalance:0,pointsLifetime:0,inventory:[],
      progress:{html:{maxUnlockedStage:1},python:{maxUnlockedStage:1}},
      character:{...DEFAULT_CHARACTER,displayName:$("fullName").value.trim()},
      zone:{...DEFAULT_ZONE_STATE},
      createdAt:serverTimestamp(),updatedAt:serverTimestamp()
    };
    await setDoc(doc(db,"users",state.uid),p);
    await ensureProfileDefaults();
    enterPortal();
  }catch(err){
    $("registerMessage").textContent = err.code==="auth/email-already-in-use" ? "เลขนักศึกษานี้ลงทะเบียนแล้ว" : "ลงทะเบียนไม่สำเร็จ: "+err.message;
  }
});

$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{
    const cred=await signInWithEmailAndPassword(auth,studentEmail($("loginStudentId").value.trim()),$("loginPassword").value);
    state.uid=cred.user.uid;
    await ensureProfileDefaults();
    if(!state.player) throw new Error("ไม่พบข้อมูลผู้ใช้");
    enterPortal();
  }catch{
    $("loginMessage").textContent="เลขนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
  }
});

async function enterPortal(){
  await ensureProfileDefaults();
  showScreen("userPortal");
  $("portalWelcome").textContent=`${state.player.fullName} · ${state.player.studentId} · ${state.player.educationLevel}${state.player.classroom}`;
  $("userPoints").textContent=Number(state.player.pointsBalance||0).toLocaleString();
  renderLanguages();
  renderRewardShop();
  listenHistory();
}

$("logoutUserButton").onclick=async()=>{
  if(state.historyUnsub) state.historyUnsub();
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
  $("pvpConfig").classList.toggle("hidden",state.gameMode!=="pvp");
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
  setTimeout(()=>$("typingInput").focus(),150);
};

async function requestRealFullscreen(){
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
  }catch{}
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
  $("saveState").textContent=`รางวัล ${state.lesson.rewardPoints} แต้ม`;
  $("statTime").textContent="00:00";
  ["statWpm","statMistakes","statScore"].forEach(id=>$(id).textContent="0");
  $("statAccuracy").textContent="100%";
  renderStrictCode();
}

async function startClassic(){
  if(state.started)return;
  state.started=true;state.startTime=performance.now();$("typingStatus").textContent="กำลังเล่น...";
  const r=await addDoc(collection(db,"attempts"),{
    uid:state.uid,studentId:state.player.studentId,fullName:state.player.fullName,
    educationLevel:state.player.educationLevel,classroom:state.player.classroom,department:state.player.department,
    language:state.language.name,languageId:state.language.id,modeName:"Classic",
    difficulty:state.difficulty.name,difficultyId:state.difficulty.id,stage:state.lesson.stage,
    lessonId:state.lesson.id,levelTitle:state.lesson.title,status:"playing",
    score:0,rewardPoints:state.lesson.rewardPoints,wpm:0,accuracy:0,mistakes:0,elapsedSeconds:0,createdAt:serverTimestamp()
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

$("typingStage").onclick=()=> $("typingInput").focus();

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
  $("statScore").textContent=liveScore();
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
      pointsBalance:Number(d.pointsBalance||0)+reward,
      pointsLifetime:Number(d.pointsLifetime||0)+reward,
      progress,
      updatedAt:serverTimestamp()
    });
  });
  await ensureProfileDefaults();
}

async function finishClassic(){
  if(state.finished)return;
  state.finished=true;clearInterval(state.timer);
  const e=elapsed();
  const wp=Math.round(((state.correctText.length/5)/Math.max(e/60,1/60))*100)/100;
  const acc=Math.round(accuracy()*100)/100;
  const score=liveScore();
  if(state.attemptId)await updateDoc(doc(db,"attempts",state.attemptId),{
    status:"completed",score,rewardPoints:state.lesson.rewardPoints,wpm:wp,accuracy:acc,
    mistakes:state.mistakes,elapsedSeconds:Math.round(e*100)/100,finishedAt:serverTimestamp()
  });
  await awardCompletion();
  $("resultTitle").textContent=`ผ่าน Stage ${state.lesson.stage} +${state.lesson.rewardPoints} แต้ม`;
  $("resultText").textContent=`${state.language.name} · ${state.difficulty.name} · ${state.lesson.title}`;
  $("resultScore").textContent=score.toLocaleString();
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
  prepareClassic();showScreen("gameScreen");await requestRealFullscreen();setTimeout(()=>$("typingInput").focus(),100);
};
$("portalButton").onclick=async()=>{await ensureProfileDefaults();await enterPortal()};

function renderRewardShop(){
  const balance=Number(state.player?.pointsBalance||0);
  const owned=new Set(state.player?.inventory||[]);
  $("rewardShop").innerHTML=REWARD_ITEMS.map(item=>`
    <article class="reward-card ${owned.has(item.id)?"owned":""}">
      <div class="reward-icon">${item.icon}</div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.description)}</p>
      <div class="reward-cost">${item.cost.toLocaleString()} pts</div>
      <button class="btn ${owned.has(item.id)?"ghost":"secondary"}" data-redeem="${item.id}" ${owned.has(item.id)||balance<item.cost?"disabled":""}>
        ${owned.has(item.id)?"มีแล้ว":balance<item.cost?"แต้มไม่พอ":"แลกของ"}
      </button>
    </article>`).join("");
  document.querySelectorAll("[data-redeem]:not([disabled])").forEach(b=>b.onclick=()=>redeemReward(b.dataset.redeem));
}

async function redeemReward(id){
  const item=REWARD_ITEMS.find(x=>x.id===id);
  if(!item)return;
  const ref=doc(db,"users",state.uid);
  try{
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);
      const d=snap.data();
      const balance=Number(d.pointsBalance||0);
      const inv=Array.isArray(d.inventory)?d.inventory:[];
      if(inv.includes(id))throw new Error("มีไอเทมแล้ว");
      if(balance<item.cost)throw new Error("แต้มไม่พอ");
      tx.update(ref,{pointsBalance:balance-item.cost,inventory:[...inv,id],updatedAt:serverTimestamp()});
    });
    await ensureProfileDefaults();
    $("userPoints").textContent=Number(state.player.pointsBalance||0).toLocaleString();
    renderRewardShop();
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

/* PVP V1: โครงเดิมยังคงอยู่ เตรียมต่อยอด Strict Engine และ 2D Zone รอบถัดไป */
function renderPvpConfig(){
  if(!state.language){alert("เลือกภาษาก่อน");return;}
  if(!state.difficulty)state.difficulty=DIFFICULTIES[0];
  if(!state.lesson)state.lesson=languageLessons().find(x=>x.stage<=maxUnlocked(state.language.id))||languageLessons()[0];
}
const roomCode=()=>Math.random().toString(36).slice(2,8).toUpperCase();
$("createRoomButton").onclick=async()=>{
  renderPvpConfig();const code=roomCode();state.roomCode=code;
  await setDoc(doc(db,"pvp_rooms",code),{
    code,hostUid:state.uid,languageId:state.language.id,lessonId:state.lesson.id,
    difficultyId:state.lesson.difficulty,status:"waiting",createdAt:serverTimestamp(),
    players:{[state.uid]:{name:state.player.fullName,progress:0,finished:false}}
  });
  listenRoom(code);
};
$("joinRoomButton").onclick=async()=>{
  const code=$("roomCodeInput").value.trim().toUpperCase();if(!code)return;
  const ref=doc(db,"pvp_rooms",code),snap=await getDoc(ref);if(!snap.exists()){alert("ไม่พบห้อง");return;}
  const d=snap.data(),players={...(d.players||{})};
  if(Object.keys(players).length>=2&&!players[state.uid]){alert("ห้องเต็ม");return;}
  players[state.uid]={name:state.player.fullName,progress:0,finished:false};
  await updateDoc(ref,{players});state.roomCode=code;listenRoom(code);
};
function listenRoom(code){
  if(state.roomUnsub)state.roomUnsub();
  $("pvpLobby").classList.remove("hidden");
  state.roomUnsub=onSnapshot(doc(db,"pvp_rooms",code),snap=>{
    if(!snap.exists())return;
    state.roomData=snap.data();const ps=Object.entries(state.roomData.players||{});
    $("roomCodeLabel").textContent=code;$("pvpPlayer1").textContent=ps[0]?.[1]?.name||"รอผู้เล่น...";
    $("pvpPlayer2").textContent=ps[1]?.[1]?.name||"รอผู้เล่น...";$("pvpStatus").textContent=state.roomData.status;
    $("startPvpButton").classList.toggle("hidden",!(state.roomData.hostUid===state.uid&&ps.length===2&&state.roomData.status==="waiting"));
  });
}
$("startPvpButton").onclick=async()=>{if(state.roomCode)await updateDoc(doc(db,"pvp_rooms",state.roomCode),{status:"playing",startedAt:serverTimestamp()})};
$("leavePvpButton").onclick=()=>{if(state.roomUnsub)state.roomUnsub();showScreen("userPortal")};

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

onAuthStateChanged(auth,async user=>{
  if(!user){state.uid=null;state.player=null;showScreen("authScreen");return;}
  if(user.email==="pisit_2000@thc-nr.local")return;
  state.uid=user.uid;await ensureProfileDefaults();if(state.player)enterPortal();
});

buildKeyboard();
updateRegister();
