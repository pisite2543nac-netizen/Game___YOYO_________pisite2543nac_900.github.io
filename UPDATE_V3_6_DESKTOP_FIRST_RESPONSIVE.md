# V3.6 — Desktop-first Responsive Social Zone

เวอร์ชันนี้ยึด “คอมพิวเตอร์เป็นแพลตฟอร์มหลัก”
แต่รองรับ Tablet และ Mobile โดยไม่ตัดระบบออก

## Desktop / Laptop

เป็นเวอร์ชันเต็ม:
- HUD ครบ
- ชื่อ / Rank / Online
- ฉาก 2D กว้างที่สุด
- Chat กลางด้านล่าง
- ปุ่มเดินซ้าย/ขวาเต็มขนาด
- คลิกตัวละครดูของสะสม
- เหมาะกับ 1366×768, 1440×900, 1920×1080

## Tablet

- ลดความสูง Topbar
- Chat และปุ่มเดินใหญ่พอสำหรับ Touch
- Profile Card ยังอยู่ด้านขวา
- รองรับแนวตั้ง/แนวนอน
- Canvas ขยายเต็มพื้นที่ที่เหลือ

## Mobile

- ใช้ `100dvh`
- ใช้ Safe Area ของ iPhone/Android
- Topbar แบบ Compact
- แสดง Online Count แบบย่อ
- ปุ่มซ้าย/ขวาขนาดใหญ่
- Chat อยู่ด้านล่าง
- Profile Player เปิดแบบ Bottom Card
- Gender Setup ปรับให้พอดีจอ
- รองรับ Keyboard มือถือผ่าน VisualViewport API
- เมื่อ Keyboard เปิด Canvas จะปรับตามพื้นที่ที่เหลือ

## Controls

Desktop:
```text
A / ← = เดินซ้าย
D / → = เดินขวา
Enter = โฟกัสช่อง Chat
```

ทุกอุปกรณ์:
```text
[ ◀ ] [ พิมพ์ข้อความ ][ พูด ] [ ▶ ]
```

## ไฟล์ที่ต้อง Replace

```text
zone.html
zone.js
style.css
```

ไฟล์ระบบ Firebase / Token / Ranking / PVP / Admin
ใช้ของ V3.5 เดิมทั้งหมด

## Firebase Rules

V3.6 ไม่เพิ่ม Collection ใหม่
หากใช้ `firestore.rules` จาก V3.5 และ Publish แล้ว
ไม่ต้องเปลี่ยน Rules เพราะ Responsive
