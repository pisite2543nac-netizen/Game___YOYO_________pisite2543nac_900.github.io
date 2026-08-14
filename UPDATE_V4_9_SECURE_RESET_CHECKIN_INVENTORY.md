# V4.9.5 — Secure Password Reset + Daily Fullscreen Check-in + Inventory 25

## Password
Firebase Authentication ไม่สามารถแสดงรหัสผ่านเดิมเป็นข้อความให้ Admin ดูได้ และโปรเจกต์นี้ไม่เก็บรหัสผ่าน Plaintext ใน Firestore/GitHub

V4.9.5 จึงเพิ่ม **ตั้งรหัสผ่านใหม่** ผ่าน Cloud Function `adminResetStudentPassword` ซึ่งตรวจ ADMIN_UID ก่อนเรียก Firebase Admin SDK

## Daily Check-in
- 1 ครั้งต่อวัน
- ต้องใช้งานครบ 60 นาที
- นับเฉพาะ heartbeat ตอนหน้าเว็บ Visible + Fullscreen
- ครบ 1 ชั่วโมงได้ 10 Token
- เก็บที่ `users/{uid}/daily_checkins/{YYYY-MM-DD}`
- Reward ถูกจ่ายจาก Cloud Function ฝั่งเซิร์ฟเวอร์

## Fullscreen
หลัง Login/สมัคร ระบบพยายามเข้า Fullscreen ทันที ถ้า Browser อนุญาต

## Rank
ยกเลิกการรีแรงค์อัตโนมัติตามรอบเวลาแล้ว
- Admin กดรีทันทีได้
- Admin กำหนดวัน/เวลาได้
- User เห็นประกาศและ Countdown

## Item Shop
- ไอเท็มเดิมทุกชิ้นลดราคาจาก V4.8 ลง 20%
- เพิ่ม เกราะ / มงกุฎ / คาถา / ดาบทอง / ดาบม่วง / มังกรทอง / แมว / เสือ / ลิง / นกฮูก / ผ้าคลุม / Aura
- กระเป๋า User จุสูงสุด 25 ไอเท็ม
- 2D Zone มีปุ่มกระเป๋า
- สวม/ถอดจากกระเป๋าได้
- ขายคืนร้านได้ 30% ของราคาขายปัจจุบัน

## Wizard Quests
พ่อมดมีภารกิจ Default พร้อมใช้ทันที 12 ภารกิจ แม้ Collection `teacher_quests` ยังว่าง

## Deploy เพิ่มจากเดิม
Static files: GitHub Pages
Firestore Rules: Firebase Firestore → Rules → Publish
Cloud Functions (จำเป็นสำหรับ Reset Password และ Daily Check-in):
```bash
npm install -g firebase-tools
firebase login
firebase use thc-nr
cd functions
npm install
cd ..
firebase deploy --only functions
```
Cloud Functions ต้องใช้ Node.js 20 ตาม `firebase.json`/`functions/package.json`.
