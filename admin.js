import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, setDoc, deleteDoc,
  writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { firebaseConfig, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_UID } from "./firebase-config.js";
import { DEFAULT_MODES, DEFAULT_LEVELS } from "./default-data.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);

let cache = { users: [], attempts: [], levels: [], modes: [] };

function isAdmin(user) {
  return !!user && user.uid === ADMIN_UID;
}

$("adminLoginForm").addEventListener("submit", async e => {
  e.preventDefault();
  $("adminLoginError").textContent = "";
  try {
    if ($("adminUsername").value.trim() !== ADMIN_USERNAME) {
      throw new Error("Username ไม่ถูกต้อง");
    }

    const result = await signInWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      $("adminPassword").value
    );
    if (!isAdmin(result.user)) {
      await signOut(auth);
      throw new Error("บัญชีนี้ไม่ใช่ Admin");
    }
  } catch (error) {
    $("adminLoginError").textContent = "เข้าสู่ระบบไม่สำเร็จ: " + error.message;
  }
});

$("logoutAdmin").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async user => {
  const ok = isAdmin(user);
  $("adminLogin").classList.toggle("hidden", ok);
  $("adminDashboard").classList.toggle("hidden", !ok);
  if (ok) await refreshAll();
});

async function readCollection(name) {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function refreshAll() {
  [cache.users, cache.attempts, cache.levels, cache.modes] = await Promise.all([
    readCollection("players"),
    readCollection("attempts"),
    readCollection("levels"),
    readCollection("game_modes")
  ]);

  cache.levels.sort((a,b) => Number(a.levelNo) - Number(b.levelNo));
  cache.modes.sort((a,b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  cache.attempts.sort((a,b) => dateValue(b.createdAt) - dateValue(a.createdAt));
  cache.users.sort((a,b) => dateValue(b.createdAt) - dateValue(a.createdAt));

  renderMetrics();
  renderResults();
  renderUsers();
  renderLevels();
}

function dateValue(value) {
  try { return value?.toDate?.()?.getTime?.() || 0; } catch (_) { return 0; }
}

function formatDate(value) {
  try {
    return value?.toDate?.().toLocaleString("th-TH") || "-";
  } catch (_) { return "-"; }
}

function esc(v) {
  return String(v ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

function renderMetrics() {
  const completed = cache.attempts.filter(x => x.status === "completed");
  const avg = completed.length
    ? Math.round(completed.reduce((s,x) => s + Number(x.score || 0), 0) / completed.length)
    : 0;
  $("metricLevels").textContent = cache.levels.length;
  $("metricUsers").textContent = cache.users.length;
  $("metricCompleted").textContent = completed.length;
  $("metricAverage").textContent = avg.toLocaleString();
}

function renderResults() {
  $("resultsBody").innerHTML = cache.attempts.map(x => `
    <tr>
      <td>${formatDate(x.createdAt)}</td>
      <td>${esc(x.studentId)}</td>
      <td><strong>${esc(x.fullName)}</strong></td>
      <td>${esc(x.classroom)}</td>
      <td>${esc(x.department)}</td>
      <td>${esc(x.modeName)}</td>
      <td>${esc(x.levelNo)}</td>
      <td><span class="status status-${esc(x.status)}">${esc(x.status)}</span></td>
      <td><strong>${Number(x.score || 0).toLocaleString()}</strong></td>
      <td>${esc(x.wpm ?? 0)}</td>
      <td>${esc(x.accuracy ?? 0)}%</td>
      <td><button class="mini-delete" data-delete-attempt="${x.id}">ลบ</button></td>
    </tr>
  `).join("") || `<tr><td colspan="12" class="empty">ยังไม่มีผลการเล่น</td></tr>`;

  document.querySelectorAll("[data-delete-attempt]").forEach(btn => btn.onclick = async () => {
    if (!confirm("ลบผลรายการนี้?")) return;
    await deleteDoc(doc(db, "attempts", btn.dataset.deleteAttempt));
    await refreshAll();
  });
}

function renderUsers() {
  $("usersBody").innerHTML = cache.users.map(x => `
    <tr>
      <td>${formatDate(x.createdAt)}</td>
      <td>${esc(x.studentId)}</td>
      <td><strong>${esc(x.fullName)}</strong></td>
      <td>${esc(x.classroom)}</td>
      <td>${esc(x.department)}</td>
      <td><button class="mini-delete" data-delete-user="${x.id}">ลบ</button></td>
    </tr>
  `).join("") || `<tr><td colspan="6" class="empty">ยังไม่มีข้อมูลผู้ลงทะเบียน</td></tr>`;

  document.querySelectorAll("[data-delete-user]").forEach(btn => btn.onclick = async () => {
    if (!confirm("ลบผู้ลงทะเบียนรายการนี้?")) return;
    await deleteDoc(doc(db, "players", btn.dataset.deleteUser));
    await refreshAll();
  });
}

function renderLevels() {
  $("levelCards").innerHTML = cache.levels.map(x => `
    <article class="level-admin-card">
      <div>
        <span>LEVEL ${esc(x.levelNo)}</span>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.language)} · ${esc(x.difficulty)} · ${esc(x.basePoints)} pts</p>
      </div>
      <div class="button-row">
        <button class="btn ghost btn-small" data-edit-level="${x.id}">แก้ไข</button>
        <button class="btn danger btn-small" data-delete-level="${x.id}">ลบ</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-edit-level]").forEach(btn => btn.onclick = () => {
    const x = cache.levels.find(l => l.id === btn.dataset.editLevel);
    if (!x) return;
    $("editLevelNo").value = x.levelNo;
    $("editTitle").value = x.title;
    $("editLanguage").value = x.language;
    $("editDifficulty").value = x.difficulty;
    $("editBasePoints").value = x.basePoints;
    $("editTimeLimit").value = x.timeLimit;
    $("editMultiplier").value = x.difficultyMultiplier;
    $("editDescription").value = x.description || "";
    $("editCode").value = x.code;
    window.scrollTo({top: $("levelForm").offsetTop - 30, behavior: "smooth"});
  });

  document.querySelectorAll("[data-delete-level]").forEach(btn => btn.onclick = async () => {
    if (!confirm("ลบโจทย์นี้?")) return;
    await deleteDoc(doc(db, "levels", btn.dataset.deleteLevel));
    await refreshAll();
  });
}

$("levelForm").addEventListener("submit", async e => {
  e.preventDefault();
  const levelNo = Number($("editLevelNo").value);
  const id = `level_${String(levelNo).padStart(2,"0")}`;
  await setDoc(doc(db, "levels", id), {
    levelNo,
    title: $("editTitle").value.trim(),
    language: $("editLanguage").value.trim(),
    difficulty: $("editDifficulty").value,
    basePoints: Number($("editBasePoints").value),
    timeLimit: Number($("editTimeLimit").value),
    difficultyMultiplier: Number($("editMultiplier").value),
    description: $("editDescription").value.trim(),
    code: $("editCode").value,
    isActive: true,
    updatedAt: serverTimestamp()
  }, {merge: true});

  e.target.reset();
  $("editBasePoints").value = 100;
  $("editTimeLimit").value = 90;
  $("editMultiplier").value = 1;
  await refreshAll();
});

$("seedDefaults").addEventListener("click", async () => {
  if (!confirm("คืนค่าโหมดและ 12 Level เริ่มต้น? ข้อมูล Level หมายเลขเดียวกันจะถูกเขียนทับ")) return;
  const batch = writeBatch(db);

  DEFAULT_MODES.forEach(x => {
    const {id, ...data} = x;
    batch.set(doc(db, "game_modes", id), {...data, id, isActive: true}, {merge:true});
  });

  DEFAULT_LEVELS.forEach(x => {
    const id = `level_${String(x.levelNo).padStart(2,"0")}`;
    batch.set(doc(db, "levels", id), {...x, isActive:true}, {merge:true});
  });

  await batch.commit();
  alert("สร้างข้อมูลเริ่มต้นเรียบร้อย");
  await refreshAll();
});

async function deleteCollectionDocs(name) {
  const rows = await getDocs(collection(db, name));
  if (rows.empty) return;
  let batch = writeBatch(db);
  let count = 0;
  for (const item of rows.docs) {
    batch.delete(item.ref);
    count++;
    if (count >= 450) {
      await batch.commit();
      batch = writeBatch(db);
      count = 0;
    }
  }
  if (count) await batch.commit();
}

$("deleteResults").addEventListener("click", async () => {
  if (!confirm("ยืนยันลบผลการเล่นทั้งหมด?")) return;
  await deleteCollectionDocs("attempts");
  await refreshAll();
});

$("deleteUsers").addEventListener("click", async () => {
  if (!confirm("ยืนยันลบข้อมูลผู้ลงทะเบียนทั้งหมด?")) return;
  await deleteCollectionDocs("players");
  await refreshAll();
});

function downloadFile(name, text, type) {
  const blob = new Blob([text], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

$("exportCsv").addEventListener("click", () => {
  const header = ["date","student_id","name","class","department","mode","level","status","score","wpm","accuracy","mistakes","time_seconds"];
  const q = v => `"${String(v ?? "").replaceAll('"','""')}"`;
  const rows = cache.attempts.map(x => [
    formatDate(x.createdAt), x.studentId, x.fullName, x.classroom, x.department,
    x.modeName, x.levelNo, x.status, x.score, x.wpm, x.accuracy, x.mistakes, x.elapsedSeconds
  ].map(q).join(","));
  downloadFile("code_typing_results.csv", "\ufeff" + header.join(",") + "\n" + rows.join("\n"), "text/csv;charset=utf-8");
});

$("exportJson").addEventListener("click", () => {
  const clean = arr => arr.map(({createdAt,finishedAt,updatedAt,...x}) => ({
    ...x,
    createdAt: createdAt?.toDate?.()?.toISOString?.() || null,
    finishedAt: finishedAt?.toDate?.()?.toISOString?.() || null,
    updatedAt: updatedAt?.toDate?.()?.toISOString?.() || null
  }));
  downloadFile("code_typing_backup.json", JSON.stringify({
    exportedAt: new Date().toISOString(),
    game_modes: clean(cache.modes),
    levels: clean(cache.levels),
    players: clean(cache.users),
    attempts: clean(cache.attempts)
  }, null, 2), "application/json");
});

$("importJson").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  if (!confirm("นำเข้าข้อมูล JSON เข้าฐานข้อมูล?")) return;

  const data = JSON.parse(await file.text());
  for (const [collectionName, rows] of Object.entries({
    game_modes: data.game_modes || [],
    levels: data.levels || [],
    players: data.players || [],
    attempts: data.attempts || []
  })) {
    for (const row of rows) {
      const id = row.id || doc(collection(db, collectionName)).id;
      const copy = {...row};
      delete copy.id;
      await setDoc(doc(db, collectionName, id), copy, {merge:true});
    }
  }
  alert("นำเข้าข้อมูลสำเร็จ");
  await refreshAll();
});

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".admin-tab-panel").forEach(x => x.classList.add("hidden"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.remove("hidden");
  });
});
