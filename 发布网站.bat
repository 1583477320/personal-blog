@echo off
chcp 65001 >nul
cd /d "C:\Users\xiaozhu\projects\flowershow-site"
echo.
echo   正在发布你的数字花园...
echo.

set "BASH=C:\Program Files\Git\bin\bash.exe"
if exist "%BASH%" (
  "%BASH%" publish.sh
) else (
  bash publish.sh
)

echo.
pause
