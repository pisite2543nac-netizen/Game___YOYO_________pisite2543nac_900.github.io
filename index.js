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
