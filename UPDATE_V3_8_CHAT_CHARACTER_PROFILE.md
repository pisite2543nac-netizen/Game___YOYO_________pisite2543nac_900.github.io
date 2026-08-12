# V3.8 — Chat + Character Profile + Token Fashion

## เปลี่ยนจาก 2D Zone เป็นห้องแชต

V3.8 ใช้:
```text
chat.html
```
เป็นพื้นที่พบปะหลัก

ลบ:
```text
zone.html
zone.js
```

## หลังลงทะเบียน

User ใหม่จะต้องเลือก:
```text
ชาย / หญิง
```

User เก่าที่ยังไม่เคยเลือกก็จะถูกถามเมื่อ Login ครั้งแรกหลังอัป V3.8

## หน้า User

เพิ่ม:
```text
🧍 ดูตัวละคร
💬 ห้องแชตรวม
```

กดดูตัวละครจะเห็น Wardrobe และสามารถสวม/ถอดไอเท็มได้

## Token Fashion

Tier:
```text
COMMON
RARE
EPIC
LEGENDARY
MYTHIC
```

ยิ่งแพงยิ่งมี Visual Effect มากขึ้น เช่น:
```text
250      หมวกธรรมดา
1,600    Cyber Jacket
3,500    มงกุฎทอง
5,000    Gold Aura
7,500    ปีกมังกร
9,000    Master Halo
12,000   Phoenix Pet
18,000   Code Emperor Throne
```

## Slot

แต่ละตำแหน่งใส่ได้ 1 ชิ้น:
```text
head
face
top
bottom
shoes
back
hand
aura
pet
```

## ห้องแชต

ยังคงกติกา:
- Student แสดงชื่อเป็นรหัสนักศึกษา
- Admin = GM
- Realtime
- GM ลบข้อความได้

และเพิ่ม:
- กดสมาชิกในรายชื่อห้องแชต
- เปิดดู “ตัวละคร” ของคนนั้น
- เห็นเพศ ตัวละคร Rank และชุด/เอฟเฟกต์ที่สวม

## GitHub

Replace:
```text
index.html
app.js
style.css
reward-data.js
character-system.js
chat.html
chat.js
```

ลบ:
```text
zone.html
zone.js
```

Firebase Rules ใช้ V3.7 เดิมได้ เพราะ V3.8 ไม่เพิ่ม Collection ใหม่
