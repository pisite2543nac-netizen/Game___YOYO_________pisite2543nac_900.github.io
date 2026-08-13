import { HTML_LEVELS } from "./levels-html.js?v=4.5.0";
import { PYTHON_LEVELS } from "./levels-python.js?v=4.5.0";

export const LANGUAGES = [
  {
    id:"html", name:"HTML", icon:"🌐", stageCount:50,
    tagline:"50 ด่าน · โครงสร้างหน้าเว็บ",
    description:"ฝึก HTML จากแท็กพื้นฐานไปจนถึง Semantic Layout และหน้าเว็บที่ซับซ้อน",
    benefit:"สร้างพื้นฐาน Front-End, DOM, Accessibility และโครงสร้างเว็บที่ถูกต้อง"
  },
  {
    id:"python", name:"Python", icon:"🐍", stageCount:50,
    tagline:"50 ด่าน · Logic และ Programming",
    description:"ฝึก Python จากตัวแปรไปจนถึง Class, Generator, Decorator และ Async",
    benefit:"ต่อยอด Algorithm, Automation, Data, AI และ Back-End"
  },
  {
    id:"css", name:"CSS", icon:"🎨", stageCount:0, comingSoon:true,
    tagline:"กำลังเตรียมด่าน", description:"ระบบรองรับการเพิ่ม 50 ด่าน CSS ในเวอร์ชันถัดไป",
    benefit:"โครงสร้างระบบเตรียมพร้อมแล้ว"
  },
  {
    id:"javascript", name:"JavaScript", icon:"⚡", stageCount:0, comingSoon:true,
    tagline:"กำลังเตรียมด่าน", description:"ระบบรองรับการเพิ่ม 50 ด่าน JavaScript ในเวอร์ชันถัดไป",
    benefit:"โครงสร้างระบบเตรียมพร้อมแล้ว"
  }
];

export const DIFFICULTIES = [
  {id:"easy",name:"ง่าย",icon:"🟢",multiplier:1.00,from:1,to:15,description:"ด่าน 1–15 · พื้นฐาน"},
  {id:"medium",name:"ปานกลาง",icon:"🟡",multiplier:1.35,from:16,to:35,description:"ด่าน 16–35 · โครงสร้างมากขึ้น"},
  {id:"hard",name:"ยาก",icon:"🔴",multiplier:1.75,from:36,to:50,description:"ด่าน 36–50 · โค้ดยาวและซับซ้อน"}
];

export const LESSONS = [...HTML_LEVELS, ...PYTHON_LEVELS];
