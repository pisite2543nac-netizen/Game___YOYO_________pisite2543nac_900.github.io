# V4.7 — Smooth Horizontal Zone + Wizard Quests + Token Shop

## 2D Zone
- กลับมาเดินซ้าย–ขวาเท่านั้น
- A / D และปุ่ม ◀ ▶
- ใช้ acceleration + deceleration ทำให้เริ่มเดินและหยุดนุ่มขึ้น
- ผู้เล่นคนอื่นใช้ interpolation ลดอาการกระตุก
- กล้องตามตัวละครแบบ easing
- Canvas HiDPI สูงสุด 2.5x
- กลางวัน/กลางคืนทุก 3 ชั่วโมง
- แชต User 24 ชั่วโมง / GM ถาวร

## พ่อมดภารกิจ
- อยู่ในฉากจริง
- เดินเข้าใกล้แล้วกด E หรือคลิกพ่อมด
- User ต้องกดรับก่อน
- สูงสุด 3 ภารกิจ/วัน
- จำนวนภารกิจที่รับค้างพร้อมกัน:
  Bronze 1 / Silver 1 / Gold 2 / Platinum 2 / Diamond 3 / Master 3
- Easy 2–5 Token
- Medium 10–15 Token
- Hard 15–20 Token
- ภารกิจรองรับ: ผ่านด่าน / จำกัดเวลา / Accuracy
- บนคอม: รับแล้วเด้งเข้าด่านทันที
- มือถือ/แท็บเล็ต: รับไว้ได้ แต่ยังคงกติกาเข้าเฉพาะ 2D Zone

## Admin
เพิ่ม Tab `🧙 ภารกิจครู`
ครูสร้าง/แก้ไข/ลบภารกิจได้ และมีปุ่มสร้างภารกิจตัวอย่าง 6 รายการ

## Token Shop
- อยู่ในฉาก
- เดินเข้าใกล้แล้วกด E หรือคลิกร้าน
- ซื้อ / สวม / ถอดได้
- ใช้ข้อมูล character.equipped เดียวกับ Profile จึงแสดงตรงกัน

## ต้อง Publish Rules
Firebase → Firestore Database → Rules → วาง firestore.rules V4.7 → Publish
