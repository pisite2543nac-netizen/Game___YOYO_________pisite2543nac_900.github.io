# V4.1 — GM Exclusive Character + 24H Chat History

## 1. GM อยู่ใน 2D Zone

Admin UID:
```text
TWUrLjOh3BTa1cBNwDXKk4X2IAg1
```

เมื่อ Admin Login แล้วเปิด `zone.html`:
- ไม่ถูก Redirect กลับ Admin
- แสดงชื่อ `GM · GAME MASTER`
- Rank = GAME MASTER
- มี Crown / Admin Staff / Guardian Aura / Crimson Cape / System Core
- GM visual ถูกวาดจาก `ADMIN_UID` โดยตรง
- ไอเท็ม GM ไม่อยู่ใน `reward-data.js` จึงซื้อด้วย Token ไม่ได้
- User แต่งตามไม่ได้

หน้า Admin มีปุ่ม:
```text
🌙 เข้า 2D Zone · GM
```

## 2. แชต 2D Zone

ใน Zone มีปุ่ม:
```text
💬 แชต 24 ชม.
```

### User
ข้อความ User มี:
```text
isGM: false
createdAt: serverTimestamp()
expiresAt: เวลา + 24 ชั่วโมง
```

หน้า Zone จะไม่แสดงข้อความ User หลังครบ 24 ชั่วโมงทันที แม้ Firestore TTL จะยังลบเอกสารจริงไม่เสร็จ

### GM
ข้อความ GM มี:
```text
isGM: true
studentId: "GM"
```

ไม่มี `expiresAt` จึงเป็นข้อความถาวรจน GM ลบ

## 3. Admin Chat Log

Admin เพิ่ม Tab:
```text
💬 ประวัติแชต Zone
```

ดูได้:
- เวลา
- Student ID
- ชื่อจริงของ User
- ข้อความ
- เวลาที่เหลือก่อนหมดอายุ
- GM / USER
- ลบข้อความรายรายการ
- ล้างข้อความ User ที่หมดอายุ
- Export CSV

## 4. Firestore TTL — แนะนำให้เปิด

เพื่อให้เอกสาร User Chat ถูกลบอัตโนมัติจากฐานข้อมูล:

Google Cloud Console → Firestore → Time-to-live → Create Policy

```text
Collection group: zone_messages
TTL field: expiresAt
```

GM ไม่มี `expiresAt` ดังนั้น TTL จะไม่แตะข้อความ GM

หมายเหตุ: หน้าเว็บ V4.1 ซ่อน User Chat ทันทีที่ครบ 24 ชั่วโมงอยู่แล้ว การเปิด TTL เป็นการลบข้อมูลจริงในฐานข้อมูลอัตโนมัติ

## 5. Firebase Rules

ต้อง Publish `firestore.rules` V4.1 ใหม่ทั้งไฟล์

Rules ป้องกัน:
- User ปลอม `GM` ไม่ได้
- User สร้างข้อความได้เฉพาะ Student ID ของตัวเอง
- Rules บังคับ createdAt ให้เป็น Server Timestamp และจำกัด expiresAt ใกล้เคียง 24 ชั่วโมง (เผื่อ clock skew) ส่วนหน้าเว็บคำนวณอายุจาก createdAt จึงซ่อนครบ 24 ชั่วโมงพอดี
- เฉพาะ ADMIN_UID สร้างข้อความ GM ถาวรได้
- Kick / Ban ยังทำงานเหมือนเดิม

## 6. Upload GitHub

แนะนำอัปทับ **ทั้งชุด V4.1** ที่ Root ของ Repository

ไฟล์สำคัญ:
```text
index.html
admin.html
app.js
admin.js
zone.html
zone.js
style.css
firestore.rules
firebase-config.js
reward-data.js
character-system.js
```

หลัง Upload:
```text
Firebase → Firestore Database → Rules
Ctrl+A → วาง firestore.rules V4.1 → Publish
```

จากนั้นหน้าเว็บ:
```text
Ctrl + F5
```
