# V3.4 — ผู้เล่นในระบบ + Top 10 + โล่ Rank + 2D Social Zone

## หน้า User
เพิ่ม `ผู้เล่นในระบบ` โดยแสดงชื่อ, Online/Offline และ Rank แบบ Realtime โดยไม่เปิดข้อมูลส่วนตัวอื่นของบัญชี

เพิ่ม `Ranking 1–10` ตาม Rating ของ Season 60 วัน พร้อมโล่ Bronze / Silver / Gold / Platinum / Diamond / Master

เพิ่มปุ่ม `เข้า 2D Zone`

## 2D Zone
ไฟล์ใหม่:
```text
zone.html
zone.js
```

เวอร์ชันนี้เป็น Multiplayer Prototype ที่ใช้งานได้:
- WASD / Arrow Keys
- Camera ติดตามผู้เล่น
- Collision กับอาคาร
- Firestore Realtime Position
- เห็นผู้เล่นคนอื่น
- ชื่อ + Rank Shield เหนือตัวละคร
- รายชื่อผู้เล่นใน Zone ด้านขวา
- จำตำแหน่งล่าสุด

ตัวละครเป็น Placeholder ก่อน เพื่อรอ Reference Character/Sprite ของจริง

## Firestore Collections ใหม่
```text
public_profiles
presence
zone_positions
```

`public_profiles` เก็บเฉพาะข้อมูลที่ใช้โชว์ใน Community เช่นชื่อและ Rank ไม่ใช้ document `users` สำหรับเปิดข้อมูลทั้งหมดให้คนอื่นอ่าน

## ต้องอัป GitHub
Replace:
```text
index.html
app.js
style.css
firestore.rules
```

เพิ่ม:
```text
zone.html
zone.js
```

## สำคัญ
รอบนี้ต้องนำ `firestore.rules` V3.4 ไป Firebase Console > Firestore Database > Rules > Publish เพราะมี Collection ใหม่

URL Zone:
```text
.../zone.html
```
