# V3.2 — Responsive UX/UI สำหรับทุกอุปกรณ์

## จุดประสงค์

V3.2 ไม่เปลี่ยนระบบ Firebase, Token, คะแนนทางการ 40 คะแนน หรือ Ranking
แต่ปรับ UX/UI ให้ใช้งานได้ดีทั้ง:

- Desktop
- Laptop
- Tablet
- Mobile แนวตั้ง
- Mobile แนวนอน

---

## Desktop / Laptop

- เกมเต็มพื้นที่หน้าจอ
- Code Editor เป็นพื้นที่หลัก
- Keyboard diagram และคำแนะนำอยู่ด้านขวา
- สถิติ 6 ช่องอยู่ด้านบน
- Code ยาว Scroll เฉพาะใน Editor
- หน้าเว็บหลักไม่ Scroll ระหว่างเล่น

เหมาะกับ Keyboard จริงมากที่สุด

---

## Tablet

- Layout ลดจาก 2 คอลัมน์เป็น 1 คอลัมน์เมื่อพื้นที่ไม่พอ
- ซ่อน Keyboard diagram เมื่อทำให้พื้นที่ Code แคบเกินไป
- ปุ่มและช่องกรอกมี Touch Target ใหญ่ขึ้น
- Stage / Mode / Language Cards ปรับตามความกว้าง

---

## Mobile

เกมใช้:

```css
height: 100dvh;
```

เพื่อรองรับ Browser UI ของ Android/iPhone ดีกว่า `100vh`

### ระหว่างเล่น

- เต็มจอด้วย CSS
- Header/Footer ถูกซ่อน
- Stats แบบ Compact
- Code Editor กินพื้นที่หลัก
- ซ่อน Keyboard diagram เพราะผู้ใช้มี Soft Keyboard อยู่แล้ว
- Bottom Toolbar ติดด้านล่าง:
  - `⌨️ พิมพ์ต่อ`
  - `📊 สถิติ`
  - `✕ ออก`

### Mobile Stats

กด `📊 สถิติ` จะแสดง Bottom Sheet:
- Stage
- Time
- WPM
- Accuracy
- Mistakes
- Token

ปิดแล้วกลับมาพิมพ์ต่อได้ทันที

### แนวนอน

เมื่อหมุนมือถือเป็นแนวนอน:
- Stats เรียง 6 ช่องในบรรทัดเดียว
- Topbar เตี้ยลง
- Editor มีพื้นที่แนวตั้งเพิ่ม
- Bottom toolbar เตี้ยลง

เหมาะกับการพิมพ์ Code มากกว่าแนวตั้ง

---

## iPhone / Safe Area

เพิ่ม:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
env(safe-area-inset-right)
```

จึงไม่วางปุ่มทับ:
- Dynamic Island
- Notch
- Home Indicator

---

## Touch Targets

ปุ่มสำคัญออกแบบขั้นต่ำประมาณ 44px ตามหลัก Mobile UX

และ input ใช้ font-size อย่างน้อย 16px เพื่อไม่ให้ iPhone Safari Zoom หน้าเองเมื่อแตะช่องกรอก

---

## Fullscreen

Desktop:
- ระบบพยายามใช้ Browser Fullscreen API

Mobile:
- ใช้ CSS `100dvh` เป็นหลัก
- เพราะ Fullscreen API บน Mobile Browser โดยเฉพาะ iOS มีข้อจำกัด

จึงยังได้หน้าตาเต็มจอโดยไม่พึ่ง Fullscreen API

---

## Admin บนมือถือ

- Dashboard Metrics เป็น 2 คอลัมน์
- Tabs เลื่อนซ้าย/ขวาได้
- Tabs ติดด้านบนเมื่อเลื่อน
- Tables เลื่อนแนวนอนเฉพาะตาราง
- ปุ่ม Admin ใหญ่ขึ้น
- Form เพิ่ม/แก้โจทย์กลายเป็น 1 คอลัมน์บนจอเล็ก

---

## ไฟล์ที่ต้อง Replace ใน GitHub

```text
index.html
admin.html
app.js
style.css
```

ไฟล์อื่นของ V3.1 ใช้เดิมได้

เพื่อความง่าย สามารถ Upload ZIP V3.2 ทั้งชุดทับ Repository เดิมได้เลย

---

## Firebase

V3.2 ไม่ได้เปลี่ยน Database Schema

ถ้าคุณใช้ `firestore.rules` V3.1 อยู่แล้ว:
- ไม่จำเป็นต้อง Publish Rules ใหม่เฉพาะเรื่อง Responsive
- แต่หาก Upload ทั้งชุด ก็สามารถใช้ rules ใน ZIP นี้ต่อได้
