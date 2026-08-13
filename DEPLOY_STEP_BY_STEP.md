# ติดตั้ง V4.3 แบบทีละขั้น

## 1) GitHub Pages

แตก ZIP แล้วอัปโหลด **ทุกไฟล์** ไปที่ root ของ repository เดียวกันกับ `index.html`

ไฟล์หลักต้องเห็นประมาณนี้:

```text
index.html
admin.html
zone.html
chat.html
404.html
style.css
app.js
admin.js
zone.js
firebase-config.js
lessons.js
levels-html.js
levels-python.js
official-data.js
ranking-system.js
reward-data.js
character-system.js
default-data.js
firestore.rules
```

GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)`

## 2) Firebase Authentication

Firebase → Authentication → Sign-in method → `Email/Password` ต้องเป็น Enabled

## 3) Firestore Rules — สำคัญมาก

Firebase → Firestore Database → Rules

1. `Ctrl + A`
2. ลบ Rules เดิมทั้งหมด
3. Copy `firestore.rules` จาก V4.3 ทั้งไฟล์
4. Paste
5. กด `Publish`
6. รอ 10–30 วินาที

V4.3 เพิ่ม `zone_chat_archive` และแก้สิทธิ์ PVP ดังนั้นห้ามใช้ Rules รุ่นเก่า

## 4) Refresh

หลัง GitHub Pages Deploy เสร็จ:

- Windows: `Ctrl + F5`
- มือถือ: ปิดหน้าเว็บแล้วเปิดใหม่ หรือ Clear Website Data ถ้ายังค้างไฟล์เก่า

## 5) ทดสอบเร็ว

### Desktop User
- สมัคร / Login
- เลือกชายหรือหญิง
- HTML 50 / Python 50
- Classic Strict Typing
- โหมดทางการ 30 ด่าน
- Ranking

### PVP
เปิด 2 Browser / Incognito คนละ User:
- User A → สร้างห้อง
- User B → ค้นหาห้อง
- Host → เริ่ม
- ทั้งคู่ควรเห็น Progress Realtime
- คนพิมพ์ครบก่อนขึ้น WIN

### 2D Zone
- User เห็นชื่อเป็นรหัสนักศึกษา
- Admin เห็นชื่อ `GM`
- เดินซ้าย / ขวา
- Chat / Speech Bubble
- Token Shop
- กลางวัน / กลางคืนทุก 3 ชั่วโมง

### Admin
- User ใหม่ขึ้น Realtime
- ผลการเล่นขึ้น Realtime
- Kick / Ban / Unban
- Chat Archive

## 6) User Chat 24 ชั่วโมง

หน้า 2D Zone ซ่อนข้อความ User เมื่อครบ 24 ชั่วโมง
แต่ V4.3 จะเก็บสำเนาไว้ใน `zone_chat_archive` ซึ่งอ่านได้เฉพาะ Admin

ถ้าต้องการให้ Firestore ลบเอกสาร `zone_messages` ที่หมดอายุจริงอัตโนมัติ ให้ตั้ง TTL ที่ field `expiresAt` เพิ่มภายหลังได้ ส่วน Archive จะยังอยู่

## 7) มือถือ / แท็บเล็ต

- สมัครและ Login ได้
- ถ้ายังไม่เลือกตัวละคร จะให้เลือกก่อน
- หลังจากนั้นเข้าสู่ `2D Zone` อัตโนมัติ
- ไม่เปิดหน้าเรียน/PVP/Official บนอุปกรณ์มือถือและแท็บเล็ต
- Desktop ยังใช้ได้ทั้งหมด
