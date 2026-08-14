# V4.9.5 — Typing Performance Ranking + No GM Rank

## สูตร Ranking ใหม่
ตัดคะแนน:
- ความขยัน
- ความสม่ำเสมอ

ออกจากสูตร Ranking

ใช้เฉพาะ:
- ความเร็ว WPM = 40%
- ความถูกต้อง Accuracy = 40%
- เวลาที่ใช้พิมพ์จนจบ = 20%

### Speed component
ใช้ WPM เฉลี่ยของ Attempt ที่ผ่าน
80 WPM ขึ้นไป = component ความเร็วเต็ม 100

### Accuracy component
ใช้ Accuracy เฉลี่ยโดยตรง
100% = component เต็ม 100

### Completion Time component
ยิ่งใช้เวลาน้อยยิ่งได้คะแนนสูง
ตัวอย่างโดยประมาณ:
- 90 วินาที = 100
- 180 วินาที = 50
- 360 วินาที = 25

Rating สุดท้าย:
`Speed × 0.40 + Accuracy × 0.40 + Fast Completion × 0.20`

## สถิติที่เก็บ/แสดง
- WPM เฉลี่ย
- WPM สูงสุด
- Accuracy เฉลี่ย
- Accuracy สูงสุด
- เวลาเฉลี่ย
- เวลาที่เร็วที่สุด
- จำนวน Attempt ที่ผ่าน
- Rating

## GM
GM ไม่มี:
- Rank
- Rating
- โล่ Rank
- อันดับ Ranking

ใน 2D Zone เหลือเพียงชื่อ `GM` และสถานะ Admin พิเศษ

## Ranking Scope เดิมยังอยู่
- รวมทั้งหมด
- แผนก
- สาขาวิชา
- ห้อง

ทุก Scope ใช้ Rating จากสูตรเดียวกัน
