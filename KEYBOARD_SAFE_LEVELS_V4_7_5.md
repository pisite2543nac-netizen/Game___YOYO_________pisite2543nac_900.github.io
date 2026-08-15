# V4.7.5 — THC-NR Keyboard Safe Levels

แก้ปัญหาตัวอักษรพิเศษที่ไม่มีบนแป้นพิมพ์ทั่วไปในด่าน HTML

แก้แล้ว:
- Stage 27: `© 2026 Code Academy` → `2026 Code Academy`
- Stage 50: `© 2026 Nangrong Technical College` → `2026 Nangrong Technical College`

Normalize เครื่องหมายที่อาจสร้างปัญหา:
- ® / ™ → ตัดออก
- “ ” → "
- ‘ ’ → '
- – / — → -
- … → ...
- non-breaking space → space ปกติ

Firebase Project ยังคง:
`thc-nr`

ไม่เปลี่ยนฐานข้อมูล User และไม่ล้างข้อมูลเดิม

Deploy:
1. อัป ZIP นี้ทับ GitHub Root
2. ไม่ต้องสร้างฐานข้อมูลใหม่
3. ถ้า Rules ของ V4.7.4 ใช้งานอยู่แล้ว ไม่จำเป็นต้องเปลี่ยน
4. รอ GitHub Pages Success
5. Ctrl+F5 หรือเปิด Incognito
