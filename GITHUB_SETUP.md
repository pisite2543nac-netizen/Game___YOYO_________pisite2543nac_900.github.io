# วิธีติดตั้งแบบทีละขั้น

## A. Firebase

### 1. สร้าง Project
Firebase Console > Create project

### 2. เปิด Authentication
Build > Authentication > Get started > Sign-in method

เปิด:
- Anonymous
- Email/Password

Anonymous ใช้สำหรับผู้เล่น
Email/Password ใช้สำหรับ Admin

### 3. สร้าง Admin
Authentication > Users > Add user

ตัวอย่าง:
```text
Email: teacher@example.com
Password: ตั้งรหัสของคุณ
```

### 4. สร้าง Firestore
Build > Firestore Database > Create database

### 5. สร้าง Web App
Project Settings > General > Your apps > Web </>

Firebase จะแสดงข้อมูลแบบ:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 6. สร้าง firebase-config.js
Copy:
```text
firebase-config.example.js
```

เปลี่ยนชื่อเป็น:
```text
firebase-config.js
```

เอาค่า firebaseConfig ของจริงมาใส่

และเปลี่ยน:
```js
export const ADMIN_EMAILS = [
  "teacher@example.com"
];
```
ให้ตรงกับ Email Admin ของคุณ

### 7. ตั้ง Firestore Rules
เปิด:
```text
firestore.rules
```

ค้นหา:
```text
teacher@example.com
```

เปลี่ยนเป็น Admin Email ของคุณ

จากนั้น:
Firebase Console > Firestore Database > Rules

Copy กฎทั้งหมดไปวาง > Publish

---

## B. ขึ้น GitHub

เข้า Repository เดิม หรือสร้าง Repository ใหม่

อัปไฟล์:
```text
index.html
admin.html
style.css
app.js
admin.js
default-data.js
firebase-config.js
README.md
firestore.rules
```

จากนั้น:
Settings > Pages

ตั้ง:
```text
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

กด Save

รอ GitHub Pages Deploy

---

## C. สร้าง 12 Level ครั้งแรก

1. เปิดเว็บที่ Deploy แล้ว
2. เข้า:
```text
/admin.html
```
3. Login ด้วย Email/Password Admin
4. กด:
```text
จัดการโจทย์ Code
```
5. กด:
```text
คืนค่า 12 Level เริ่มต้น
```

ระบบจะสร้าง:
- game_modes
- levels

ลง Firestore ให้ทันที

จากนั้นกลับหน้าผู้เล่น จะเห็น 4 Mode และ 12 Level จาก Firestore

---

## D. Collection ใน Firestore

```text
players
attempts
levels
game_modes
```

`players` = ข้อมูลผู้ลงทะเบียน

`attempts` = ผลการเล่น

`levels` = โจทย์ Code

`game_modes` = โหมดเกม
