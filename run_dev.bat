@echo off
setlocal
echo ==========================================================
echo    NEXUS - Supply Chain Disruption Predictor Platform
echo ==========================================================

REM 0. Check Backend Virtual Environment
if not exist "backend\venv" (
    echo [Setup] Initializing Python virtual environment...
    python -m venv backend\venv
    echo [Setup] Installing backend dependencies...
    backend\venv\Scripts\pip.exe install -r backend\requirements.txt
)

if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy backend\.env.example backend\.env >nul
        echo [Setup] Created backend\.env from template.
    )
)

REM 1. Check Frontend Dependencies
if not exist "frontend\node_modules" (
    echo [Setup] Installing frontend npm dependencies...
    cd frontend
    call npm install
    cd ..
)

if not exist "frontend\.env.local" (
    if exist "frontend\.env.example" (
        copy frontend\.env.example frontend\.env.local >nul
        echo [Setup] Created frontend\.env.local from template.
    )
)

echo [1/2] Starting Python FastAPI Backend on Port 8000...
start cmd /k "backend\venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Next.js Frontend on Port 3000...
cd frontend
npm run dev -- -p 3000
