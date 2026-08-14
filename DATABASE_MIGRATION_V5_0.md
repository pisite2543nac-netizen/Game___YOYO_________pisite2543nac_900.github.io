# Database Migration V5.0

หลัง Deploy Functions:
Admin → สมาชิก User → กด `🔎 ตรวจ Auth / Database`

ถ้ามี Profile หาย:
กด `🛠️ ซ่อมฐานข้อมูล User`

ซ่อมโดยไม่ล้างข้อมูล:
- สร้าง Profile เฉพาะ Auth 8 หลักที่ users/{uid} หาย
- ไม่เปลี่ยน Password
- ไม่ reset Token / Inventory / Score / Progress
- จัดแผนกและสาขาวิชา
- sync public_profiles

ถ้า `AUTH หาย` ระบบรายงานแต่ไม่สร้าง Auth ใหม่อัตโนมัติ เพื่อไม่เปลี่ยน UID/Password โดยไม่ตั้งใจ
