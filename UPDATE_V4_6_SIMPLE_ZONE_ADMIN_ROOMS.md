# V4.7 — Simple Chat-Only 2D Zone + Admin Room Search

## 2D Zone
- ใช้สำหรับเดินพบกันและพูดคุยเท่านั้น
- WASD / Arrow Keys ครบ 4 ทิศ
- เดินทแยงได้
- Remote player interpolation เพื่อให้การเดินลื่นกว่าเดิม
- Canvas HiDPI สูงสุด 2.5x เพื่อให้ภาพคม
- กลางวัน/กลางคืนทุก 3 ชั่วโมง
- Admin = GM
- User = รหัสนักศึกษา
- ชุดที่ User สวมแสดงบนตัวละคร
- User Chat 24 ชั่วโมง / GM ถาวร
- ส่งข้อความก่อน แล้วค่อย Archive แยก ทำให้ Archive ขัดข้องไม่ทำให้ User พูดไม่ได้

## Admin ห้องเรียน
ค้นหาได้ เช่น:
- ปวช2/1
- ปวช.2/1
- ปวส1/1

กดห้องแล้วแสดงเฉพาะห้องนั้น และเรียงตามรหัสนักศึกษาจากน้อยไปมาก

## การติดตั้ง
อัปไฟล์ทั้งหมดใน ZIP ทับ Root ของ GitHub Pages

จากนั้น:
Firebase → Firestore Database → Rules → วาง `firestore.rules` V4.7 → Publish

รอ GitHub Pages deploy แล้วกด Ctrl+F5
