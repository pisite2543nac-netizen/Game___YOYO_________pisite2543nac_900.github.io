# Code Typing Game V1 — Multi-language + Classic + PVP

## โครงสร้างการเรียนรู้

ผู้ใช้ Login แล้วเลือกภาษา:
- HTML
- CSS
- JavaScript
- Python

แต่ละภาษามี 3 ระดับเบื้องต้น:
- ง่าย
- ปานกลาง
- ยาก

แต่ละบทแสดง:
1. คำอธิบาย
2. วิธีการใช้งาน
3. ประโยชน์
4. ตัวอย่าง Code
5. Preview / Result
6. คำอธิบายผลลัพธ์

HTML / CSS / JavaScript ใช้ iframe Preview
Python แสดง Expected Terminal Output ในเวอร์ชันแรก

## Classic Solo

- เล่นคนเดียว
- เลือกภาษา
- เลือกง่าย / ปานกลาง / ยาก
- Timer เริ่มเมื่อพิมพ์ตัวแรก
- WPM
- Accuracy
- Mistakes
- Score
- บันทึก Firestore attempts

## PVP Realtime (Basic V1)

- สร้างห้อง
- Room Code 6 ตัว
- ผู้เล่นอีกคนเข้าห้อง
- จำกัด 2 คน
- Host กดเริ่ม
- พิมพ์ Code เดียวกัน
- Progress ของทั้งสองฝ่ายอัปเดตผ่าน Firestore Realtime
- คนพิมพ์ครบก่อนถูกบันทึกเป็น winnerUid
- เก็บผล PVP ใน attempts

## Firebase

เพิ่ม collection:
- pvp_rooms

ต้อง Publish `firestore.rules` เวอร์ชันนี้ใหม่

## ไฟล์ใหม่

- `lessons.js` เก็บข้อมูลบทเรียนแยกภาษา

ต่อไปสามารถเพิ่มภาษา C, C++, Java, C#, PHP, SQL ได้โดยเพิ่มข้อมูลใน `lessons.js`
