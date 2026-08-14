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


function validStudentId8(value){ return /^\d{8}$/.test(String(value||"").trim()); }
function studentIdFromAuthEmail(email){
  const value=String(email||"").toLowerCase(),suffix="@student.thc-nr.local";
  if(!value.endsWith(suffix))return "";
  const id=value.slice(0,-suffix.length);return validStudentId8(id)?id:"";
}
function normalizeAcademicProfile(data={}){
  const oldDepartment=String(data.department||"").trim(),oldMajor=String(data.major||"").trim();
  let department=oldDepartment,major=oldMajor;
  const raw=oldMajor||oldDepartment,compact=raw.replace(/\s+/g,"");
  if(["ธุรกิจดิจิทัล","ธุรกิจดิทัล","ดิจิทัลธุรกิจ"].includes(compact))major="ธุรกิจดิจิทัล";
  else if(["สารสนเทศ","เทคโนโลยีสารสนเทศ"].includes(compact)||["ไอที","IT"].includes(raw))major="เทคโนโลยีสารสนเทศ";
  if(/สารสนเทศ|ดิจิทัล|ธุรกิจดิทัล/i.test(oldDepartment))department="คอมพิวเตอร์";
  if(["เทคโนโลยีสารสนเทศ","ธุรกิจดิจิทัล"].includes(major))department="คอมพิวเตอร์";
  return {department:department||"ไม่ระบุแผนก",major:major||"ไม่ระบุสาขาวิชา"};
}
async function listAllAuthUsers(){
  const rows=[];let pageToken;
  do{const page=await getAuth().listUsers(1000,pageToken);rows.push(...page.users);pageToken=page.pageToken;}while(pageToken);
  return rows;
}
async function buildStudentAccountAudit(){
  const [authUsers,userSnap]=await Promise.all([listAllAuthUsers(),db.collection("users").get()]);
  const authStudents=authUsers.map(u=>({uid:u.uid,studentId:studentIdFromAuthEmail(u.email)})).filter(x=>x.studentId);
  const firestoreUsers=userSnap.docs.map(d=>({uid:d.id,...d.data()})).filter(x=>x.uid!==ADMIN_UID);
  const authUidSet=new Set(authStudents.map(x=>x.uid)),firestoreUidSet=new Set(firestoreUsers.map(x=>x.uid));
  const missingProfiles=authStudents.filter(x=>!firestoreUidSet.has(x.uid));
  const missingAuth=firestoreUsers.filter(x=>validStudentId8(x.studentId)&&!authUidSet.has(x.uid));
  const invalid=firestoreUsers.filter(x=>!validStudentId8(x.studentId));
  const counts=new Map();firestoreUsers.forEach(x=>{const id=String(x.studentId||"");if(id)counts.set(id,(counts.get(id)||0)+1)});
  const duplicates=[...counts.entries()].filter(([,n])=>n>1).map(([studentId,count])=>({studentId,count}));
  return {
    authStudentCount:authStudents.length,firestoreUserCount:firestoreUsers.length,
    missingProfiles:missingProfiles.length,missingAuth:missingAuth.length,
    invalidStudentIds:invalid.length,duplicateStudentIds:duplicates.length,
    missingProfileIds:missingProfiles.slice(0,50).map(x=>x.studentId),
    missingAuthIds:missingAuth.slice(0,50).map(x=>String(x.studentId||"")),
    invalidIds:invalid.slice(0,50).map(x=>String(x.studentId||"")),duplicates:duplicates.slice(0,50)
  };
}
exports.adminAuditStudentAccounts=onCall(async request=>{
  const caller=requireAuth(request);if(caller!==ADMIN_UID)throw new HttpsError("permission-denied","Admin only");
  return await buildStudentAccountAudit();
});
exports.adminRepairStudentDatabase=onCall(async request=>{
  const caller=requireAuth(request);if(caller!==ADMIN_UID)throw new HttpsError("permission-denied","Admin only");
  const authUsers=await listAllAuthUsers();
  const authStudents=authUsers.map(u=>({uid:u.uid,studentId:studentIdFromAuthEmail(u.email)})).filter(x=>x.studentId);
  let createdProfiles=0,updatedProfiles=0;

  for(const account of authStudents){
    const ref=db.doc(`users/${account.uid}`),snap=await ref.get();
    if(!snap.exists){
      await ref.set({
        uid:account.uid,studentId:account.studentId,fullName:account.studentId,
        educationLevel:"ปวช.1",classroom:"/1",classKey:"ปวช.1/1",
        department:"ไม่ระบุแผนก",major:"ไม่ระบุสาขาวิชา",role:"student",status:"active",
        tokenBalance:0,tokenLifetime:0,inventory:[],inventoryCapacity:25,
        officialProgress:{},officialSubmitted:false,progress:{html:{maxUnlockedStage:1},python:{maxUnlockedStage:1}},
        character:{gender:null,equipped:{}},zone:{x:450,y:690,direction:"right"},
        profileNeedsRepair:true,recoveredAt:FieldValue.serverTimestamp(),createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()
      },{merge:true});createdProfiles++;
    }
  }

  const users=await db.collection("users").get();
  for(const item of users.docs){
    if(item.id===ADMIN_UID)continue;
    const data=item.data()||{},academic=normalizeAcademicProfile(data);
    if(!validStudentId8(data.studentId))continue;
    const classKey=data.classKey||(data.educationLevel&&data.classroom?`${data.educationLevel}${data.classroom}`:"");
    await item.ref.set({uid:item.id,department:academic.department,major:academic.major,classKey,updatedAt:FieldValue.serverTimestamp()},{merge:true});
    await db.doc(`public_profiles/${item.id}`).set({
      uid:item.id,studentId:data.studentId,fullName:data.fullName||data.studentId,
      educationLevel:data.educationLevel||"",classroom:data.classroom||"",classKey,
      department:academic.department,major:academic.major,rank:data.rank||null,character:data.character||null,
      updatedAt:FieldValue.serverTimestamp()
    },{merge:true});
    updatedProfiles++;
  }
  return {ok:true,createdProfiles,updatedProfiles,audit:await buildStudentAccountAudit()};
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
