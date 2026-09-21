# PowerShell script to start the local Docker Compose stack
Write-Host "Starting WattVision AI Production Stack..." -ForegroundColor Cyan

if (-not (Test-Path "$PSScriptRoot/../.env")) {
    Write-Host "No .env found. Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item "$PSScriptRoot/../.env.example" "$PSScriptRoot/../.env"
    Write-Host "Please edit .env to set secure credentials before starting." -ForegroundColor Red
}

Push-Location -Path "$PSScriptRoot/.."
try {
    docker compose up --build -d
    Write-Host "`nStack deployed successfully!" -ForegroundColor Green
    Write-Host "Frontend:   http://localhost:3000" -ForegroundColor White
    Write-Host "Backend:    http://localhost:8080/swagger-ui.html" -ForegroundColor White
    Write-Host "ML Service: http://localhost:8000/docs" -ForegroundColor White
} finally {
    Pop-Location
}
