import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc,
  serverTimestamp, query, where, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { DEFAULT_MODES, DEFAULT_LEVELS } from "./default-data.js";

const firebaseApp=initializeApp(firebaseConfig);
const auth=getAuth(firebaseApp);
const db=getFirestore(firebaseApp);
const $=id=>document.getElementById(id);

const state={uid:null,player:null,modes:[],levels:[],mode:null,level:null,attemptId:null,started:false,finished:false,startTime:0,timer:null,mistakes:0,keystrokes:0,previousText:"",historyUnsub:null};

const studentEmail=id=>`${String(id).trim()}@student.thc-nr.local`;
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const fmtDate=v=>{try{return v?.toDate?.().toLocaleString("th-TH")||"-"}catch{return "-"}};
const fmtTime=s=>{s=Math.max(0,s);return `${Math.floor(s/60).toString().padStart(2,"0")}:${Math.floor(s%60).toString().padStart(2,"0")}`};

function showScreen(id){
  ["authScreen","userPortal","gameScreen","resultScreen"].forEach(x=>$(x)?.classList.toggle("hidden",x!==id));
  window.scrollTo({top:0,behavior:"smooth"});
}

$("loginTab").onclick=()=>{
  $("loginTab").classList.add("active");$("registerTab").classList.remove("active");
  $("loginPanel").classList.remove("hidden");$("registerPanel").classList.add("hidden");
};
$("registerTab").onclick=()=>{
  $("registerTab").classList.add("active");$("loginTab").classList.remove("active");
  $("registerPanel").classList.remove("hidden");$("loginPanel").classList.add("hidden");
};
document.querySelectorAll("[data-toggle-password]").forEach(btn=>btn.onclick=()=>{
  const input=$(btn.dataset.togglePassword);input.type=input.type==="password"?"text":"password";btn.textContent=input.type==="password"?"แสดง":"ซ่อน";
});

async function loadGameData(){
  try{const s=await getDocs(collection(db,"game_modes"));state.modes=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0))}catch{}
  try{const s=await getDocs(collection(db,"levels"));state.levels=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>Number(a.levelNo)-Number(b.levelNo))}catch{}
  if(!state.modes.length)state.modes=DEFAULT_MODES;
  if(!state.levels.length)state.levels=DEFAULT_LEVELS.map(x=>({id:`level_${String(x.levelNo).padStart(2,"0")}`,...x}));
}

function registerValid(){
  return /^\d+$/.test($("studentId").value.trim()) &&
    $("fullName").value.trim() && $("educationLevel").value && $("classroom").value &&
    $("department").value.trim() && $("password").value.length>=6 &&
    $("password").value===$("confirmPassword").value && $("acceptRules").checked;
}
function updateRegister(){
  $("registerButton").disabled=!registerValid();
  $("registerMessage").textContent=registerValid()
    ?"พร้อมลงทะเบียน ระบบจะส่งข้อมูลเข้า Admin ทันที"
    :"เมื่อลงทะเบียนสำเร็จ ชื่อจะปรากฏในหน้า Admin แบบเรียลไทม์";
}
["studentId","fullName","educationLevel","classroom","department","password","confirmPassword","acceptRules"].forEach(id=>$(id).addEventListener("input",updateRegister));

$("registerForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!registerValid())return;
  const studentId=$("studentId").value.trim();
  $("registerButton").disabled=true;$("registerMessage").textContent="กำลังสร้างบัญชี...";
  try{
    const cred=await createUserWithEmailAndPassword(auth,studentEmail(studentId),$("password").value);
    state.uid=cred.user.uid;
    const profile={
      uid:state.uid,studentId,fullName:$("fullName").value.trim(),
      educationLevel:$("educationLevel").value,classroom:$("classroom").value,
      department:$("department").value.trim(),role:"student",status:"active",
      createdAt:serverTimestamp(),updatedAt:serverTimestamp()
    };
    await setDoc(doc(db,"users",state.uid),profile);
    state.player={...profile,createdAt:null,updatedAt:null};
    await enterPortal();
  }catch(err){
    let msg=err.message;
    if(err.code==="auth/email-already-in-use")msg="เลขประจำตัวนักศึกษานี้ถูกลงทะเบียนแล้ว";
    $("registerMessage").textContent="ลงทะเบียนไม่สำเร็จ: "+msg;
  }finally{updateRegister()}
});

