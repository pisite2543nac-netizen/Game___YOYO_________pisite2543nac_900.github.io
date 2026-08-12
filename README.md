# Code Typing Game V2 — Exam-style User + Admin

เวอร์ชันนี้ปรับโครงตามเว็บระบบสอบออนไลน์ต้นฉบับ

## User Flow

1. หน้าแรกแสดงคำชี้แจง
2. แบบฟอร์มลงทะเบียนยังคงมีเฉพาะ
   - ชื่อ-นามสกุล
   - เลขประจำตัวนักศึกษา
   - ชั้น/กลุ่มเรียน
   - แผนกวิชา
   - ยอมรับคำชี้แจง
3. ลงทะเบียนสำเร็จ → เข้า User Panel
4. User Panel แสดงสถิติของผู้ใช้
5. เลือก Game Mode
6. เลือก Level
7. เข้าเกมพิมพ์ Code
8. บันทึก Score / WPM / Accuracy / Mistakes / Time
9. ดูประวัติการเล่นและเลือกเล่น Level อื่นได้

## Admin Flow

หน้า `admin.html`

Login:
- Username: Pisit_2000
- Password: รหัสผ่านของบัญชี Firebase Authentication
- ตรวจสิทธิ์ Admin จาก Firebase UID ที่กำหนดไว้

เมนู:
1. ผลการเล่น
   - ดูทั้งหมด
   - ลบทีละรายการ
   - ลบทั้งหมด
   - Export CSV
2. ผู้ลงทะเบียน
   - ดูทั้งหมด
   - ลบทีละคน
   - ลบทั้งหมด
3. จัดการโจทย์ Code
   - เพิ่ม Level
   - แก้ไข Level
   - ลบ Level
   - กำหนดภาษา
   - Difficulty
   - Base Points
   - Time Limit
   - Difficulty Multiplier
   - Description
   - Code Text
   - คืนค่า 12 Level เริ่มต้น
4. สำรองข้อมูล
   - Export JSON
   - Import JSON

## Firebase Collections

- `players`
- `attempts`
- `levels`
- `game_modes`

## สำคัญก่อนเปิดใช้งาน

Firebase Authentication ต้องเปิด:
- Anonymous สำหรับ User
- Email/Password สำหรับ Admin

Firestore Rules:
นำไฟล์ `firestore.rules` ไป Publish ใน Firebase Console

Admin UID ถูกตั้งใน Rules และ `firebase-config.js` แล้ว
