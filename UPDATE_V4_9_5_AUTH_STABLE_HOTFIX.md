# V4.9.5 — Authentication Stable Hotfix

## ปัญหาที่พบใน V4.9.4
ใน `ensureProfileDefaults()` มีการใช้ตัวแปร `academicProfileComplete`
ในกรณี User เก่าไม่มี `department` หรือ `major` แต่ตัวแปรไม่ได้ประกาศ

ผลที่เกิดได้:
- Firebase Authentication Login สำเร็จ
- แต่ JavaScript พังตอนโหลด Profile
- หน้าเว็บจึงกลับไปหน้า Login
- ผู้ใช้เห็นเหมือน Login ไม่ได้

อีกจุดคือ Login/Register และ `onAuthStateChanged` สามารถเรียก
`routeAuthenticatedStudent()` พร้อมกันได้

## V4.9.5 แก้แล้ว
- ประกาศและจัดการข้อมูล Academic legacy อย่างปลอดภัย
- ใช้ Single-flight `authRoutePromise`
- รอ `users/{uid}` สูงสุด 6 วินาทีหลัง Registration
- Register สร้าง Firestore Profile ทันทีหลัง Auth account
- Login แสดง Error จริงแยก Auth / Firestore Rules / Missing Profile
- `onAuthStateChanged` ไม่แย่ง Route กับปุ่ม Login/Register
- User เก่าที่ไม่มีแผนก/สาขาวิชาเข้า Portal ได้และแก้ข้อมูลภายในได้

## หลังอัป
1. อัปทุกไฟล์ V4.9.5 ทับ GitHub Pages root
2. Firebase → Firestore Database → Rules
3. วาง `firestore.rules` จาก V4.9.5 แล้ว Publish
4. รอ GitHub Pages Deploy
5. เปิดหน้าเว็บด้วย Incognito หรือ Ctrl+F5
6. ทดลอง User เก่า Login
7. ทดลองสร้าง User ใหม่ 1 บัญชี

หากบัญชี Authentication มีอยู่ แต่ `users/{uid}` ถูกลบไปแล้ว
หน้า Login จะแจ้งชัดเจนว่าให้ Admin ลบบัญชีเดิมทั้ง Auth + DB แล้วสมัครใหม่
