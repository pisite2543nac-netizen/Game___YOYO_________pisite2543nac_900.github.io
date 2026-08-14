@echo off
firebase use thc-nr
cd functions
call npm install
cd ..
firebase deploy --only functions
pause
