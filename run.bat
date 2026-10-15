@echo off
REM run.bat - start the Electron app
IF NOT EXIST node_modules (echo Installing dependencies... & npm install)
node .
