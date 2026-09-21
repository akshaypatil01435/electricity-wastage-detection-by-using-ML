# PowerShell script to run all test suites across Backend, ML Service, and Frontend
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Running WattVision AI Full Test Suite  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Backend JUnit Tests
Write-Host "`n[1/3] Running Backend JUnit Tests (Maven)..." -ForegroundColor Yellow
Push-Location -Path "$PSScriptRoot/../backend"
try {
    mvn test
    if ($LASTEXITCODE -ne 0) { throw "Backend tests failed!" }
    Write-Host " Backend tests passed." -ForegroundColor Green
} finally {
    Pop-Location
}

# 2. ML Service Pytest Suite
Write-Host "`n[2/3] Running ML Service Tests (Pytest)..." -ForegroundColor Yellow
Push-Location -Path "$PSScriptRoot/../ml-service"
try {
    if (Test-Path ".venv/Scripts/pytest.exe") {
        & ".venv/Scripts/pytest.exe" -v
    } else {
        pytest -v
    }
    if ($LASTEXITCODE -ne 0) { throw "ML Service tests failed!" }
    Write-Host " ML Service tests passed." -ForegroundColor Green
} finally {
    Pop-Location
}

# 3. Frontend Vitest Suite
Write-Host "`n[3/3] Running Frontend Tests (Vitest)..." -ForegroundColor Yellow
Push-Location -Path "$PSScriptRoot/../frontend"
try {
    npm test
    if ($LASTEXITCODE -ne 0) { throw "Frontend tests failed!" }
    Write-Host " Frontend tests passed." -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "  ALL TEST SUITES PASSED SUCCESSFULLY!   " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
