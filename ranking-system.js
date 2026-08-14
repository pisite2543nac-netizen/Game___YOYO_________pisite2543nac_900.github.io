export const RANKING_CONFIG = {
  seasonDays: 60,

  weights: {
    diligence: 0.35,
    accuracy: 0.30,
    speed: 0.20,
    consistency: 0.15
  },

  // WPM เทียบกับช่วงคะแนนความเร็ว 0-100
  speedReferenceWpm: 80,

  tiers: [
    {id:"bronze", name:"Bronze", icon:"🥉", min:0},
    {id:"silver", name:"Silver", icon:"🥈", min:35},
    {id:"gold", name:"Gold", icon:"🥇", min:55},
    {id:"platinum", name:"Platinum", icon:"💠", min:70},
    {id:"diamond", name:"Diamond", icon:"💎", min:82},
    {id:"master", name:"Master", icon:"👑", min:92}
  ]
};

export function seasonIdFromDate(date = new Date()) {
  const epoch = Date.UTC(2026, 0, 1);
  const days = Math.floor((date.getTime() - epoch) / 86400000);
  const season = Math.floor(Math.max(0, days) / RANKING_CONFIG.seasonDays) + 1;
  return `S${String(season).padStart(3, "0")}`;
}

export function seasonRange(date = new Date()) {
  const epoch = Date.UTC(2026, 0, 1);
  const days = Math.floor((date.getTime() - epoch) / 86400000);
  const seasonIndex = Math.floor(Math.max(0, days) / RANKING_CONFIG.seasonDays);
  const start = new Date(epoch + seasonIndex * RANKING_CONFIG.seasonDays * 86400000);
  const end = new Date(start.getTime() + RANKING_CONFIG.seasonDays * 86400000 - 1);
  return { start, end };
}

export function calculateRankMetrics(attempts, activeDayCount = 0) {
  const completed = attempts.filter(a => a.status === "completed");
  const total = completed.length;

  const avgAccuracy = total
    ? completed.reduce((s,a)=>s + Number(a.accuracy || 0), 0) / total
    : 0;

  const avgWpm = total
    ? completed.reduce((s,a)=>s + Number(a.wpm || 0), 0) / total
    : 0;

  // ความขยัน: จำนวนด่าน + จำนวนวันที่กลับมาใช้งาน
  const attemptFactor = Math.min(100, total * 2.5);
  const dayFactor = Math.min(100, activeDayCount * 4);
  const diligence = attemptFactor * 0.65 + dayFactor * 0.35;

  // ความเร็ว: ไม่ให้ความเร็วสูงอย่างเดียวชนะ Accuracy
  const speed = Math.min(100, (avgWpm / RANKING_CONFIG.speedReferenceWpm) * 100);

  // ความสม่ำเสมอ: Accuracy กระจายน้อย + มีหลายรอบ
  let consistency = 0;
  if (total) {
    const mean = avgAccuracy;
    const variance = completed.reduce((s,a)=>{
      const d = Number(a.accuracy || 0) - mean;
      return s + d*d;
    },0) / total;
    const std = Math.sqrt(variance);
    const stability = Math.max(0, 100 - std * 2);
    const volume = Math.min(100, total * 4);
    consistency = stability * 0.7 + volume * 0.3;
  }

  const accuracy = Math.max(0, Math.min(100, avgAccuracy));

  const rating = Math.round(
    diligence * RANKING_CONFIG.weights.diligence +
    accuracy * RANKING_CONFIG.weights.accuracy +
    speed * RANKING_CONFIG.weights.speed +
    consistency * RANKING_CONFIG.weights.consistency
  );

  const tiers = [...RANKING_CONFIG.tiers].sort((a,b)=>b.min-a.min);
  const tier = tiers.find(t => rating >= t.min) || RANKING_CONFIG.tiers[0];

  return {
    rating,
    tierId: tier.id,
    tierName: tier.name,
    tierIcon: tier.icon,
    diligence: Math.round(diligence),
    accuracy: Math.round(accuracy),
    speed: Math.round(speed),
    consistency: Math.round(consistency),
    avgWpm: Math.round(avgWpm * 10) / 10,
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    completedAttempts: total,
    activeDayCount
  };
}


export function rankingClassKey(educationLevel,classroom){
  return `${String(educationLevel||"").trim()}${String(classroom||"").trim()}`;
}

export function rankProfiles(profiles,limit=10){
  return [...profiles].sort((a,b)=>Number(b?.rank?.rating||0)-Number(a?.rank?.rating||0)).slice(0,limit);
}
