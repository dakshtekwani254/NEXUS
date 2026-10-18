# Start NEXUS Supply Chain Intelligence Platform (PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   NEXUS - Supply Chain Disruption Predictor Platform    " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Python FastAPI Backend on Port 8000
Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process -FilePath "backend\venv\Scripts\python.exe" -ArgumentList "-m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload"

# 2. Start Next.js Frontend on Port 3000
Write-Host "[2/2] Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Set-Location frontend
npm run dev -- -p 3000
