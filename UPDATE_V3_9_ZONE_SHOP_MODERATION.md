# V3.9 — 2D Zone กลับมา + Token Shop ใน Zone + GM Kick/Ban

## Community หลัก

เปลี่ยนจาก `ห้องแชตรวม` กลับเป็น:

```text
2D Zone
```

ลบ:
```text
chat.html
chat.js
```

เพิ่มกลับ:
```text
zone.html
zone.js
```

## 2D Zone

ฟังก์ชัน:
- ธีมหมู่บ้านไทยกลางคืน
- เดินซ้าย / ขวา
- A / D และลูกศรซ้าย / ขวา
- ผู้เล่น Realtime ผ่าน Firestore
- ชื่อเหนือหัวใช้ “รหัสนักศึกษา”
- Rank Shield
- Speech Bubble Chat
- คลิกผู้เล่นเพื่อดู Rank + ไอเท็มที่สวม
- ตัวละครชาย / หญิงจาก Character Setup
- ไอเท็มที่สวมจะแสดงบนตัวละคร

## Token Shop อยู่ใน Zone

เปิดได้ 2 วิธี:
1. ปุ่ม `🛒 ร้านค้า` ด้านบน
2. คลิกอาคาร `TOKEN SHOP` ในฉาก

ทำได้:
- ดู Token
- ซื้อไอเท็ม
- สวมใส่
- ถอด
- เปลี่ยนไอเท็ม Slot เดียวกัน
- Mythic มีเอฟเฟกต์ใหญ่กว่า Common

## Admin — ควบคุม 2D Zone

เพิ่ม Tab:

```text
🌙 ควบคุม 2D Zone
```

เห็น User ทั้งหมด พร้อม:
- รหัสนักศึกษา
- ชื่อ
- Rank
- Online / Offline / Banned
- เวลาเห็นล่าสุด
- Ban Until
- เหตุผล
- ระยะเวลา
- เตะ
- แบน
- ปลดแบน

### เตะ

ปุ่ม:
```text
เตะ
```

ระบบสร้างช่วง Kick ประมาณ 15 วินาที
User ที่เปิด Zone อยู่จะถูกนำออกจาก Zone
จากนั้นสามารถกลับเข้าได้เมื่อช่วง Kick หมด

### แบนแบบกำหนดเวลา

Admin ใส่:
```text
30 + นาที
2 + ชั่วโมง
7 + วัน
```

แล้วกด:
```text
แบน
```

Firestore เก็บ:
```text
zone_moderation/{uid}.bannedUntil
```

เมื่อครบเวลา ระบบปลดสิทธิ์แบนโดยธรรมชาติ เพราะ Rules ตรวจเวลาปัจจุบัน

Admin สามารถกด:
```text
ปลดแบน
```

ได้ก่อนครบเวลา

## Security

รอบนี้ Firestore Rules บังคับสิทธิ์ Zone ด้วย

User ที่กำลังถูก:
- Kick
- Ban

จะไม่สามารถ:
- อ่านตำแหน่ง Player ใน Zone
- ส่งตำแหน่ง
- อ่าน Speech Bubble
- ส่ง Speech Bubble

ดังนั้นไม่ใช่เพียงซ่อนด้วย JavaScript

## Firestore Collections

ใช้:
```text
zone_positions
zone_messages
zone_moderation
presence
public_profiles
users
```

## ไฟล์ที่ต้อง Replace

```text
index.html
app.js
admin.html
admin.js
style.css
firestore.rules
```

เพิ่ม:
```text
zone.html
zone.js
```

ลบ:
```text
chat.html
chat.js
```

## สำคัญ

รอบนี้ต้อง Publish Firestore Rules ใหม่:

```text
Firebase
→ Firestore Database
→ Rules
→ วาง firestore.rules V3.9
→ Publish
```
