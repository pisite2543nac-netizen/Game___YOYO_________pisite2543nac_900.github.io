export const QUEST_CONFIG = {
  dailyLimit: 3,
  rankOrder: ["bronze","silver","gold","platinum","diamond","master"],
  activeLimitByRank: {
    bronze:1,
    silver:1,
    gold:2,
    platinum:2,
    diamond:3,
    master:3
  },
  rewardRanges: {
    easy:{min:2,max:5},
    medium:{min:10,max:15},
    hard:{min:15,max:20}
  },
  defaultMinRank: {
    easy:"bronze",
    medium:"silver",
    hard:"platinum"
  }
};

export const DEFAULT_TEACHER_QUESTS = [
  {
    id:"q_easy_html_03",
    title:"ฝึก HTML พื้นฐาน",
    description:"ผ่าน HTML Stage 3 ให้สำเร็จ",
    languageId:"html",
    stage:3,
    difficulty:"easy",
    objectiveType:"pass",
    targetValue:0,
    rewardToken:4,
    minRank:"bronze",
    active:true
  },
  {
    id:"q_easy_python_05",
    title:"Python แม่นยำ",
    description:"ผ่าน Python Stage 5 ด้วย Accuracy อย่างน้อย 95%",
    languageId:"python",
    stage:5,
    difficulty:"easy",
    objectiveType:"accuracy",
    targetValue:95,
    rewardToken:5,
    minRank:"bronze",
    active:true
  },
  {
    id:"q_medium_html_20",
    title:"HTML Speed Challenge",
    description:"ผ่าน HTML Stage 20 ภายใน 100 วินาที",
    languageId:"html",
    stage:20,
    difficulty:"medium",
    objectiveType:"time",
    targetValue:100,
    rewardToken:12,
    minRank:"silver",
    active:true
  },
  {
    id:"q_medium_python_24",
    title:"Python Precision",
    description:"ผ่าน Python Stage 24 ด้วย Accuracy อย่างน้อย 97%",
    languageId:"python",
    stage:24,
    difficulty:"medium",
    objectiveType:"accuracy",
    targetValue:97,
    rewardToken:14,
    minRank:"silver",
    active:true
  },
  {
    id:"q_hard_html_40",
    title:"HTML Master Run",
    description:"ผ่าน HTML Stage 40 ภายใน 150 วินาที",
    languageId:"html",
    stage:40,
    difficulty:"hard",
    objectiveType:"time",
    targetValue:150,
    rewardToken:18,
    minRank:"platinum",
    active:true
  },
  {
    id:"q_hard_python_45",
    title:"Python Perfect Code",
    description:"ผ่าน Python Stage 45 ด้วย Accuracy อย่างน้อย 99%",
    languageId:"python",
    stage:45,
    difficulty:"hard",
    objectiveType:"accuracy",
    targetValue:99,
    rewardToken:20,
    minRank:"platinum",
    active:true
  }
];

export function localDayKey(date=new Date()){
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,"0");
  const d=String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}

export function normalizeRankId(rank){
  const id=String(rank?.tierId||rank||"bronze").toLowerCase();
  return QUEST_CONFIG.rankOrder.includes(id)?id:"bronze";
}

export function rankIndex(rank){
  return QUEST_CONFIG.rankOrder.indexOf(normalizeRankId(rank));
}

export function activeQuestLimit(rank){
  return QUEST_CONFIG.activeLimitByRank[normalizeRankId(rank)]||1;
}

export function canAccessQuest(rank,quest){
  const required=quest?.minRank||QUEST_CONFIG.defaultMinRank[quest?.difficulty]||"bronze";
  return rankIndex(rank)>=rankIndex(required);
}

export function rewardRange(difficulty){
  return QUEST_CONFIG.rewardRanges[difficulty]||QUEST_CONFIG.rewardRanges.easy;
}

export function clampQuestReward(difficulty,value){
  const range=rewardRange(difficulty);
  const n=Math.round(Number(value||range.min));
  return Math.max(range.min,Math.min(range.max,n));
}

export function questDifficultyName(difficulty){
  return difficulty==="hard"?"ยาก":difficulty==="medium"?"ปานกลาง":"ง่าย";
}

export function questObjectiveLabel(quest){
  if(!quest)return "-";
  if(quest.objectiveType==="time")return `ผ่านภายใน ${Number(quest.targetValue||0)} วินาที`;
  if(quest.objectiveType==="accuracy")return `Accuracy อย่างน้อย ${Number(quest.targetValue||0)}%`;
  return "ผ่านด่านให้สำเร็จ";
}

export function questObjectiveMet(quest,result){
  if(!quest||!result)return false;
  if(String(result.languageId)!==String(quest.languageId))return false;
  if(Number(result.stage)!==Number(quest.stage))return false;
  if(quest.objectiveType==="time")return Number(result.elapsedSeconds)<=Number(quest.targetValue||0);
  if(quest.objectiveType==="accuracy")return Number(result.accuracy)>=Number(quest.targetValue||0);
  return true;
}

export function defaultMinRankForDifficulty(difficulty){
  return QUEST_CONFIG.defaultMinRank[difficulty]||"bronze";
}
