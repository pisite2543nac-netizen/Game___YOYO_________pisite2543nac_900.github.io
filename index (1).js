const {onCall,HttpsError}=require("firebase-functions/v2/https");
const {setGlobalOptions}=require("firebase-functions/v2");
const {initializeApp}=require("firebase-admin/app");
const {getAuth}=require("firebase-admin/auth");
const {getFirestore,FieldValue,Timestamp}=require("firebase-admin/firestore");

initializeApp();
setGlobalOptions({region:"asia-southeast1",maxInstances:10});
const db=getFirestore();
const ADMIN_UID="TWUrLjOh3BTa1cBNwDXKk4X2IAg1";

function requireAuth(request){
  if(!request.auth)throw new HttpsError("unauthenticated","กรุณา Login ก่อน");
  return request.auth.uid;
}
function bangkokDayKey(date=new Date()){
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
}

exports.adminResetStudentPassword=onCall(async request=>{
  const caller=requireAuth(request);
  if(caller!==ADMIN_UID)throw new HttpsError("permission-denied","Admin only");
  const targetUid=String(request.data?.targetUid||"").trim();
  const newPassword=String(request.data?.newPassword||"");
  if(!targetUid)throw new HttpsError("invalid-argument","ไม่พบ UID");
  if(newPassword.length<6||newPassword.length>64)throw new HttpsError("invalid-argument","รหัสผ่านต้อง 6–64 ตัวอักษร");
  await getAuth().updateUser(targetUid,{password:newPassword});
  return {ok:true,targetUid};
});

async function deleteQueryByUid(collectionName,uid){
  const snap=await db.collection(collectionName).where("uid","==",uid).get();
  if(snap.empty)return 0;
  let batch=db.batch(),count=0,total=0;
  for(const item of snap.docs){
    batch.delete(item.ref);count++;total++;
    if(count>=400){await batch.commit();batch=db.batch();count=0;}
  }
  if(count)await batch.commit();
  return total;
}
async function deleteDocumentTree(ref){
  const subcollections=await ref.listCollections();
  for(const col of subcollections){
    const snap=await col.get();
    for(const child of snap.docs)await deleteDocumentTree(child.ref);
  }
  try{await ref.delete();}catch{}
}
exports.adminDeleteStudentAccount=onCall(async request=>{
  const caller=requireAuth(request);
  if(caller!==ADMIN_UID)throw new HttpsError("permission-denied","Admin only");
  const targetUid=String(request.data?.targetUid||"").trim();
  if(!targetUid)throw new HttpsError("invalid-argument","ไม่พบ UID");
  if(targetUid===ADMIN_UID)throw new HttpsError("failed-precondition","ห้ามลบบัญชี Admin");

  // เก็บ studentId ไว้ใน response ก่อนลบ เพื่อให้หน้า Admin แจ้งผลได้
  let studentId="";
  const userRef=db.doc(`users/${targetUid}`);
  try{const profile=await userRef.get();studentId=profile.exists?String(profile.data()?.studentId||""):"";}catch{}

  // ลบข้อมูลแบบ keyed documents และ subcollections ของ User
  await deleteDocumentTree(userRef);
  await deleteDocumentTree(db.doc(`quest_progress/${targetUid}`));
  for(const path of [
    `public_profiles/${targetUid}`,`presence/${targetUid}`,`zone_positions/${targetUid}`,
    `zone_moderation/${targetUid}`,`official_submissions/${targetUid}`,`rankings/${targetUid}`
  ]){try{await db.doc(path).delete();}catch{}}

  // ลบข้อมูลที่เป็น collection records ตาม uid
  for(const name of ["attempts","zone_messages","zone_chat_archive"]){
    try{await deleteQueryByUid(name,targetUid);}catch(error){console.warn(`cleanup ${name}`,error);}
  }
  // ห้อง PVP ที่ยังผูกกับผู้ใช้นี้จะถูกลบ เพื่อไม่ทิ้งห้องค้าง
  try{
    const rooms=await db.collection("pvp_rooms").get();
    let batch=db.batch();let count=0;
    for(const room of rooms.docs){const data=room.data()||{};if(!(targetUid in (data.players||{})))continue;batch.delete(room.ref);count++;if(count>=400){await batch.commit();batch=db.batch();count=0;}}
    if(count)await batch.commit();
  }catch(error){console.warn("cleanup pvp",error);}

  // ขั้นสุดท้าย: ลบ Firebase Authentication user เพื่อคืน synthetic email/studentId ให้สมัครใหม่
  try{await getAuth().deleteUser(targetUid);}catch(error){
    if(error?.code!=="auth/user-not-found")throw new HttpsError("internal","ลบ Firebase Authentication ไม่สำเร็จ");
  }
  return {ok:true,targetUid,studentId};
});

exports.recordDailyCheckinHeartbeat=onCall(async request=>{
  const uid=requireAuth(request);
  if(uid===ADMIN_UID)return {qualifiedSeconds:3600,rewarded:true,justRewarded:false,admin:true};
  if(request.data?.visible!==true||request.data?.fullscreen!==true)
    throw new HttpsError("failed-precondition","ต้องเปิดหน้าเว็บและโหมดเต็มหน้าจอ");
  const now=new Date(),dayKey=bangkokDayKey(now);
  const userRef=db.doc(`users/${uid}`),checkRef=db.doc(`users/${uid}/daily_checkins/${dayKey}`);
  let response={qualifiedSeconds:0,rewarded:false,justRewarded:false};
  await db.runTransaction(async tx=>{
    const [userSnap,checkSnap]=await Promise.all([tx.get(userRef),tx.get(checkRef)]);
    if(!userSnap.exists)throw new HttpsError("not-found","ไม่พบ User profile");
    const old=checkSnap.exists?checkSnap.data():{};
    const last=old.lastHeartbeatAt?.toDate?.();
    let add=0;
    if(last){
      const gap=(now.getTime()-last.getTime())/1000;
      // เพิ่มเวลาเฉพาะ heartbeat ต่อเนื่อง ไม่เปิดช่องให้กระโดดเวลาจากการปิดหน้าเว็บนาน ๆ
      if(gap>=35&&gap<=90)add=Math.min(65,Math.floor(gap));
    }
    const qualified=Math.min(3600,Number(old.qualifiedSeconds||0)+add);
    let rewarded=old.rewarded===true,justRewarded=false;
    const update={uid,dayKey,qualifiedSeconds:qualified,lastHeartbeatAt:Timestamp.fromDate(now),updatedAt:Timestamp.fromDate(now)};
    if(!checkSnap.exists)update.createdAt=Timestamp.fromDate(now);
    if(qualified>=3600&&!rewarded){
      rewarded=true;justRewarded=true;update.rewarded=true;update.rewardedAt=Timestamp.fromDate(now);
      const user=userSnap.data();
      tx.update(userRef,{tokenBalance:Number(user.tokenBalance||0)+10,tokenLifetime:Number(user.tokenLifetime||0)+10,updatedAt:FieldValue.serverTimestamp()});
    }else update.rewarded=rewarded;
    tx.set(checkRef,update,{merge:true});
    response={qualifiedSeconds:qualified,rewarded,justRewarded,dayKey};
  });
  return response;
});
