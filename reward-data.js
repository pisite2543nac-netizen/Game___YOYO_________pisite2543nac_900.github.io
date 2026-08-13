export const REWARD_ITEMS = [
  {id:"cap_blue",name:"หมวก Coder ฟ้า",icon:"🧢",cost:250,type:"wearable",slot:"head",rarity:"common",visual:"cap",description:"หมวกเรียบง่ายสำหรับผู้เริ่มต้น"},
  {id:"shirt_blue",name:"เสื้อ Code ฟ้า",icon:"👕",cost:350,type:"wearable",slot:"top",rarity:"common",visual:"shirt_blue",description:"เสื้อสีฟ้าสไตล์ Coder"},
  {id:"sneaker_white",name:"รองเท้าขาว",icon:"👟",cost:450,type:"wearable",slot:"shoes",rarity:"common",visual:"shoe_white",description:"รองเท้าพื้นฐานดูสะอาด"},

  {id:"thai_sash",name:"ผ้าคาดไทย",icon:"🎗️",cost:700,type:"wearable",slot:"top",rarity:"rare",visual:"thai_sash",description:"ผ้าคาดลายไทยเพิ่มความโดดเด่น"},
  {id:"student_bag",name:"กระเป๋านักเรียน",icon:"🎒",cost:850,type:"wearable",slot:"back",rarity:"rare",visual:"backpack",description:"กระเป๋าสะพายสำหรับตัวละคร"},
  {id:"round_glasses",name:"แว่นทรงกลม",icon:"👓",cost:1000,type:"wearable",slot:"face",rarity:"rare",visual:"glasses",description:"แว่นสำหรับสายวิชาการ"},

  {id:"coder_jacket",name:"แจ็กเก็ต Cyber Coder",icon:"🧥",cost:1600,type:"wearable",slot:"top",rarity:"epic",visual:"cyber_jacket",description:"แจ็กเก็ตไซเบอร์มีขอบเรืองแสง"},
  {id:"neon_headset",name:"หูฟัง Neon",icon:"🎧",cost:1900,type:"wearable",slot:"head",rarity:"epic",visual:"neon_headset",description:"หูฟัง Neon สำหรับสายเกม"},
  {id:"code_tablet",name:"แท็บเล็ต Code",icon:"📱",cost:2200,type:"wearable",slot:"hand",rarity:"epic",visual:"tablet",description:"แท็บเล็ตเรืองแสงถือในมือ"},

  {id:"gold_crown",name:"มงกุฎทอง Coder",icon:"👑",cost:3500,type:"wearable",slot:"head",rarity:"legendary",visual:"gold_crown",description:"มงกุฎทองสำหรับผู้เล่นระดับสูง"},
  {id:"royal_cape",name:"ผ้าคลุม Royal Code",icon:"🦸",cost:4200,type:"wearable",slot:"back",rarity:"legendary",visual:"royal_cape",description:"ผ้าคลุมใหญ่พร้อมขอบทอง"},
  {id:"gold_aura",name:"ออร่าสีทอง",icon:"✨",cost:5000,type:"wearable",slot:"aura",rarity:"legendary",visual:"gold_aura",description:"ออร่าทองล้อมรอบตัวละคร"},

  {id:"dragon_wings",name:"ปีกมังกร Cyber",icon:"🐉",cost:7500,type:"wearable",slot:"back",rarity:"mythic",visual:"dragon_wings",description:"ปีกมังกรเรืองแสงขนาดใหญ่"},
  {id:"master_halo",name:"วงแหวน Master",icon:"🌟",cost:9000,type:"wearable",slot:"aura",rarity:"mythic",visual:"master_halo",description:"วงแหวนพลังระดับ Master"},
  {id:"phoenix_pet",name:"สัตว์เลี้ยง Phoenix",icon:"🔥",cost:12000,type:"wearable",slot:"pet",rarity:"mythic",visual:"phoenix_pet",description:"Phoenix ไฟลอยข้างตัวละคร"},
  {id:"throne_effect",name:"บัลลังก์ Code Emperor",icon:"🏆",cost:18000,type:"wearable",slot:"aura",rarity:"mythic",visual:"throne",description:"เอฟเฟกต์สูงสุดของร้าน Token"},

  // ===== ITEM SET 2 · PREMIUM +30% =====
  // cost = baseCost × 1.30 ตามกติกาชุดที่ 2
  {id:"set2_mystic_staff",name:"คฑา Mystic Code",icon:"🪄",baseCost:2400,cost:3120,type:"wearable",slot:"hand",rarity:"epic",set:"set2",visual:"mystic_staff",description:"คฑาพลังโค้ด มีประกายเวท ชุด 2 ราคา +30%"},
  {id:"set2_katana",name:"ดาบ Katana Coder",icon:"🗡️",baseCost:3000,cost:3900,type:"wearable",slot:"hand",rarity:"epic",set:"set2",visual:"katana",description:"ดาบคาตานะแสงสำหรับนักพิมพ์สายเร็ว ชุด 2 ราคา +30%"},
  {id:"set2_cyber_spear",name:"หอก Cyber Spear",icon:"🔱",baseCost:3800,cost:4940,type:"wearable",slot:"hand",rarity:"legendary",set:"set2",visual:"cyber_spear",description:"หอกพลังงานยาวพร้อมแสง Neon ชุด 2 ราคา +30%"},

  {id:"set2_samurai_armor",name:"ชุด Samurai Coder",icon:"🥋",baseCost:5000,cost:6500,type:"wearable",slot:"top",rarity:"legendary",set:"set2",visual:"samurai_armor",description:"เกราะซามูไรแดงดำขอบทอง ชุด 2 ราคา +30%"},
  {id:"set2_mage_robe",name:"ชุด Arcane Programmer",icon:"🧙",baseCost:6000,cost:7800,type:"wearable",slot:"top",rarity:"legendary",set:"set2",visual:"mage_robe",description:"เสื้อคลุมจอมเวทสายโปรแกรม ชุด 2 ราคา +30%"},
  {id:"set2_dragon_armor",name:"ชุด Dragon Core",icon:"🛡️",baseCost:8000,cost:10400,type:"wearable",slot:"top",rarity:"mythic",set:"set2",visual:"dragon_armor",description:"เกราะมังกรพร้อมแกนพลังงาน ชุด 2 ราคา +30%"},

  {id:"set2_cat_pet",name:"สัตว์เลี้ยง Code Cat",icon:"🐈",baseCost:2500,cost:3250,type:"wearable",slot:"pet",rarity:"epic",set:"set2",visual:"cat_pet",description:"แมวคู่หูนักเขียนโค้ด ชุด 2 ราคา +30%"},
  {id:"set2_wolf_pet",name:"สัตว์เลี้ยง Neon Wolf",icon:"🐺",baseCost:4500,cost:5850,type:"wearable",slot:"pet",rarity:"legendary",set:"set2",visual:"wolf_pet",description:"หมาป่า Neon วิ่งตามตัวละคร ชุด 2 ราคา +30%"},
  {id:"set2_tiger_pet",name:"สัตว์เลี้ยง Siam Tiger",icon:"🐯",baseCost:7000,cost:9100,type:"wearable",slot:"pet",rarity:"legendary",set:"set2",visual:"tiger_pet",description:"เสือคู่ใจที่ดูโดดเด่นใน Zone ชุด 2 ราคา +30%"},
  {id:"set2_mini_dragon",name:"สัตว์เลี้ยง Mini Dragon",icon:"🐲",baseCost:11000,cost:14300,type:"wearable",slot:"pet",rarity:"mythic",set:"set2",visual:"mini_dragon",description:"มังกรจิ๋วบินข้างตัวละคร ชุด 2 ราคา +30%"},

  {id:"set2_spirit_wings",name:"ปีก Spirit Guardian",icon:"🪽",baseCost:9500,cost:12350,type:"wearable",slot:"back",rarity:"mythic",set:"set2",visual:"spirit_wings",description:"ปีกวิญญาณสีฟ้าขนาดใหญ่ ชุด 2 ราคา +30%"},
  {id:"set2_storm_aura",name:"Storm Code Aura",icon:"⚡",baseCost:12500,cost:16250,type:"wearable",slot:"aura",rarity:"mythic",set:"set2",visual:"storm_aura",description:"สายฟ้าหมุนรอบตัวละคร ชุด 2 ราคา +30%"}

];

export const RARITY_META = {
  common:{name:"COMMON",order:1},
  rare:{name:"RARE",order:2},
  epic:{name:"EPIC",order:3},
  legendary:{name:"LEGENDARY",order:4},
  mythic:{name:"MYTHIC",order:5}
};
