@echo off
REM download_mdk.bat
REM Usage: download_mdk.bat <destination_dir>
IF "%1"=="" (
  ECHO Usage: %0 ^<destination_dir^>
  EXIT /B 1
)
SET DIR=%~1
IF "%FORGE_MDK_URL%"=="" (
  ECHO Please set FORGE_MDK_URL environment variable to the MDK zip URL, or drop mdk.zip into %DIR%
  EXIT /B 1
)

powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%FORGE_MDK_URL%', '%DIR%\\mdk.zip')"
powershell -Command "Expand-Archive -Force -Path '%DIR%\\mdk.zip' -DestinationPath '%DIR%'"
ECHO MDK extracted to %DIR%
