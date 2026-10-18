# Start NEXUS Supply Chain Intelligence Platform (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   NEXUS - Supply Chain Disruption Predictor Platform    " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 0. Check Backend Prerequisites & Bootstrap
if (-not (Test-Path "backend\venv")) {
    Write-Host "[Setup] Initializing Python Virtual Environment..." -ForegroundColor Yellow
    python -m venv backend\venv
    Write-Host "[Setup] Installing backend dependencies..." -ForegroundColor Yellow
    & "backend\venv\Scripts\pip.exe" install -r backend\requirements.txt
}

if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "[Setup] Created backend/.env from template." -ForegroundColor DarkGray
    }
}

# 1. Check Frontend Prerequisites & Bootstrap
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "[Setup] Installing frontend npm packages (first-time run)..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}

if (-not (Test-Path "frontend\.env.local")) {
    if (Test-Path "frontend\.env.example") {
        Copy-Item "frontend\.env.example" "frontend\.env.local"
        Write-Host "[Setup] Created frontend/.env.local from template." -ForegroundColor DarkGray
    }
}

# 2. Start Python FastAPI Backend on Port 8000
Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process -FilePath "backend\venv\Scripts\python.exe" -ArgumentList "-m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload"

# 3. Start Next.js Frontend on Port 3000
Write-Host "[2/2] Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Set-Location frontend
npm run dev -- -p 3000
