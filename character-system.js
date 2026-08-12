export const DEFAULT_CHARACTER = {
  avatarId: "default_student",
  displayName: "",
  bodyVariant: "default",
  outfitIds: [],
  hatId: null,
  emoteIds: [],
  nameEffectId: null
};

export const DEFAULT_ZONE_STATE = {
  zoneId: "campus_lobby",
  x: 0,
  y: 0,
  direction: "down",
  lastSeenAt: null
};

// ไฟล์นี้ตั้งใจเป็น Data Contract สำหรับ Character/2D Zone
// เมื่อผู้ใช้ส่ง Reference ภาพมา สามารถเพิ่ม Sprite Sheet,
// Animation State, Collision, Map และ Multiplayer Presence ได้
// โดยไม่ต้องเปลี่ยนโครงสร้าง users หลักใหม่
