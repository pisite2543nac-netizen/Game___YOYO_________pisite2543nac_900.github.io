# V4.0 — Stable 2D Zone + Day/Night 3 Hours

## ทำไมภาพเดิมจึงไม่ทำงาน

อาการที่เห็นมี 2 แบบ:

1. `chat.html` ขึ้น `Missing or insufficient permissions`
2. `zone.html` ค้างที่ `กำลังตรวจสอบบัญชีและสถานะการเข้า Zone...`

นี่เกิดได้เมื่อ GitHub มีไฟล์คนละรุ่น เช่น Rules เป็น V3.9 แต่ `chat.html`
ยังเป็น V3.7 หรือ `zone.html` ใหม่แต่ `zone.js` ยังเก่า/ไม่ได้อัปโหลด

V4.0 แก้โดย:
- ใส่ Version Query `?v=4.0.0` ให้ CSS/JS
- `chat.html` เปลี่ยนเป็น Redirect เข้า Zone
- Zone มี Boot Diagnostics
- ถ้า Rules ผิด จะแจ้งขั้นตอนแก้ ไม่ค้างหน้าเปล่า

## กลางวัน / กลางคืน

สลับทุก:

```text
3 ชั่วโมง
```

ลำดับ:

```text
กลางวัน 3 ชม.
กลางคืน 3 ชม.
กลางวัน 3 ชม.
กลางคืน 3 ชม.
...
```

ใช้เวลาจาก Epoch เดียวกัน ทำให้ทุก User เห็นช่วงเวลาเดียวกัน

ด้านบน Zone มี:
```text
☀️ กลางวัน
เปลี่ยนใน 02:14:38
```

หรือ:
```text
🌙 กลางคืน
เปลี่ยนใน 01:42:11
```

## ความเสถียร Firebase

V3.9 เคยส่ง:
- position
- presence
- public profile

ถี่พร้อมกันระหว่างเดิน

V4.0 เปลี่ยนเป็น:
- Position สูงสุดประมาณ 1 ครั้ง / 260 ms ขณะเดิน
- Presence ทุก 30 วินาที
- Public Profile เฉพาะตอนเข้า Zone หรือเปลี่ยนไอเท็ม
- ส่งตำแหน่งสุดท้ายทันทีเมื่อปล่อยปุ่มเดิน

ช่วยลด Firestore writes จำนวนมาก

## สำคัญมาก — วิธี Upload

รอบนี้อย่า Replace ทีละ 1–2 ไฟล์

ให้อัปโหลด **ไฟล์ V4.0 ทั้งชุดที่ Root ของ GitHub**

อย่างน้อยต้องตรงกัน:

```text
index.html
admin.html
app.js
admin.js
style.css
zone.html
zone.js
chat.html
firebase-config.js
character-system.js
reward-data.js
firestore.rules
```

`chat.html` V4.0 เป็น Redirect ไป `zone.html`
จึงไม่มีห้องแชตเก่าค้างอีก

## Firebase Rules

ต้องทำ:

```text
Firebase
→ Firestore Database
→ Rules
→ ลบ Rules เดิมทั้งหมด
→ Copy firestore.rules จาก V4.0 ทั้งไฟล์
→ Publish
```

รอประมาณ 10–30 วินาทีแล้ว Reload หน้า Zone

## ถ้า Zone ยังไม่เข้า

V4.0 จะแสดง 5 ขั้น:

```text
1 ไฟล์ Zone
2 บัญชีผู้ใช้
3 ตัวละคร
4 Firebase Rules
5 Realtime World
```

จึงดูได้ทันทีว่าค้างตรงไหน

## Admin Kick / Ban

ยังอยู่ครบ:
- เตะ
- แบนเป็นนาที
- แบนเป็นชั่วโมง
- แบนเป็นวัน
- ปลดแบน
- เหตุผล
- Ban Until

Collection:
```text
zone_moderation
```

Rules V4.0 บังคับ Ban/Kick ฝั่ง Firestore ด้วย

## Zone ID ใหม่

V4.0 ใช้:

```text
thai_social_zone_v4
```

เพื่อไม่ดึงตำแหน่งค้างจาก Zone รุ่นเก่ามาปนกัน
