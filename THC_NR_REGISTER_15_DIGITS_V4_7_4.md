# V4.7.5 — THC-NR / Academic Register / Student ID 1–15 หลัก

Firebase Project: `thc-nr`
Admin UID: `TWUrLjOh3BTa1cBNwDXKk4X2IAg1`

เลขประจำตัวนักศึกษา:
- ตัวเลขเท่านั้น
- 1–15 หลัก
- ใช้ทั้งหน้า Register และ Login

ตัวอย่าง:
- 11111111
- 650123456789
- 123456789012345

Internal Firebase email:
`<studentId>@student.thc-nr.local`

หน้าลงทะเบียนยังมี:
- ระดับชั้น
- ห้อง / กลุ่ม
- แผนก: คอมพิวเตอร์ / อิเล็กทรอนิค
- สาขาวิชา:
  - เทคโนโลยีสารสนเทศ (ทส.)
  - เทคโนโลยีธุรกิจดิจิทัล (ทธ.)
  - คอมพิวเตอร์ธุรกิจ (คธ.)

ถ้าเป็น ปวส.:
- (ส.ทส.)
- (ส.ทธ.)
- (ส.คธ.)

Admin ยังแยกและกรองข้อมูลตาม:
ระดับชั้น → ห้อง → แผนก → สาขาวิชา

## Deploy
1. อัป ZIP นี้ไป GitHub Root
2. Firebase Console เลือก Project `thc-nr`
3. Firestore Rules → วาง `firestore.rules` จากชุดนี้ → Publish
4. รอ GitHub Pages Deploy = Success
5. เปิด Incognito หรือ Ctrl+F5
