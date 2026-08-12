# Code Typing Game — GitHub Pages + Firebase

เวอร์ชันนี้ออกแบบตามโครงเว็บสอบออนไลน์เดิม:
- หน้าผู้เล่น: คำชี้แจง → ลงทะเบียน → เริ่มกิจกรรม → จับเวลา → บันทึกผล
- หน้า Admin แยก
- Firebase Firestore เป็นฐานข้อมูลกลาง
- อัปขึ้น GitHub Pages ได้โดยตรง
- ไม่ใช้ Python/Flask บนเซิร์ฟเวอร์ เพราะ GitHub Pages เป็น Static Hosting

## ไฟล์

```text
index.html
admin.html
style.css
app.js
admin.js
default-data.js
firebase-config.example.js
firestore.rules
README.md
GITHUB_SETUP.md
```

## สิ่งที่มี

### ผู้เล่น
- ลงทะเบียนชื่อ
- เลขนักศึกษา
- ชั้น/กลุ่ม
- แผนก
- เลือก Game Mode
- เลือก Level
- Classic Mode
- Speed Rush
- Accuracy Pro
- Hardcore
- Code Typing
- WPM
- Accuracy
- Mistakes
- Score
- Timer
- Keyboard Highlight
- บันทึกผล Firestore

### Admin
- Firebase Authentication Email/Password
- Dashboard
- จำนวนโจทย์
- จำนวนผู้ลงทะเบียน
- จำนวนรอบที่สำเร็จ
- คะแนนเฉลี่ย
- ดูผลทั้งหมด
- ลบผล
- ดูผู้ลงทะเบียน
- ลบผู้ลงทะเบียน
- เพิ่ม/แก้ไข/ลบ Level
- คืนค่า 12 Level
- Export CSV
- Export JSON
- Import JSON

## สำคัญ

ก่อนใช้งาน ต้องตั้งค่า:
1. Firebase Authentication: เปิด Anonymous และ Email/Password
2. Firestore Database
3. Firebase Web App
4. firebase-config.js
5. firestore.rules
6. Admin Email ให้ตรงกันทั้ง firebase-config.js และ firestore.rules