$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();$("loginMessage").textContent="กำลังเข้าสู่ระบบ...";
  try{
    const studentId=$("loginStudentId").value.trim();
    const cred=await signInWithEmailAndPassword(auth,studentEmail(studentId),$("loginPassword").value);
    state.uid=cred.user.uid;
    const snap=await getDoc(doc(db,"users",state.uid));
    if(!snap.exists())throw new Error("ไม่พบข้อมูลผู้ใช้ในฐานข้อมูล");
    state.player={uid:state.uid,...snap.data()};
    await enterPortal();
  }catch(err){
    $("loginMessage").textContent="เข้าสู่ระบบไม่สำเร็จ: เลขนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
  }
});

async function enterPortal(){
  if(!state.player)return;
  await loadGameData();
  showScreen("userPortal");
  $("portalWelcome").textContent=`${state.player.fullName} · ${state.player.studentId} · ${state.player.educationLevel}${state.player.classroom} · ${state.player.department}`;
  renderModes();renderLevels();listenUserHistory();
}
$("logoutUserButton").onclick=async()=>{if(state.historyUnsub)state.historyUnsub();await signOut(auth);state.player=null;state.uid=null;showScreen("authScreen")};

function renderModes(){
  $("modeCards").innerHTML=state.modes.map(m=>`<button class="mode-choice ${state.mode?.id===m.id?"selected":""}" data-mode="${esc(m.id)}"><span class="mode-choice-icon">${m.icon||"⌨️"}</span><strong>${esc(m.name)}</strong><small>${esc(m.description||"")}</small><div><span>Score ×${Number(m.scoreMultiplier||1).toFixed(2)}</span><span>Time ×${Number(m.timeMultiplier||1).toFixed(2)}</span></div></button>`).join("");
  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{state.mode=state.modes.find(x=>x.id===b.dataset.mode);renderModes();renderLevels()});
}
function renderLevels(){
  if(!state.mode){$("levelCards").innerHTML=`<p class="empty-card">เลือกโหมดเกมด้านบนก่อน</p>`;return}
  $("selectedModeTitle").textContent=`${state.mode.icon||""} ${state.mode.name} · เลือก Level`;
  $("selectedModeDescription").textContent=state.mode.description||"";
  $("levelCards").innerHTML=state.levels.map(l=>`<button class="level-choice" data-level="${l.levelNo}"><span>LV ${String(l.levelNo).padStart(2,"0")}</span><strong>${esc(l.title)}</strong><small>${esc(l.language)} · ${esc(l.difficulty)}</small><div><b>${Number(l.basePoints||0).toLocaleString()}</b> คะแนนฐาน</div></button>`).join("");
  document.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>{state.level=state.levels.find(x=>Number(x.levelNo)===Number(b.dataset.level));prepareGame();showScreen("gameScreen");setTimeout(()=>$("typingInput").focus(),200)});
}

function listenUserHistory(){
  if(state.historyUnsub)state.historyUnsub();
  const q=query(collection(db,"attempts"),where("uid","==",state.uid));
  state.historyUnsub=onSnapshot(q,snap=>{
    const rows=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.toDate?.()?.getTime?.()||0)-(a.createdAt?.toDate?.()?.getTime?.()||0));
    const completed=rows.filter(x=>x.status==="completed");
    $("userTotalAttempts").textContent=rows.length;$("userCompleted").textContent=completed.length;
    $("userBestScore").textContent=Math.max(0,...completed.map(x=>Number(x.score||0))).toLocaleString();
    $("userBestWpm").textContent=Math.max(0,...completed.map(x=>Number(x.wpm||0))).toFixed(0);
    $("userHistoryBody").innerHTML=rows.slice(0,10).map(x=>`<tr><td>${fmtDate(x.createdAt)}</td><td>${esc(x.modeName)}</td><td>LV ${esc(x.levelNo)}</td><td><span class="status status-${esc(x.status)}">${esc(x.status)}</span></td><td><strong>${Number(x.score||0).toLocaleString()}</strong></td><td>${Number(x.wpm||0).toFixed(1)}</td><td>${Number(x.accuracy||0).toFixed(1)}%</td></tr>`).join("")||`<tr><td colspan="7" class="empty">ยังไม่มีประวัติการเล่น</td></tr>`;
  });
}

const allowed=()=>Number(state.level.timeLimit||90)*Number(state.mode.timeMultiplier||1);
const elapsed=()=>state.started?(performance.now()-state.startTime)/1000:0;
const accuracy=()=>state.keystrokes?Math.max(0,((state.keystrokes-state.mistakes)/state.keystrokes)*100):100;
const wpm=()=>state.previousText.length?((state.previousText.length/5)/Math.max(elapsed()/60,1/600)):0;
function liveScore(){if(!state.started)return 0;const base=Number(state.level.basePoints||100)*Number(state.level.difficultyMultiplier||1)*Number(state.mode.scoreMultiplier||1);return Math.max(0,Math.round(base*(accuracy()/100)+Math.min(base*.30,wpm()*2)-state.mistakes*Number(state.mode.mistakePenalty||2)*Number(state.level.levelNo)))}

