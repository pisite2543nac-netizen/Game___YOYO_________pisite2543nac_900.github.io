# UPDATE V2 — ต้องเอาไฟล์ไหนขึ้น GitHub

ให้ Replace ไฟล์เดิมใน Repository ด้วยไฟล์ต่อไปนี้:

## ต้องแทนไฟล์เดิม
- `index.html`
- `app.js`
- `style.css`
- `lessons.js`
- `admin.html`
- `admin.js`
- `firestore.rules`

## ไฟล์ใหม่ ต้อง Upload เพิ่ม
- `levels-html.js` — HTML 50 ด่าน
- `levels-python.js` — Python 50 ด่าน
- `reward-data.js` — ร้านแลกของ
- `character-system.js` — โครงข้อมูลตัวละคร + Zone 2D

## ไฟล์เดิมที่คงไว้
- `firebase-config.js`
- `default-data.js`

---

# ระบบ Strict Typing

Classic V2 ไม่ใช้วิธีปล่อยให้ textarea มีตัวผิดสะสมอีกแล้ว

กติกา:
1. โปรแกรมดูตัวอักษรเป้าหมาย ณ ตำแหน่งปัจจุบัน
2. ถ้ากดถูก:
   - ตัวอักษรเปลี่ยนเป็นสีเขียว
   - Cursor เดินไปตัวถัดไป
3. ถ้ากดผิด:
   - Mistakes +1
   - หน้าจอสั่น
   - Cursor อยู่ตัวเดิม
   - ตัวผิดจะไม่ถูกเพิ่มลงข้อความ
4. ผู้เล่นพิมพ์ตัวเดิมใหม่ให้ถูกแล้วเล่นต่อได้ทันที
5. Backspace/Delete ไม่จำเป็นและถูกกันไว้ใน Strict Mode

จึงไม่เกิดปัญหา `85 / 70` แบบภาพเดิมอีก

---

# Full Screen

เมื่อกด `เริ่ม Classic`
- หน้าเกมเป็น Fixed 100vw × 100vh
- Header/Footer ถูกซ่อน
- หน้าไม่ Scroll
- ระบบพยายามเรียก Browser Fullscreen API
- มีปุ่ม `⛶ เต็มหน้าจอ` เผื่อ Browser ไม่อนุญาตอัตโนมัติ

Code ยาวจะ Scroll เฉพาะใน Editor ไม่ขยับทั้งหน้า

---

# HTML 50 ด่าน / Python 50 ด่าน

`levels-html.js`
- Stage 1–15 = ง่าย
- Stage 16–35 = ปานกลาง
- Stage 36–50 = ยาก

`levels-python.js` ใช้ช่วงเดียวกัน

ผู้ใช้เริ่มที่ Stage 1
ผ่านด่านแล้วจะปลดล็อก Stage ถัดไป
ข้อมูลอยู่ใน:

```text
users/{uid}/progress
  html.maxUnlockedStage
  python.maxUnlockedStage
```

---

# Points / Reward Shop

ผ่านแต่ละ Stage จะได้ `rewardPoints`

User document เพิ่ม:

```text
pointsBalance
pointsLifetime
inventory
```

ร้านแลกของอยู่ใน:
`reward-data.js`

เมื่อแลก:
- หัก pointsBalance
- เพิ่ม Item ID ลง inventory

---

# Character / 2D Zone — เตรียมโครงไว้แล้ว

ไฟล์:
`character-system.js`

User มีข้อมูล:

```text
character
  avatarId
  outfitIds
  hatId
  emoteIds
  nameEffectId

zone
  zoneId
  x
  y
  direction
```

รอบต่อไปเมื่อมี Reference ตัวละคร/แผนที่:
- ทำ Sprite Sheet
- Walking Animation
- Idle Animation
- Collision
- Map
- Realtime Presence
- เห็นตัวละคร User คนอื่นใน Zone
ได้ต่อจากโครงนี้โดยไม่ต้องรื้อ Account

---

# Firebase Rules

ให้นำ `firestore.rules` เวอร์ชันใน ZIP นี้ไป
Firebase Console → Firestore → Rules → Paste → Publish

---

# หมายเหตุระบบแต้ม

เวอร์ชันนี้เป็น GitHub Pages + Firebase Client โดยตรง
เหมาะกับการทดสอบและใช้งานการศึกษา

ถ้าภายหลังต้องป้องกันผู้ใช้แก้ JavaScript เพื่อเพิ่มแต้มเองแบบจริงจัง
ควรย้ายการมอบแต้ม/แลกของไป Firebase Cloud Functions หรือ Backend Admin SDK
