# V3 — Token + Official 30 Stages + Ranking 60 Days

## สิ่งที่เปลี่ยน

### 1. User เห็นเฉพาะ Token
หน้า User ไม่แสดงคะแนนการศึกษาอีกแล้ว

User เห็น:
- Token สะสม
- WPM
- Accuracy
- Rank
- Progress

คะแนน “ทางการ” จะเก็บสำหรับครูและแสดงเฉพาะ Admin

---

## 2. ปุ่ม “ทางการ”

ในหน้าเลือก Mode มี:
- Classic
- ทางการ
- PVP

โหมดทางการ:
- 30 ด่าน
- คะแนนเต็มรวม 100 คะแนน
- คะแนนแต่ละด่านไม่เท่ากัน
- ทำด่านได้เรื่อย ๆ
- คะแนนไม่โชว์หน้า User
- เมื่อทำครบ 30 ด่าน ปุ่ม `ส่งงานทางการให้ครู` จะเปิด
- ต้องกดปุ่มนี้เท่านั้น จึงสร้าง `official_submissions/{uid}`
- Admin จะเห็นคะแนน /100

---

## 3. Admin เพิ่ม Tab

- `คะแนนทางการ`
- `Ranking`

คะแนนทางการแสดง:
- วันส่ง
- เลขนักศึกษา
- ชื่อ
- ชั้น/ห้อง
- แผนก
- ทำครบกี่ด่าน
- คะแนน /100
- Accuracy เฉลี่ย
- WPM เฉลี่ย

---

## 4. Ranking Season 60 วัน

สูตรเบื้องต้น:

```text
35% ความขยัน
30% ความแม่นยำ
20% ความเร็ว
15% ความสม่ำเสมอ
```

ความขยันพิจารณา:
- จำนวน Attempt ที่เล่นสำเร็จ
- จำนวนวันที่กลับมาใช้งาน

ความแม่นยำ:
- Average Accuracy

ความเร็ว:
- Average WPM เทียบ Reference 80 WPM

ความสม่ำเสมอ:
- Accuracy แกว่งน้อย
- มีจำนวนรอบเล่นมากพอ

Tier:
- Bronze
- Silver
- Gold
- Platinum
- Diamond
- Master

Season เปลี่ยนทุก 60 วันโดยอิงวันที่จาก 1 มกราคม 2026

หมายเหตุ:
GitHub Pages ไม่มี Server Cron
ดังนั้น “ตัด Season” ใช้วันที่ปัจจุบันคำนวณอัตโนมัติ
ส่วนการบันทึก Snapshot Ranking ลง collection `rankings`
Admin กด `คำนวณ Rank ใหม่`

ถ้าต้องการให้ระบบบันทึก Re-rank เองแม้ไม่มีใครเปิดหน้าเว็บ
ต้องใช้ Firebase Cloud Functions / Scheduler ในขั้นต่อไป

---

## 5. Firestore Collections ใหม่

```text
official_submissions
rankings
```

ยังใช้:
```text
users
attempts
pvp_rooms
```

---

## 6. ไฟล์ใหม่ที่ต้อง Upload

```text
official-data.js
ranking-system.js
MIGRATION_V2_TO_V3.js
```

## ไฟล์ที่ต้อง Replace

```text
index.html
app.js
admin.html
admin.js
style.css
firestore.rules
```

ไฟล์ 100 ด่านเดิมยังใช้:
```text
levels-html.js
levels-python.js
lessons.js
reward-data.js
character-system.js
firebase-config.js
```

---

## 7. Firebase

หลัง Upload GitHub แล้ว:
Firebase Console
→ Firestore
→ Rules
→ นำ `firestore.rules` V3 ไปวาง
→ Publish


---

## การย้าย Token จาก V2

ถ้า User เก่ามี:

```text
pointsBalance
pointsLifetime
```

เมื่อ Login V3 ครั้งแรก ระบบจะนำค่าเดิมมาเติม:

```text
tokenBalance
tokenLifetime
```

ดังนั้น Token ที่สะสมจากระบบเดิมไม่หาย

## การเปลี่ยน Season

เมื่อ User Login:
- ระบบคำนวณ Season จากวันที่ปัจจุบัน
- ถ้าครบช่วง 60 วัน `seasonId` จะเปลี่ยนอัตโนมัติ
- Rank ใหม่จะคำนวณจากกิจกรรมภายใน Season ใหม่นั้น
- Admin Dashboard คำนวณ Ranking ของ Season ปัจจุบันแบบ Live จากข้อมูล attempts
