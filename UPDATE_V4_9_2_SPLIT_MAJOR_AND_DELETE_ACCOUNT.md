# V4.9.5 — แยกสาขาวิชา + ลบ User จริง

## การจัดข้อมูลสาขาวิชาเดิม
- ธุรกิจดิจิทัล / ธุรกิจดิทัล → `ธุรกิจดิจิทัล`
- สารสนเทศ / เทคโนโลยีสารสนเทศ → `เทคโนโลยีสารสนเทศ`
- ข้อความอื่นหรือข้อความผสม → เก็บเป็นสาขาวิชาแยกตามข้อความเดิม ไม่เดารวมเข้ากับ 2 กลุ่มหลัก
- ถ้าข้อมูลสาขาเคยถูกใส่ไว้ใน `department` ระบบย้าย `department` เป็น `คอมพิวเตอร์`

## การสมัครใหม่
สาขาวิชาหลักมี 2 ตัวเลือก:
- เทคโนโลยีสารสนเทศ
- ธุรกิจดิจิทัล

ทั้งสองสาขากำหนดแผนก `คอมพิวเตอร์` อัตโนมัติ

## การลบ User ใน Admin
ปุ่มลบราย User ใช้ Cloud Function `adminDeleteStudentAccount`
และลบทั้ง:
- Firebase Authentication
- users + daily_checkins
- public_profiles
- presence
- zone_positions / moderation
- official_submissions
- rankings
- quest_progress
- attempts
- zone_messages / archive
- ห้อง PVP ที่ค้าง

หลังลบ Authentication แล้ว synthetic email ของรหัสนักศึกษาจะว่าง จึงสมัครด้วยรหัสเดิมใหม่ได้

## ติดตั้ง
ต้อง Deploy Cloud Functions ใหม่:
`firebase deploy --only functions`
