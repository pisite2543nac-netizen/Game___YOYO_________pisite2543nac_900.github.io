# Code Typing Game — Realtime User + Admin

## สิ่งที่เพิ่มในเวอร์ชันนี้

### ระบบ User แบบบัญชีจริง
- หน้าเข้าสู่ระบบ
- หน้าลงทะเบียนผู้ใช้ใหม่
- ใช้เลขประจำตัวนักศึกษา + Password
- เลือกระดับชั้น
- เลือกห้อง / กลุ่ม
- แผนกวิชา
- Password + Confirm Password
- ข้อมูลสมาชิกเก็บใน Firestore collection `users`
- Firebase Authentication ใช้ Email/Password ภายใน
- ระบบแปลงเลขนักศึกษาเป็น Email ภายในอัตโนมัติ เช่น `12345@student.thc-nr.local`
  ผู้ใช้ไม่ต้องรู้หรือกรอก Email นี้

### หลัง Login
- เข้า User Panel
- เลือก Game Mode
- เลือก Level
- ดูสถิติของตัวเอง
- ประวัติผลเกมแบบ Realtime
- เล่น Classic / Speed / Accuracy / Hardcore

### Admin Realtime
Admin ใช้ Firestore `onSnapshot()` กับ
- users
- attempts
- levels
- game_modes

เมื่อ User สมัครใหม่:
1. Firebase Authentication สร้าง Account
2. Firestore สร้าง `users/{uid}`
3. Admin ที่เปิดอยู่ได้รับข้อมูลใหม่ทันที
4. ตัวเลขสมาชิกและตาราง User อัปเดตโดยไม่ต้อง Refresh

เมื่อผู้เล่นเริ่ม/จบเกม:
- attempts อัปเดต
- ตารางผลและ Dashboard Admin เปลี่ยนทันที

## Firebase Authentication ที่ต้องเปิด

Firebase Console > Authentication > Sign-in method

เปิด:
- Email/Password

Anonymous Authentication ไม่จำเป็นสำหรับ User รุ่นนี้แล้ว

Admin ยังคงใช้ Email/Password เดิม

## Firestore Rules

Copy ไฟล์ `firestore.rules` ไปที่:
Firestore Database > Rules > Publish

Admin UID:
`TWUrLjOh3BTa1cBNwDXKk4X2IAg1`

## Firestore Collections

- `users` สมาชิก
- `attempts` ผลการเล่น
- `levels` โจทย์
- `game_modes` โหมดเกม

## หมายเหตุการลบ User จาก Admin

หน้า Admin สามารถลบข้อมูลสมาชิกใน Firestore ได้ทันที
แต่การลบบัญชี Firebase Authentication ของ User รายอื่นจาก Browser ทำไม่ได้อย่างปลอดภัยด้วย Client SDK

หากต้องการ "ลบบัญชี Authentication" ด้วยปุ่มเดียวใน Admin จริง ๆ
ควรเพิ่ม Backend/Cloud Function ด้วย Firebase Admin SDK ในขั้นต่อไป
