import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, getDoc, setDoc,
  addDoc, updateDoc, serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";
import { DEFAULT_MODES, DEFAULT_LEVELS } from "./default-data.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const $ = (id) => document.getElementById(id);

const state = {
  uid: null,
  modes: [],
  levels: [],
  mode: null,
  level: null,
  player: null,
  attemptId: null,
  started: false,
  finished: false,
  startTime: 0,
  timer: null,
  mistakes: 0,
  keystrokes: 0,
  previousText: ""
};

const screens = ["introScreen","registerScreen","gameScreen","resultScreen","terminatedScreen"];

function showScreen(id) {
  screens.forEach(x => $(x).classList.toggle("hidden", x !== id && !(id === "introScreen" && x === "registerScreen")));
  if (id === "introScreen") {
    $("introScreen").classList.remove("hidden");
    $("registerScreen").classList.remove("hidden");
    $("gameScreen").classList.add("hidden");
    $("resultScreen").classList.add("hidden");
    $("terminatedScreen").classList.add("hidden");
    window.scrollTo({top: 0, behavior: "smooth"});
  } else {
    $("introScreen").classList.add("hidden");
    $("registerScreen").classList.add("hidden");
    $(id).classList.remove("hidden");
    window.scrollTo({top: 0, behavior: "smooth"});
  }
}

