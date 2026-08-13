export const TOKEN_REWARD_CONFIG = {
  maxPerStage: 70,
  weights: { accuracy: 0.70, speed: 0.30 },
  speedTargets: { easy: 28, medium: 42, hard: 58 },
  minimumPerformanceFactor: 0.35,
  wagerOptions: [0,5,10,20,30,40,50]
};

export function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }

export function maxTokenForLesson(lesson){
  return Math.min(TOKEN_REWARD_CONFIG.maxPerStage, Math.max(1, Number(lesson?.rewardPoints||0)));
}

export function calculateStageTokenReward(lesson,wpm,accuracy){
  const maxToken=maxTokenForLesson(lesson);
  const difficulty=lesson?.difficulty||"easy";
  const target=TOKEN_REWARD_CONFIG.speedTargets[difficulty]||40;
  const accuracyFactor=clamp(Number(accuracy||0)/100,0,1);
  const speedFactor=clamp(Number(wpm||0)/target,0,1);
  const weighted=accuracyFactor*TOKEN_REWARD_CONFIG.weights.accuracy + speedFactor*TOKEN_REWARD_CONFIG.weights.speed;
  const factor=Math.max(TOKEN_REWARD_CONFIG.minimumPerformanceFactor,weighted);
  const earned=Math.min(maxToken,Math.max(1,Math.round(maxToken*factor)));
  return {earned,maxToken,accuracyFactor,speedFactor,targetWpm:target,performanceFactor:factor};
}

export function classKey(educationLevel,classroom){
  return `${String(educationLevel||"").trim()}${String(classroom||"").trim()}`;
}

export function set2Price(baseCost){ return Math.round(Number(baseCost||0)*1.30); }
