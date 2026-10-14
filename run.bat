@echo off
cd /d "%~dp0source\desktop-app"
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm are required. Install from https://nodejs.org/
  exit /b 1
)
call npm install
call npm start