function prepareGame(){
  state.attemptId=null;state.started=false;state.finished=false;state.mistakes=0;state.keystrokes=0;state.previousText="";clearInterval(state.timer);
  $("typingInput").value="";$("modeBadge").textContent=`${state.mode.icon||""} ${state.mode.name}`;$("challengeTitle").textContent=`Level ${state.level.levelNo} — ${state.level.title}`;$("challengeDescription").textContent=state.level.description||"";
  $("playerName").textContent=state.player.fullName;$("playerMeta").textContent=`${state.player.studentId} · ${state.player.educationLevel}${state.player.classroom} · ${state.player.department}`;
  $("statLevel").textContent=String(state.level.levelNo).padStart(2,"0");$("languageLabel").textContent=state.level.language;$("difficultyLabel").textContent=state.level.difficulty;
  $("timeRuleLabel").textContent=state.mode.enforceTimeLimit?`จำกัด ${Math.round(allowed())} วินาที`:"จับเวลาแบบไม่ตัดรอบ";$("fileName").textContent=`challenge_${String(state.level.levelNo).padStart(2,"0")}`;$("typingStatus").textContent="คลิกที่ Code แล้วเริ่มพิมพ์";$("saveState").textContent="ยังไม่บันทึกผล";$("statTime").textContent=state.mode.enforceTimeLimit?fmtTime(allowed()):"00:00";["statWpm","statMistakes","statScore"].forEach(id=>$(id).textContent="0");$("statAccuracy").textContent="100%";renderCode();
}
async function startAttempt(){
  if(state.started)return;state.started=true;state.startTime=performance.now();$("typingStatus").textContent="กำลังเล่น...";
  try{const r=await addDoc(collection(db,"attempts"),{uid:state.uid,studentId:state.player.studentId,fullName:state.player.fullName,educationLevel:state.player.educationLevel,classroom:state.player.classroom,department:state.player.department,modeId:state.mode.id,modeName:state.mode.name,levelNo:state.level.levelNo,levelTitle:state.level.title,language:state.level.language,status:"playing",score:0,wpm:0,accuracy:0,mistakes:0,elapsedSeconds:0,createdAt:serverTimestamp()});state.attemptId=r.id;$("saveState").textContent="เชื่อม Firebase แล้ว"}catch(err){console.error(err);$("saveState").textContent="Firebase Error"}
  state.timer=setInterval(updateStats,100);
}
function renderCode(){
  const typed=$("typingInput").value,code=state.level?.code||"";let html="";
  for(let i=0;i<code.length;i++){let cls="pending";if(i<typed.length)cls=typed[i]===code[i]?"correct":"wrong";else if(i===typed.length)cls="current";const ch=code[i];html+=`<span class="${cls}">${ch==="\n"?"\n":ch===" "?" ":esc(ch)}</span>`}
  $("typingDisplay").innerHTML=html;$("progressBar").style.width=`${code.length?Math.min(100,typed.length/code.length*100):0}%`;$("progressText").textContent=`${typed.length} / ${code.length}`;$("typingDisplay").querySelector(".current")?.scrollIntoView({block:"nearest"});
}
function updateStats(){const e=elapsed();$("statTime").textContent=state.mode.enforceTimeLimit?fmtTime(allowed()-e):fmtTime(e);$("statWpm").textContent=Math.round(wpm());$("statAccuracy").textContent=`${accuracy().toFixed(0)}%`;$("statMistakes").textContent=state.mistakes;$("statScore").textContent=liveScore();if(state.mode.enforceTimeLimit&&e>=allowed()&&!state.finished)finishAttempt("timeout")}
$("typingStage").onclick=()=> $("typingInput").focus();
$("typingInput").addEventListener("keydown",async e=>{if(state.finished){e.preventDefault();return}if(!state.mode.allowBackspace&&["Backspace","Delete"].includes(e.key)){e.preventDefault();return}if(e.key==="Tab"){e.preventDefault();if(!state.started)await startAttempt();const input=$("typingInput"),start=input.selectionStart;input.value=input.value.slice(0,start)+"    "+input.value.slice(input.selectionEnd);input.selectionStart=input.selectionEnd=start+4;for(let i=0;i<4;i++){state.keystrokes++;if((state.level.code[start+i]||"")!==" ")state.mistakes++}state.previousText=input.value;renderCode();updateStats();if(input.value===state.level.code)finishAttempt("completed")}});
$("typingInput").addEventListener("input",async()=>{if(state.finished)return;const input=$("typingInput");if(!state.started&&input.value.length)await startAttempt();if(input.value.length>state.previousText.length){const n=input.value.length-state.previousText.length,start=input.value.length-n;for(let i=0;i<n;i++){const p=start+i;state.keystrokes++;if(input.value[p]!==state.level.code[p])state.mistakes++}}state.previousText=input.value;renderCode();updateStats();if(input.value===state.level.code)finishAttempt("completed")});
function finalScore(e,wp,acc){const base=Number(state.level.basePoints||100)*Number(state.level.difficultyMultiplier||1)*Number(state.mode.scoreMultiplier||1),rr=Math.max(0,Math.min(1,(allowed()-e)/Math.max(allowed(),1)));return Math.max(0,Math.round(base+base*.5*rr+Math.min(base*.35,wp*2*Number(state.mode.scoreMultiplier||1))+base*.25*(acc/100)-state.mistakes*Number(state.mode.mistakePenalty||2)*Number(state.level.levelNo)))}
async function finishAttempt(status){
  if(state.finished)return;state.finished=true;clearInterval(state.timer);$("typingInput").blur();
  const e=elapsed(),wp=Math.round(((state.level.code.length/5)/Math.max(e/60,1/60))*100)/100,acc=Math.round(accuracy()*100)/100,score=status==="completed"?finalScore(e,wp,acc):0;
  if(state.attemptId)try{await updateDoc(doc(db,"attempts",state.attemptId),{status,score,wpm:wp,accuracy:acc,mistakes:state.mistakes,keystrokes:state.keystrokes,elapsedSeconds:Math.round(e*100)/100,finishedAt:serverTimestamp()})}catch{}
  $("resultTitle").textContent=status==="completed"?"พิมพ์ Code สำเร็จแล้ว":"หมดเวลา";$("resultText").textContent=`${state.mode.name} · Level ${state.level.levelNo} · ${state.level.title}`;$("resultScore").textContent=score.toLocaleString();$("resultWpm").textContent=wp;$("resultAccuracy").textContent=`${acc}%`;$("resultTime").textContent=`${e.toFixed(2)}s`;$("nextLevelButton").style.display=state.levels.some(x=>Number(x.levelNo)===Number(state.level.levelNo)+1)?"":"none";showScreen("resultScreen");
}
$("quitButton").onclick=async()=>{if(!confirm("ยืนยันยุติการเล่น?"))return;state.finished=true;clearInterval(state.timer);if(state.attemptId)try{await updateDoc(doc(db,"attempts",state.attemptId),{status:"abandoned",elapsedSeconds:Math.round(elapsed()*100)/100,mistakes:state.mistakes,finishedAt:serverTimestamp()})}catch{}showScreen("userPortal")};
$("backPortalButton").onclick=()=>{if(state.started&&!state.finished){$("quitButton").click()}else showScreen("userPortal")};
$("playAgainButton").onclick=()=>{prepareGame();showScreen("gameScreen");setTimeout(()=>$("typingInput").focus(),200)};
$("nextLevelButton").onclick=()=>{const n=state.levels.find(x=>Number(x.levelNo)===Number(state.level.levelNo)+1);if(n){state.level=n;prepareGame();showScreen("gameScreen")}};
$("portalButton").onclick=()=>showScreen("userPortal");

