# V5.0 — Restore User Access

## สาเหตุที่พบ
หน้า Login และ Register ของ V4.9.6 บังคับ `pattern=[0-9]+` และ `registerValid()` ใช้ `/^\d+$/`
ทำให้รหัส User แบบ `nkseza2000` ถูก Browser ปฏิเสธก่อน submit form

## แก้แล้ว
- User ID รองรับ A-Z / a-z / 0-9 / `_` / `-`
- ความยาว 3–40 ตัว
- รหัสถูก normalize เป็นตัวพิมพ์เล็กก่อนสร้าง synthetic email
- Login `nkseza2000` ทำงานได้
- สมัครด้วยรหัสตัวอักษร+ตัวเลขได้
- ถ้า Auth มีอยู่แต่ `users/{uid}` หาย ระบบสร้าง Profile ชั่วคราวให้อัตโนมัติและเปิดหน้าแก้ Profile
- ถ้าสมัคร Auth สำเร็จแต่สร้าง Firestore Profile ไม่สำเร็จ ระบบ rollback ลบ Auth ที่เพิ่งสร้าง เพื่อไม่ให้รหัสค้างจนสมัครซ้ำไม่ได้

## หลัง Login บัญชีที่ซ่อมอัตโนมัติ
ระบบจะเปิดหน้า “แก้ไขข้อมูลส่วนตัว” ให้เลือก:
- ชื่อ
- ระดับชั้น
- ห้อง
- แผนก
- สาขาวิชา

## Deploy
1. อัป ZIP V5.0 ทั้งชุดทับ GitHub Pages root
2. Publish `firestore.rules` ใน Firebase
3. Ctrl+F5 หรือ Incognito
4. ทดลอง `nkseza2000`
5. ทดลองสมัคร User ใหม่ 1 บัญชี
