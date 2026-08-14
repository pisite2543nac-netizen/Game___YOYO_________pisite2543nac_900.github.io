# V5.0 Stable Restore

User Login กลับเป็นระบบเดิม:
- รหัสนักศึกษา 8 หลัก เช่น 11111111
- Password แยกต่างหาก
- Firebase synthetic email: `<studentId>@student.thc-nr.local`

ไม่ล้างข้อมูลเดิม และคงระบบทั้งหมด:
Login/Register, Profile, HTML/Python, Official, PVP, Ranking, Token,
Daily Check-in, Wizard Quest, 2D Zone, Shop, Inventory, Resell, Admin, GM Moderation.

Admin มีเครื่องมือ:
- ตรวจ Firebase Authentication เทียบ Firestore
- ซ่อม users/{uid} ที่หายจากบัญชี Auth
- normalize แผนก/สาขา
- sync public_profiles

การซ่อมไม่ reset Token, Score, Inventory, Progress หรือ Attempts.
