# V4.9.6 LIVE REPO FULL REPAIR

สร้างจาก ZIP GitHub repository ที่ผู้ใช้อัปมาโดยตรง

## Critical bugs ที่พบและแก้
1. `ranking-system.js` ไม่มี export `rankingClassKey` แต่ `app.js` และ `admin.js` import อยู่ -> Browser module โหลดไม่ขึ้น
2. `ranking-system.js` เรียก `rankTierFromRating()` แต่ไม่มีฟังก์ชัน -> Ranking พังเมื่อมี Attempt
3. `app.js` เรียก `rankingDepartmentKey()` และ `rankingMajorKey()` แต่ไม่ได้ import -> Portal/Leaderboard พังหลัง Login
4. `firebase.json` ชี้ `functions/` แต่ ZIP ไม่มีโฟลเดอร์ functions -> deploy Functions ไม่ได้
5. Cloud Function ลบ PVP ใช้ `array-contains` กับ `players` ที่เป็น map -> cleanup ห้อง PVP ไม่ถูกต้อง
6. Rank persistence ฝั่ง Admin ยังเก็บ diligence/consistency จากสูตรเก่า -> ปรับเป็น speed/accuracy/completionTime และสถิติใหม่

## สูตร Rank ที่คงไว้
- WPM 40%
- Accuracy 40%
- Completion Time 20%
- GM ไม่อยู่ใน Ranking

## วิธี Deploy
1. อัปไฟล์ทั้งหมดใน ZIP V4.9.6 ไปที่ GitHub Pages root
2. Firebase Console -> Firestore Rules -> วาง `firestore.rules` -> Publish
3. ที่เครื่องที่ติด Firebase CLI:
   `firebase login`
   `firebase use thc-nr`
   `firebase deploy --only functions`
4. GitHub Pages deploy เสร็จแล้วเปิด Incognito หรือ Ctrl+F5
5. ทดสอบ Register User ใหม่ -> Login -> แก้ Profile -> Portal -> 2D Zone

## หมายเหตุ
Static validation ตรวจได้ว่ารหัส JS parse ผ่าน, import/export ภายในโปรเจกต์ตรงกัน, HTML IDs หลักตรงกับ JS และ Functions folder ถูกต้อง
การยืนยัน Firebase runtime จริงต้องทดสอบหลัง Rules/Functions ถูก deploy ไป Project `thc-nr` แล้ว
