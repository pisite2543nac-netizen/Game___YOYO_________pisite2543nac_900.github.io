# V4.5 — Admin Classroom + Rank Reset Schedule + GM World Chat + PVP Countdown

## เพิ่มใน Admin
- Tab `🏫 แยกตามห้อง` เช่น ปวช.2/1
- แสดงโล่ Rank, จำนวนด่าน Classic ที่เล่น, Score ธรรมดารวม, Score ทางการ /40, อันดับ/Rating ในห้องและรวม, Token
- Ranking เลือกดูทุกห้องหรือรายห้องได้
- ปุ่ม `คำนวณ Rank ใหม่` และ `รีแรงค์ทันที`
- กำหนดวัน/เวลารีแรงค์พร้อมข้อความแจ้ง User
- User จะเห็น Banner และ Countdown ก่อนรีแรงค์
- หลังเวลาที่กำหนด การคำนวณ Rank จะใช้เฉพาะผลงานหลังเวลานั้น

## World Chat
- Admin พิมพ์คอมเมนต์จากหน้า Admin เข้า World Chat ได้
- ข้อความ GM เป็นถาวร
- ปุ่มเข้า World Chat เปิด 2D Zone พร้อมหน้าประวัติแชต

## PVP
- สร้างห้องเสีย 6 Token แบบไม่คืน
- ต้องมี Token พอสำหรับ `6 + เงินเดิมพัน` ตอนสร้าง
- เดิมพันเดิม 0/5/10/20/30/40/50 Token ยังอยู่
- เมื่อ Host กดเริ่ม ทุก Client ได้ Countdown 3-2-1-GO จาก timestamp เดียวกันก่อนเปิดช่องพิมพ์

## Firestore ใหม่
- `system_settings/ranking` ใช้เก็บวันรีแรงค์/ประกาศ
- `rank_reset_history` เก็บประวัติรีแรงค์จาก Admin

## ติดตั้ง
1. อัปโหลดไฟล์ทั้งหมดของ V4.5 ทับ Root GitHub Pages
2. Firebase → Firestore → Rules → วาง `firestore.rules` V4.5 ทั้งไฟล์ → Publish
3. รอ Deploy แล้ว Ctrl+F5
