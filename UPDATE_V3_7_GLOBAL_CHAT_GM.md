# V3.7 — ห้องแชตรวมทั้งหมด + GM

## ห้องใหม่

เพิ่ม:

```text
chat.html
chat.js
```

เป็นห้องแชตเดียวสำหรับผู้ลงทะเบียนทุกคน

## ชื่อที่แสดง

นักเรียน:
```text
6501234567
```

ใช้ `studentId` จาก Firebase `users/{uid}`

Admin:
```text
GM
```

ห้องแชตไม่ใช้ชื่อ-นามสกุลของนักเรียนเป็นชื่อผู้ส่ง

## ปุ่มเข้าแชต

หน้า User:
```text
💬 ห้องแชตรวม
```

หน้า Admin:
```text
💬 ห้องแชตรวม · GM
```

หน้า 2D Zone:
```text
💬 แชตรวม
```

## Realtime

ข้อความเก็บใน:

```text
global_messages
```

ทุกคนที่ Login อ่านได้แบบ Realtime

นักเรียนสร้างข้อความได้เฉพาะ:
- UID ของตัวเอง
- senderLabel ต้องตรงกับ studentId ใน `users/{uid}`
- senderType = student

Admin:
- senderLabel = GM
- senderType = gm

Rules จึงป้องกันนักเรียนปลอมชื่อเป็น GM

## การลบข้อความ

นักเรียน:
- ลบข้อความของตัวเองได้

GM:
- ลบข้อความใครก็ได้

## Online

ห้องแชตใช้ `presence` เดิม
ด้านซ้ายบน Desktop/Tablet จะแสดงสมาชิก Online

Mobile:
- ซ่อนรายชื่อสมาชิกเพื่อให้พื้นที่ข้อความใหญ่
- แชตและส่งข้อความได้เต็มระบบ

## ข้อความ

- สูงสุด 300 ตัวอักษร
- Enter = ส่ง
- Shift+Enter = ขึ้นบรรทัดใหม่
- โหลดข้อความล่าสุดสูงสุด 160 ข้อความ

## ไฟล์ที่ต้อง Replace

```text
index.html
admin.html
app.js
style.css
firestore.rules
zone.html
```

ไฟล์ใหม่:
```text
chat.html
chat.js
```

## สำคัญ Firebase

รอบนี้เพิ่ม Collection ใหม่:

```text
global_messages
```

ดังนั้นต้อง:

Firebase → Firestore Database → Rules
→ นำ `firestore.rules` V3.7 ไปวาง
→ Publish
