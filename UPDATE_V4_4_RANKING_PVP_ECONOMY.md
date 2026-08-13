# V4.4 — Dual Ranking + PVP Multi Room + Token Economy + Item Set 2

## 1. Ranking 2 ระบบ
- แรงค์รวมทั้งหมด: ผู้เล่นทุก User ใน Season 60 วัน
- แรงค์ภายในห้อง: เทียบเฉพาะ `educationLevel + classroom` เช่น `ปวช.2/1`
- ใช้ Rating สูตรเดิม: ความขยัน + Accuracy + Speed + Consistency

## 2. PVP หลายห้องพร้อมกัน
Collection: `pvp_rooms`
- มีหลาย Room documents พร้อมกัน
- Room Code 6 ตัวสุ่มโดยระบบเท่านั้น
- เลือกห้องจาก Room Browser หรือกรอก Code ที่ระบบสร้าง
- 1v1 = 2 คน
- 2v2 Relay = 4 คน โดยในแต่ละ Shot สมาชิกทีมคนที่ 1 พิมพ์ครึ่งแรก แล้วส่งต่อให้สมาชิกคนที่ 2 พิมพ์ครึ่งหลัง

### Shot
- 1 Shot
- 3 Shot
- 5 Shot
- 2v2 รองรับ 1 / 3 / 5 Shot ทุกแบบ เพราะแต่ละ Shot แบ่ง Code เป็น 2 ส่วนให้สมาชิกทีมสลับกันพิมพ์

### Token Wager
เลือก: `0 / 5 / 10 / 20 / 30 / 40 / 50`
- ห้องเต็มแล้ว Client แต่ละคนล็อก Token ของตัวเอง
- ทีมชนะรับ Pot แบ่งเท่ากัน
- ระบบ Claim payout มี flag ป้องกันรับซ้ำ

> หมายเหตุ: ระบบนี้ใช้ Firebase Client แบบ Static Site ตามโครงเดิม สำหรับระบบแข่งขันที่ต้องป้องกันโกงระดับ Production ควรย้าย Token ledger / payout ไป Cloud Functions หรือ server ที่เชื่อถือได้

## 3. Token ต่อด่าน
- Token สูงสุดต่อด่านไม่เกิน 70
- Easy: ประมาณ 12–30 Token สูงสุด
- Medium: ประมาณ 30–50 Token สูงสุด
- Hard: ประมาณ 52–70 Token สูงสุด
- Token ที่ได้จริงคำนวณจาก Accuracy 70% + Speed 30%
- แต่ละ Stage มี Max Token ไม่เท่ากัน

## 4. หลังจบด่าน
Classic และ Official แสดง:
- โค้ดใช้ทำอะไร
- ประโยชน์
- ผลลัพธ์/สิ่งที่ทำได้
- Code ที่เพิ่งพิมพ์
PVP ไม่แสดงคำอธิบายตามที่กำหนด

## 5. Item Set 2
เพิ่มไอเท็มประเภท:
- คฑา / Katana / Cyber Spear
- Samurai / Mage / Dragon Armor
- Code Cat / Neon Wolf / Siam Tiger / Mini Dragon
- Spirit Wings / Storm Aura

Item Set 2 ทุกชิ้นมี `baseCost` และ `cost = baseCost × 1.30`

## 6. ติดตั้ง
1. แตก ZIP แล้ว Upload ทุกไฟล์ที่ Root ของ GitHub
2. Firebase → Firestore → Rules
3. วาง `firestore.rules` V4.4 ทั้งหมด → Publish
4. รอ deploy แล้ว Ctrl+F5
