@echo off
echo Starting Finance Dashboard Frontend...
cd /d "%~dp0frontend"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
)

echo.
echo ========================================
echo Frontend running at: http://localhost:5173
echo ========================================
echo.
npm run dev
