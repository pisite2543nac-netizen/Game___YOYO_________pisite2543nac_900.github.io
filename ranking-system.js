export const RANKING_CONFIG = {
  seasonDays: null,
  weights: {
    speed: 0.40,
    accuracy: 0.40,
    completionTime: 0.20
  },
  targets: {
    // WPM ตั้ง 80 เป็นคะแนนความเร็วเต็ม 100
    targetWpm: 80,
    // เวลามาตรฐานสำหรับ normalization; ยิ่งต่ำยิ่งได้คะแนนมาก
    referenceSeconds: 180
  }
};

export function seasonIdFromDate(date = new Date()) {
  return "MANUAL";
}

export function seasonRange(date = new Date()) {
  return {
    start: new Date(Date.UTC(2026,0,1)),
    end: new Date(Date.UTC(2099,11,31,23,59,59,999))
  };
}

export function calculateRankMetrics(attempts=[]){
  const completed=(attempts||[]).filter(a=>{
    const status=String(a.status||"").toLowerCase();
    return status==="completed"||status==="complete"||status==="passed"||status==="success";
  });

  if(!completed.length){
    return {
      rating:0,
      tierId:"bronze",
      tierName:"Bronze",
      speed:0,
      accuracy:0,
      completionTime:0,
      avgWpm:0,
      avgAccuracy:0,
      avgSeconds:0,
      bestWpm:0,
      bestAccuracy:0,
      bestSeconds:0,
      completedAttempts:0
    };
  }

  const wpms=completed.map(a=>Number(a.wpm||0)).filter(Number.isFinite);
  const accuracies=completed.map(a=>Number(a.accuracy||0)).filter(Number.isFinite);
  const seconds=completed.map(a=>{
    const raw=Number(a.elapsedSeconds ?? a.elapsed ?? a.timeSeconds ?? a.durationSeconds ?? 0);
    return Number.isFinite(raw)&&raw>0?raw:null;
  }).filter(v=>v!==null);

  const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
  const avgWpm=avg(wpms);
  const avgAccuracy=avg(accuracies);
  const avgSeconds=avg(seconds);

  // 40 คะแนนจากความเร็ว: 80 WPM = เต็ม 100 ใน component นี้
  const speed=Math.max(0,Math.min(100,(avgWpm/RANKING_CONFIG.targets.targetWpm)*100));

  // 40 คะแนนจาก Accuracy โดยตรง
  const accuracy=Math.max(0,Math.min(100,avgAccuracy));

  // 20 คะแนนจากเวลา: ใช้ inverse ratio ยิ่งเร็วคะแนนยิ่งสูง
  // 90 sec = 100, 180 sec = 50, 360 sec = 25 โดยไม่ให้เกิน 100
  const completionTime=avgSeconds>0
    ?Math.max(0,Math.min(100,(90/avgSeconds)*100))
    :0;

  const rating=Math.round(
    speed*RANKING_CONFIG.weights.speed +
    accuracy*RANKING_CONFIG.weights.accuracy +
    completionTime*RANKING_CONFIG.weights.completionTime
  );

  const tier=rankTierFromRating(rating);
  return {
    rating,
    tierId:tier.id,
    tierName:tier.name,
    speed:Math.round(speed),
    accuracy:Math.round(accuracy),
    completionTime:Math.round(completionTime),
    avgWpm:Math.round(avgWpm*10)/10,
    avgAccuracy:Math.round(avgAccuracy*100)/100,
    avgSeconds:Math.round(avgSeconds*10)/10,
    bestWpm:wpms.length?Math.max(...wpms):0,
    bestAccuracy:accuracies.length?Math.max(...accuracies):0,
    bestSeconds:seconds.length?Math.min(...seconds):0,
    completedAttempts:completed.length
  };
}

export function rankProfiles(profiles,limit=10){
  return [...profiles].sort((a,b)=>Number(b?.rank?.rating||0)-Number(a?.rank?.rating||0)).slice(0,limit);
}


function normalizeLegacyAcademicMajor(raw){
  const value=String(raw||"").trim();
  const compact=value.replace(/\s+/g,"");
  if(["ธุรกิจดิจิทัล","ธุรกิจดิทัล","ดิจิทัลธุรกิจ"].includes(compact))return "ธุรกิจดิจิทัล";
  if(["สารสนเทศ","เทคโนโลยีสารสนเทศ"].includes(compact)||value==="ไอที"||value==="IT")return "เทคโนโลยีสารสนเทศ";
  return value||"ไม่ระบุสาขาวิชา";
}
function legacyAcademicLooksLikeMajor(raw){
  return /สารสนเทศ|ดิจิทัล|ธุรกิจดิทัล/i.test(String(raw||""));
}
export function rankingDepartmentKey(user){
  const department=String(user?.department||"").trim();
  if(legacyAcademicLooksLikeMajor(department)) return "คอมพิวเตอร์";
  return department||"ไม่ระบุแผนก";
}
export function rankingMajorKey(user){
  const department=String(user?.department||"").trim();
  const major=String(user?.major||"").trim();
  if(major&&major!=="ไม่ระบุสาขาวิชา")return normalizeLegacyAcademicMajor(major);
  if(legacyAcademicLooksLikeMajor(department))return normalizeLegacyAcademicMajor(department);
  return "ไม่ระบุสาขาวิชา";
}
