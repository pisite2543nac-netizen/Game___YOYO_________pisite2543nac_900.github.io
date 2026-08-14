# Deploy V5.0

1. อัป ZIP ทั้งหมดไป GitHub repository root
2. Firebase Console → Firestore Database → Rules → วาง firestore.rules → Publish
3. Deploy Functions:

```bash
firebase login
firebase use thc-nr
cd functions
npm install
cd ..
firebase deploy --only functions
```

4. เปิด Incognito / Ctrl+F5
5. ทดสอบ Login User เดิม: 11111111
6. ทดสอบ Register ด้วยรหัสนักศึกษา 8 หลักที่ยังไม่เคยใช้
7. Admin → สมาชิก User → ตรวจ Auth / Database
