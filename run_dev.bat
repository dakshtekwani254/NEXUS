@echo off
echo ==========================================================
echo    NEXUS - Supply Chain Disruption Predictor Platform
echo ==========================================================
echo [1/2] Starting Python FastAPI Backend on Port 8000...
start cmd /k "backend\venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Next.js Frontend on Port 3000...
cd frontend
npm run dev -- -p 3000
