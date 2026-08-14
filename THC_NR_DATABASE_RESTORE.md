# V4.7.2 THC-NR DATABASE RESTORE

ชุดนี้ใช้ตัวเกม V4.7.1 แต่เชื่อมกลับไปฐานข้อมูลเดิม:

Firebase Project: `thc-nr`
Admin UID: `TWUrLjOh3BTa1cBNwDXKk4X2IAg1`

ดังนั้นข้อมูลเดิมใน Firestore/Authentication ของโปรเจกต์ thc-nr จะกลับมาใช้กับตัวเกมชุดนี้ เช่น:
- users
- attempts
- official_submissions
- rankings
- public_profiles
- teacher_quests
- quest_progress
- pvp_rooms
- presence
- zone_positions
- zone_messages
- zone_chat_archive
- zone_moderation
- system_settings
- rank_reset_history
- daily_checkins ใต้ users

หมายเหตุ:
ข้อมูลจริงยังอยู่ใน Firebase `thc-nr` ไม่ได้ถูกฝังลง ZIP
ZIP นี้ทำหน้าที่เชื่อมเกมกลับไปใช้ฐานเดิม

## วิธีติดตั้ง
1. อัป ZIP ชุดนี้ทับ GitHub Root
2. Firebase Console ให้เลือก Project `thc-nr`
3. Firestore → Rules → วาง `firestore.rules` จากชุดนี้ → Publish
4. เปิดเว็บด้วย Incognito หรือ Ctrl+F5
5. Login User เดิมด้วยรหัสนักศึกษาเดิม
6. Login Admin ด้วยบัญชี Admin เดิม
