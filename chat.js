import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc,
  collection, query, orderBy, limit, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);

const CHAT_ROOM = "global";
const ONLINE_STALE_MS = 100000;
const MAX_MESSAGES = 160;

let uid = null;
let isGM = false;
let senderLabel = null;
let studentId = null;
let msgUnsub = null;
let presenceUnsub = null;
let heartbeat = null;
let lastSendAt = 0;

const esc = v => String(v ?? "")
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;");

function formatTime(v){
  try{
    return v?.toDate?.().toLocaleString("th-TH",{
      hour:"2-digit",minute:"2-digit",day:"2-digit",month:"2-digit"
    }) || "กำลังส่ง...";
  }catch{return "-"}
}

function isOnline(p){
  if(!p?.online) return false;
  const dt=p.lastSeenAt?.toDate?.();
  return !dt || Date.now()-dt.getTime()<=ONLINE_STALE_MS;
}

async function loadIdentity(user){
  uid=user.uid;
  isGM=user.uid===ADMIN_UID;

  if(isGM){
    senderLabel="GM";
    studentId=null;
    $("chatSelfBadge").textContent="GM";
    $("chatSelfBadge").className="chat-self-badge gm";
    $("chatZoneLink").classList.add("hidden");
    $("chatBackLink").href="admin.html";
  }else{
    const snap=await getDoc(doc(db,"users",uid));
    if(!snap.exists()){
      location.href="index.html";
      return false;
    }
    studentId=String(snap.data().studentId||"").trim();
    if(!studentId){
      location.href="index.html";
      return false;
    }
    senderLabel=studentId;
    $("chatSelfBadge").textContent="STUDENT";
    $("chatSelfBadge").className="chat-self-badge student";
  }

  $("chatSelfName").textContent=senderLabel;
  $("chatComposeName").textContent=senderLabel;
  return true;
}

async function writeChatPresence(){
  if(!uid||!senderLabel)return;
  try{
    await setDoc(doc(db,"presence",uid),{
      uid,
      studentId:isGM?null:studentId,
      fullName:isGM?"GM":null,
      chatLabel:senderLabel,
      role:isGM?"gm":"student",
      area:"global_chat",
      online:true,
      lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch(error){
    console.warn("chat presence:",error);
  }
}

async function markOffline(){
  if(!uid)return;
  try{
    await setDoc(doc(db,"presence",uid),{
      online:false,
      lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch{}
}

function listenPresence(){
  if(presenceUnsub)presenceUnsub();

  presenceUnsub=onSnapshot(collection(db,"presence"),snap=>{
    const rows=snap.docs
      .map(d=>({uid:d.id,...d.data()}))
      .filter(isOnline)
      .sort((a,b)=>{
        if(a.role==="gm"&&b.role!=="gm")return -1;
        if(b.role==="gm"&&a.role!=="gm")return 1;
        return String(a.chatLabel||a.studentId||"").localeCompare(String(b.chatLabel||b.studentId||""));
      });

    $("chatOnlineCount").textContent=rows.length;
    $("chatMemberCount").textContent=rows.length;

    $("chatMemberList").innerHTML=rows.length?rows.map(p=>{
      const gm=p.role==="gm" || p.uid===ADMIN_UID;
      const label=gm?"GM":String(p.studentId||p.chatLabel||"USER");
      return `<div class="global-chat-member ${gm?"gm":""} ${p.uid===uid?"me":""}">
        <div class="global-chat-member-avatar">${gm?"GM":esc(label.slice(-2))}</div>
        <div>
          <strong>${esc(label)} ${p.uid===uid?'<em>YOU</em>':""}</strong>
          <small>${gm?"GAME MASTER":"STUDENT"} · ONLINE</small>
        </div>
        <span class="online-dot"></span>
      </div>`;
    }).join(""):`<div class="global-chat-member-empty">ยังไม่มีสมาชิกออนไลน์</div>`;
  });
}

function messageBubble(m){
  const mine=m.uid===uid;
  const gm=m.senderType==="gm";
  const label=gm?"GM":String(m.senderLabel||"STUDENT");

  return `<article class="global-message ${mine?"mine":""} ${gm?"gm":""}">
    <div class="global-message-avatar">${gm?"GM":esc(label.slice(-2))}</div>
    <div class="global-message-body">
      <div class="global-message-meta">
        <strong>${esc(label)}</strong>
        ${gm?'<span class="gm-label">GM</span>':""}
        <time>${formatTime(m.createdAt)}</time>
      </div>
      <div class="global-message-text">${esc(m.text)}</div>
    </div>
    ${(isGM||mine)?`<button class="global-message-delete" data-delete-message="${m.id}" title="ลบข้อความ">×</button>`:""}
  </article>`;
}

function listenMessages(){
  if(msgUnsub)msgUnsub();

  const q=query(
    collection(db,"global_messages"),
    orderBy("createdAt","desc"),
    limit(MAX_MESSAGES)
  );

  msgUnsub=onSnapshot(q,snap=>{
    const rows=snap.docs.map(d=>({id:d.id,...d.data()})).reverse();

    $("globalChatMessages").innerHTML=rows.length
      ? rows.map(messageBubble).join("")
      : `<div class="global-chat-empty">ยังไม่มีข้อความในห้องแชต</div>`;

    $("globalChatMessages").scrollTop=$("globalChatMessages").scrollHeight;

    document.querySelectorAll("[data-delete-message]").forEach(btn=>{
      btn.onclick=async()=>{
        try{
          await deleteDoc(doc(db,"global_messages",btn.dataset.deleteMessage));
        }catch(error){
          console.warn("delete message:",error);
        }
      };
    });
  },error=>{
    console.warn("global chat:",error);
    $("globalChatMessages").innerHTML=`<div class="global-chat-empty error">ไม่สามารถโหลดข้อความได้: ${esc(error.message)}</div>`;
  });
}

$("globalChatForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const input=$("globalChatInput");
  const text=String(input.value||"").trim().slice(0,300);
  if(!text||!uid||!senderLabel)return;

  const now=Date.now();
  if(now-lastSendAt<700)return;
  lastSendAt=now;

  input.value="";
  input.focus({preventScroll:true});

  try{
    await addDoc(collection(db,"global_messages"),{
      roomId:CHAT_ROOM,
      uid,
      senderLabel,
      senderType:isGM?"gm":"student",
      text,
      createdAt:serverTimestamp()
    });
  }catch(error){
    console.warn("send:",error);
  }
});

$("globalChatInput").addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){
    e.preventDefault();
    $("globalChatForm").requestSubmit();
  }
});

window.addEventListener("pagehide",markOffline);
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible")writeChatPresence();
});

onAuthStateChanged(auth,async user=>{
  if(!user){
    $("chatGate").innerHTML=`<div class="global-chat-gate-card">
      <div class="global-chat-gate-icon">🔒</div>
      <h1>กรุณา Login ก่อนเข้าห้องแชต</h1>
      <p>ห้องนี้สำหรับผู้ลงทะเบียนและ GM เท่านั้น</p>
      <a href="index.html" class="btn primary">กลับไป Login</a>
    </div>`;
    return;
  }

  const ok=await loadIdentity(user);
  if(!ok)return;

  $("chatGate").classList.add("hidden");
  $("globalChatApp").classList.remove("hidden");

  await writeChatPresence();
  clearInterval(heartbeat);
  heartbeat=setInterval(writeChatPresence,30000);

  listenPresence();
  listenMessages();
  setTimeout(()=>$("globalChatInput").focus({preventScroll:true}),120);
});
