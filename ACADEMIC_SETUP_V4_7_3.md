# V4.7.5 — Academic Hierarchy / nr-game-code

Firebase Project: `nr-game-code`
Admin UID: `Y2uDV9yAQ6Mpu2qwQH9cG4ko6ZQ2`

## Registration
ระดับชั้น:
- ปวช.1 / ปวช.2 / ปวช.3
- ปวส.1 / ปวส.2

ห้อง:
- /1 ถึง /6

แผนก:
- คอมพิวเตอร์
- อิเล็กทรอนิค

สาขาวิชา:
- เทคโนโลยีสารสนเทศ → ทส.
- เทคโนโลยีธุรกิจดิจิทัล → ทธ.
- คอมพิวเตอร์ธุรกิจ → คธ.

ถ้าเป็น ปวส. ระบบเพิ่ม `ส.` หน้ารหัสอัตโนมัติ:
- (ส.ทส.)
- (ส.ทธ.)
- (ส.คธ.)

## Firestore fields
- educationLevel
- classroom
- classKey
- department
- major
- majorCode
- academicKey

## Admin
เพิ่มเมนู `ชั้น / ห้อง / แผนก / สาขา` สำหรับกรองพร้อมกัน 4 ระดับ และ Ranking มี Filter ระดับ/ห้อง/แผนก/สาขา

## Deploy
1. อัป ZIP ไป GitHub Root
2. Firebase Project ต้องเป็น `nr-game-code`
3. Firestore Rules → Publish firestore.rules จากชุดนี้
4. GitHub Actions ต้อง Success
5. เปิด Incognito / Ctrl+F5
