// 1) Firebase Console > Project settings > General
// 2) Your apps > Web app
// 3) Copy firebaseConfig มาแทนค่าด้านล่าง
// 4) เปลี่ยนชื่อไฟล์นี้จาก firebase-config.example.js เป็น firebase-config.js

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Email Admin ต้องตรงกับบัญชีใน Firebase Authentication
export const ADMIN_EMAILS = [
  "teacher@example.com"
];
