export const DEFAULT_CHARACTER = {
  avatarId: "base_student",
  gender: null, // "male" | "female" เลือกครั้งแรกเมื่อเข้า Social Zone
  displayName: "",
  showcaseItemIds: [],
  bodyVariant: "base",
  outfitIds: [],
  hatId: null,
  emoteIds: [],
  nameEffectId: null
};

export const DEFAULT_ZONE_STATE = {
  zoneId: "thai_night_social",
  x: 420,
  y: 690,
  direction: "right",
  lastSeenAt: null
};

// V3.5 Social Zone intentionally keeps character gameplay simple:
// - base male/female avatar
// - horizontal movement only
// - chat bubbles
// - Token items are collectibles shown on profile, not gameplay stats