function buildKeyboard(){
  const rows=[["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],["CapsLock","A","S","D","F","G","H","J","K","L",";","'","Enter"],["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"],["Space"]],map=new Map();
  rows.forEach(row=>{const r=document.createElement("div");r.className="keyboard-row";row.forEach(k=>{const e=document.createElement("div");e.className="key";if(["Backspace","Tab","CapsLock","Enter","Shift"].includes(k))e.classList.add("wide");if(k==="Space")e.classList.add("space");e.textContent=k==="Space"?"":k;r.appendChild(e);const n=k.toLowerCase();if(!map.has(n))map.set(n,[]);map.get(n).push(e)});$("keyboard").appendChild(r)});
  const mk=k=>k===" "?"space":k.toLowerCase();window.addEventListener("keydown",e=>(map.get(mk(e.key))||[]).forEach(x=>x.classList.add("active")));window.addEventListener("keyup",e=>(map.get(mk(e.key))||[]).forEach(x=>x.classList.remove("active")));
}

onAuthStateChanged(auth,async user=>{
  if(!user){state.uid=null;state.player=null;showScreen("authScreen");return}
  // Admin account should not enter student portal
  if(user.email==="pisit_2000@thc-nr.local") return;
  state.uid=user.uid;
  const snap=await getDoc(doc(db,"users",user.uid));
  if(snap.exists()){state.player={uid:user.uid,...snap.data()};await enterPortal()}
});

buildKeyboard();updateRegister();
