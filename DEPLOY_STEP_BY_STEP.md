# ติดตั้ง V4.7 แบบทีละขั้น

1. แตก `CODE_TYPING_V4_4_RANKING_PVP_ECONOMY_COMPLETE_READY_GITHUB.zip`
2. อัปโหลดไฟล์ทั้งหมดไว้ที่ Root ของ GitHub repository
3. GitHub → Settings → Pages → Deploy from branch → `main` → `/(root)`
4. Firebase → Authentication → Sign-in method → Email/Password = Enabled
5. Firebase → Firestore Database → Rules → ลบ Rules เดิม → วาง `firestore.rules` V4.7 ทั้งไฟล์ → Publish
6. รอ GitHub Pages deploy แล้วกด Ctrl+F5

## ระบบใหม่ V4.7
- Ranking รวม + Ranking ห้อง
- PVP หลายห้อง + Room Code ระบบสร้าง
- 1/3/5 Shot
- 1v1 / 2v2 Relay คนที่ 1 พิมพ์ครึ่งแรก แล้วคนที่ 2 พิมพ์ครึ่งหลังในทุก Shot
- เดิมพัน Token 5/10/20/30/40/50
- Token ด่านสูงสุดไม่เกิน 70 และคำนวณจาก Speed + Accuracy
- Result อธิบาย Code หลังจบ Classic/Official
- Item Set 2 ราคา +30%

## หมายเหตุ PVP Token
ระบบปัจจุบันเป็น Static GitHub Pages + Firebase Client ตามโครงโปรเจกต์เดิม จึงเหมาะกับระบบการศึกษา/ทดลอง หากต้องการป้องกันการแก้ Token จาก Client แบบ Production ควรย้าย Token ledger และ payout ไป Cloud Functions/Backend ที่เชื่อถือได้
