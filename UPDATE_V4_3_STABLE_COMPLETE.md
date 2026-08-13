# V4.3 — Stable Complete

## แก้หลัก
- Mobile/Tablet: Login/สมัครได้ แล้วเข้า 2D Zone อัตโนมัติหลังมีตัวละคร
- Desktop: ใช้งานทุกระบบ
- GM แสดงชื่อเหนือหัวเป็น `GM`; User แสดงรหัสนักศึกษา
- PVP มี Gameplay จริง: Strict typing, progress realtime, WPM, Accuracy, Mistakes, Win/Lose/Forfeit
- PVP Host ลบ Lobby ของตัวเองได้ และห้อง waiting เกิน 10 นาทีไม่นำมาจับคู่
- User Chat แสดง 24 ชม.; GM ถาวร
- `zone_chat_archive` เก็บ log ให้ Admin แม้ข้อความ User หมดอายุจาก Zone
- Admin แจ้งเตือนสมาชิกใหม่ Realtime
- เพิ่ม `404.html` เพื่อช่วยกู้ URL GitHub Pages

## ต้อง Publish Firestore Rules ใหม่
V4.3 เพิ่ม Collection:
`zone_chat_archive`

## Collections
users, attempts, official_submissions, rankings, pvp_rooms, public_profiles, presence, zone_positions, zone_messages, zone_chat_archive, zone_moderation, levels, game_modes
