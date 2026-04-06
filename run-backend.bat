@echo off
echo Starting Finance Dashboard Backend...
cd /d "%~dp0"

REM Check if venv exists
if not exist "backend\venv\" (
    echo Creating Python virtual environment...
    python -m venv backend\venv
    echo Installing dependencies...
    call backend\venv\Scripts\pip install -r backend\requirements.txt
)

REM Activate venv
call backend\venv\Scripts\activate.bat

REM Initialize database and seed data
echo Initializing database...
python backend/init_db.py

REM Seed database
echo Seeding demo data...
python backend/seed.py

REM Start backend from project root so relative imports work
echo.
echo ========================================
echo Backend running at: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