function formatTime(seconds) {
  seconds = Math.max(0, seconds);
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

async function ensureAnonymousUser() {
  if (auth.currentUser) {
    state.uid = auth.currentUser.uid;
    return;
  }
  const result = await signInAnonymously(auth);
  state.uid = result.user.uid;
}

async function loadData() {
  try {
    const modeSnap = await getDocs(query(collection(db, "game_modes"), orderBy("sortOrder")));
    state.modes = modeSnap.docs.map(d => ({id: d.id, ...d.data()}));
  } catch (_) {}

  try {
    const levelSnap = await getDocs(query(collection(db, "levels"), orderBy("levelNo")));
    state.levels = levelSnap.docs.map(d => ({id: d.id, ...d.data()}));
  } catch (_) {}

  // ถ้ายังไม่ได้ Seed Firestore หน้าเว็บยัง Preview ได้จากข้อมูล Default
  if (!state.modes.length) state.modes = DEFAULT_MODES;
  if (!state.levels.length) state.levels = DEFAULT_LEVELS.map(x => ({id: `level_${String(x.levelNo).padStart(2,"0")}`, ...x}));

  $("modeSelect").innerHTML = state.modes.map(m =>
    `<option value="${m.id}">${m.icon || ""} ${m.name}</option>`
  ).join("");

  $("levelSelect").innerHTML = state.levels.map(l =>
    `<option value="${l.levelNo}">Level ${l.levelNo} — ${l.title} (${l.difficulty})</option>`
  ).join("");
}

function registrationValid() {
  return ["fullName","studentId","classroom","department"].every(id => $(id).value.trim())
    && $("acceptRules").checked
    && $("modeSelect").value
    && $("levelSelect").value;
}

function updateRegisterButton() {
  const ok = registrationValid();
  $("startButton").disabled = !ok;
  $("registerHint").textContent = ok ? "พร้อมเริ่มเกม" : "กรอกข้อมูลให้ครบก่อนเริ่มเกม";
}

["fullName","studentId","classroom","department","modeSelect","levelSelect","acceptRules"]
  .forEach(id => $(id).addEventListener("input", updateRegisterButton));

$("registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!registrationValid()) return;

  $("startButton").disabled = true;
  $("startButton").textContent = "กำลังเตรียมเกม...";

  try {
    await ensureAnonymousUser();

    state.player = {
      uid: state.uid,
      fullName: $("fullName").value.trim(),
      studentId: $("studentId").value.trim(),
      classroom: $("classroom").value.trim(),
      department: $("department").value.trim()
    };

    state.mode = state.modes.find(x => x.id === $("modeSelect").value);
    state.level = state.levels.find(x => Number(x.levelNo) === Number($("levelSelect").value));

    await setDoc(doc(db, "players", state.uid), {
      ...state.player,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, {merge: true});

    prepareGame();
    showScreen("gameScreen");
    setTimeout(() => $("typingInput").focus(), 250);
  } catch (error) {
    alert("เริ่มเกมไม่สำเร็จ: " + error.message);
  } finally {
    $("startButton").textContent = "ลงทะเบียนและเริ่มเกม";
    updateRegisterButton();
  }
});

function prepareGame() {
  state.attemptId = null;
  state.started = false;
  state.finished = false;
  state.startTime = 0;
  state.mistakes = 0;
  state.keystrokes = 0;
  state.previousText = "";
  clearInterval(state.timer);

  $("typingInput").value = "";
  $("modeBadge").textContent = `${state.mode.icon || ""} ${state.mode.name}`;
  $("challengeTitle").textContent = `Level ${state.level.levelNo} — ${state.level.title}`;
  $("challengeDescription").textContent = state.level.description || "";
  $("playerName").textContent = state.player.fullName;
  $("playerMeta").textContent = `${state.player.studentId} · ${state.player.classroom} · ${state.player.department}`;
  $("statLevel").textContent = String(state.level.levelNo).padStart(2, "0");
  $("languageLabel").textContent = state.level.language;
  $("difficultyLabel").textContent = state.level.difficulty;
  $("timeRuleLabel").textContent = state.mode.enforceTimeLimit
    ? `จำกัด ${Math.round(state.level.timeLimit * state.mode.timeMultiplier)} วินาที`
    : "จับเวลาแบบไม่ตัดรอบ";
  $("fileName").textContent = `challenge_${String(state.level.levelNo).padStart(2, "0")}`;
  $("typingStatus").textContent = "คลิกที่ Code แล้วเริ่มพิมพ์";
  $("saveState").textContent = "ยังไม่บันทึกผล";
  $("statTime").textContent = state.mode.enforceTimeLimit
    ? formatTime(state.level.timeLimit * state.mode.timeMultiplier)
    : "00:00";
  $("statWpm").textContent = "0";
  $("statAccuracy").textContent = "100%";
  $("statMistakes").textContent = "0";
  $("statScore").textContent = "0";
  renderCode();
}

function elapsed() {
  return state.started ? (performance.now() - state.startTime) / 1000 : 0;
}

function allowedSeconds() {
  return Number(state.level.timeLimit) * Number(state.mode.timeMultiplier || 1);
}

function liveAccuracy() {
  return state.keystrokes
    ? Math.max(0, ((state.keystrokes - state.mistakes) / state.keystrokes) * 100)
    : 100;
}

function liveWpm() {
  const mins = Math.max(elapsed() / 60, 1 / 600);
  return (state.previousText.length / 5) / mins;
}

function liveScore() {
  if (!state.started) return 0;
  const base = Number(state.level.basePoints) *
    Number(state.level.difficultyMultiplier || 1) *
    Number(state.mode.scoreMultiplier || 1);
  const accuracy = liveAccuracy() / 100;
  const speedBonus = Math.min(base * .30, liveWpm() * 2);
  const penalty = state.mistakes * Number(state.mode.mistakePenalty || 2) * Number(state.level.levelNo);
  return Math.max(0, Math.round(base * accuracy + speedBonus - penalty));
}

function updateStats() {
  const e = elapsed();
  if (state.mode.enforceTimeLimit) {
    $("statTime").textContent = formatTime(allowedSeconds() - e);
  } else {
    $("statTime").textContent = formatTime(e);
  }
  $("statWpm").textContent = Math.round(liveWpm());
  $("statAccuracy").textContent = `${liveAccuracy().toFixed(0)}%`;
  $("statMistakes").textContent = state.mistakes;
  $("statScore").textContent = liveScore();

  if (state.mode.enforceTimeLimit && e >= allowedSeconds() && !state.finished) {
    finishAttempt("timeout");
  }
}

async function startAttempt() {
  if (state.started) return;
  state.started = true;
  state.startTime = performance.now();
  $("typingStatus").textContent = "กำลังเล่น...";
  $("typingStage").classList.add("active");

  try {
    const ref = await addDoc(collection(db, "attempts"), {
      uid: state.uid,
      studentId: state.player.studentId,
      fullName: state.player.fullName,
      classroom: state.player.classroom,
      department: state.player.department,
      modeId: state.mode.id,
      modeName: state.mode.name,
      levelNo: state.level.levelNo,
      levelTitle: state.level.title,
      language: state.level.language,
      status: "playing",
      score: 0,
      wpm: 0,
      accuracy: 0,
      mistakes: 0,
      elapsedSeconds: 0,
      createdAt: serverTimestamp()
    });
    state.attemptId = ref.id;
    $("saveState").textContent = "เชื่อม Firebase แล้ว";
  } catch (error) {
    $("saveState").textContent = "Firebase Error";
    console.error(error);
  }

  state.timer = setInterval(updateStats, 100);
}

function escapeChar(ch) {
  return ch.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function renderCode() {
  const typed = $("typingInput").value;
  const code = state.level?.code || "";
  let html = "";

  for (let i = 0; i < code.length; i++) {
    let cls = "pending";
    if (i < typed.length) cls = typed[i] === code[i] ? "correct" : "wrong";
    else if (i === typed.length) cls = "current";

    const ch = code[i];
    html += `<span class="${cls}">${ch === "\n" ? "\n" : ch === " " ? " " : escapeChar(ch)}</span>`;
  }

  $("typingDisplay").innerHTML = html;
  const pct = code.length ? Math.min(100, typed.length / code.length * 100) : 0;
  $("progressBar").style.width = `${pct}%`;
  $("progressText").textContent = `${typed.length} / ${code.length}`;

  const current = $("typingDisplay").querySelector(".current");
  current?.scrollIntoView({block: "nearest"});
}

$("typingStage").addEventListener("click", () => $("typingInput").focus());

$("typingInput").addEventListener("keydown", async (event) => {
  if (state.finished) {
    event.preventDefault();
    return;
  }

  if (!state.mode.allowBackspace && ["Backspace","Delete"].includes(event.key)) {
    event.preventDefault();
    $("typingStage").classList.add("shake");
    setTimeout(() => $("typingStage").classList.remove("shake"), 200);
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    if (!state.started) await startAttempt();

    const input = $("typingInput");
    const start = input.selectionStart;
    input.value = input.value.slice(0, start) + "    " + input.value.slice(input.selectionEnd);
    input.selectionStart = input.selectionEnd = start + 4;

    for (let i = 0; i < 4; i++) {
      state.keystrokes++;
      if ((state.level.code[start + i] || "") !== " ") state.mistakes++;
    }
    state.previousText = input.value;
    renderCode();
    updateStats();
    if (input.value === state.level.code) finishAttempt("completed");
  }
});

$("typingInput").addEventListener("input", async () => {
  if (state.finished) return;
  const input = $("typingInput");

  if (!state.started && input.value.length) await startAttempt();

  if (input.value.length > state.previousText.length) {
    const added = input.value.length - state.previousText.length;
    const start = input.value.length - added;
    for (let i = 0; i < added; i++) {
      const pos = start + i;
      state.keystrokes++;
      if (input.value[pos] !== state.level.code[pos]) state.mistakes++;
    }
  }

  state.previousText = input.value;
  renderCode();
  updateStats();

  if (input.value === state.level.code) finishAttempt("completed");
});

async function finishAttempt(status) {
  if (state.finished) return;
  state.finished = true;
  clearInterval(state.timer);
  $("typingInput").blur();

  const e = elapsed();
  const finalWpm = Math.round(((state.level.code.length / 5) / Math.max(e / 60, 1 / 60)) * 100) / 100;
  const accuracy = Math.round(liveAccuracy() * 100) / 100;
  const score = status === "completed" ? calculateFinalScore(e, finalWpm, accuracy) : 0;

  $("typingStatus").textContent = status === "completed" ? "ผ่านด่านแล้ว ✓" : "หมดเวลา";
  $("saveState").textContent = "กำลังบันทึกผล...";

  if (state.attemptId) {
    try {
      await updateDoc(doc(db, "attempts", state.attemptId), {
        status,
        score,
        wpm: finalWpm,
        accuracy,
        mistakes: state.mistakes,
        keystrokes: state.keystrokes,
        elapsedSeconds: Math.round(e * 100) / 100,
        finishedAt: serverTimestamp()
      });
      $("saveState").textContent = "บันทึก Firebase เรียบร้อย";
    } catch (error) {
      $("saveState").textContent = "บันทึก Firebase ไม่สำเร็จ";
      console.error(error);
    }
  }

  $("resultTitle").textContent = status === "completed" ? "พิมพ์ Code สำเร็จแล้ว" : "หมดเวลา";
  $("resultText").textContent = `${state.mode.name} · Level ${state.level.levelNo} · ${state.level.title}`;
  $("resultScore").textContent = score.toLocaleString();
  $("resultWpm").textContent = finalWpm;
  $("resultAccuracy").textContent = `${accuracy}%`;
  $("resultTime").textContent = `${e.toFixed(2)}s`;
  $("nextLevelButton").style.display = state.level.levelNo < Math.max(...state.levels.map(x => x.levelNo)) ? "" : "none";

  showScreen("resultScreen");
}

function calculateFinalScore(e, wpm, accuracy) {
  const base = Number(state.level.basePoints) *
    Number(state.level.difficultyMultiplier || 1) *
    Number(state.mode.scoreMultiplier || 1);
  const remainingRatio = Math.max(0, Math.min(1, (allowedSeconds() - e) / Math.max(allowedSeconds(), 1)));
  const timeBonus = base * .5 * remainingRatio;
  const speedBonus = Math.min(base * .35, wpm * 2 * Number(state.mode.scoreMultiplier || 1));
  const accuracyBonus = base * .25 * (accuracy / 100);
  const penalty = state.mistakes * Number(state.mode.mistakePenalty || 2) * Number(state.level.levelNo);
  return Math.max(0, Math.round(base + timeBonus + speedBonus + accuracyBonus - penalty));
}

$("quitButton").addEventListener("click", async () => {
  if (!confirm("ยืนยันยุติการเล่นรอบนี้?")) return;

  state.finished = true;
  clearInterval(state.timer);
  if (state.attemptId) {
    try {
      await updateDoc(doc(db, "attempts", state.attemptId), {
        status: "abandoned",
        elapsedSeconds: Math.round(elapsed() * 100) / 100,
        mistakes: state.mistakes,
        finishedAt: serverTimestamp()
      });
    } catch (_) {}
  }
  showScreen("terminatedScreen");
});

$("playAgainButton").addEventListener("click", () => {
  prepareGame();
  showScreen("gameScreen");
  setTimeout(() => $("typingInput").focus(), 200);
});

$("nextLevelButton").addEventListener("click", () => {
  const next = state.levels.find(x => Number(x.levelNo) === Number(state.level.levelNo) + 1);
  if (!next) return;
  state.level = next;
  $("levelSelect").value = next.levelNo;
  prepareGame();
  showScreen("gameScreen");
  setTimeout(() => $("typingInput").focus(), 200);
});

$("homeButton").addEventListener("click", () => showScreen("introScreen"));
$("terminatedHomeButton").addEventListener("click", () => showScreen("introScreen"));

function buildKeyboard() {
  const rows = [
    ["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
    ["CapsLock","A","S","D","F","G","H","J","K","L",";","'","Enter"],
    ["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"],
    ["Space"]
  ];

  const keyMap = new Map();

  rows.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "keyboard-row";
    row.forEach(key => {
      const el = document.createElement("div");
      el.className = "key";
      if (["Backspace","Tab","CapsLock","Enter","Shift"].includes(key)) el.classList.add("wide");
      if (key === "Space") el.classList.add("space");
      el.textContent = key === "Space" ? "" : key;
      rowEl.appendChild(el);

      const name = key.toLowerCase();
      if (!keyMap.has(name)) keyMap.set(name, []);
      keyMap.get(name).push(el);
    });
    $("keyboard").appendChild(rowEl);
  });

  const mapKey = (key) => key === " " ? "space" : key.toLowerCase();
  window.addEventListener("keydown", e => (keyMap.get(mapKey(e.key)) || []).forEach(el => el.classList.add("active")));
  window.addEventListener("keyup", e => (keyMap.get(mapKey(e.key)) || []).forEach(el => el.classList.remove("active")));
}

(async function init() {
  buildKeyboard();
  await loadData();
  updateRegisterButton();

  try {
    await ensureAnonymousUser();
  } catch (error) {
    console.error("Anonymous Auth:", error);
    $("registerHint").textContent = "กรุณาเปิด Anonymous Authentication ใน Firebase";
  }
})();
