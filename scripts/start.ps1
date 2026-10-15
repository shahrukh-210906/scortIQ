# Start the preview services without tying their lifetime to this terminal.
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
$taskPython = Join-Path $projectRoot '.venv/Scripts/python.exe'
if (-not (Test-Path -LiteralPath $taskPython)) {
    throw 'Create the Python environment and install backend requirements first. See README.md.'
}
New-Item -ItemType Directory -Path '.tmp' -Force | Out-Null
$taskStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
function Test-PreviewUrl([string]$Url) {
    try { return (Invoke-WebRequest -Uri $Url -TimeoutSec 2 -UseBasicParsing).StatusCode -eq 200 }
    catch { return $false }
}
if (-not (Test-PreviewUrl 'http://127.0.0.1:8000/api/health')) {
    if (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue) {
        throw 'Port 8000 is in use but the API is not healthy. Existing processes were left running.'
    }
    $taskBackendArgs = @('-m','uvicorn','backend.app.main:app','--host','127.0.0.1','--port','8000')
    if (Test-Path -LiteralPath 'backend/.env') { $taskBackendArgs += @('--env-file','backend/.env') }
    Start-Process -FilePath $taskPython -ArgumentList $taskBackendArgs -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput ".tmp/backend-$taskStamp.log" -RedirectStandardError ".tmp/backend-$taskStamp.err" | Out-Null
}
if (-not (Test-PreviewUrl 'http://127.0.0.1:5173/')) {
    if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) {
        throw 'Port 5173 is in use but the preview is not healthy. Existing processes were left running.'
    }
    $taskNode = (Get-Command node -ErrorAction Stop).Source
    $taskPreviousCI = $env:CI
    try {
        $env:CI = 'true'
        Start-Process -FilePath $taskNode -ArgumentList 'node_modules/vite/bin/vite.js','--host','127.0.0.1' -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput ".tmp/frontend-$taskStamp.log" -RedirectStandardError ".tmp/frontend-$taskStamp.err" | Out-Null
    } finally { $env:CI = $taskPreviousCI }
}
# Only start the bundled GPU service when this exact local endpoint is selected.
$taskLocalModel = $false
if (Test-Path -LiteralPath 'backend/.env') {
    $taskLocalModel = [bool](Get-Content -LiteralPath 'backend/.env' | Where-Object { $_ -match '^\s*HF_ENDPOINT_URL\s*=\s*["'']?http://127\.0\.0\.1:11435/?["'']?\s*$' })
}
if ($taskLocalModel) {
    & (Join-Path $projectRoot 'start-local-ai.ps1')
}
$taskReady = $false
for ($taskAttempt = 0; $taskAttempt -lt 30; $taskAttempt++) {
    $taskReady = (Test-PreviewUrl 'http://127.0.0.1:8000/api/health') -and (Test-PreviewUrl 'http://127.0.0.1:5173/')
    if ($taskReady -and ((-not $taskLocalModel) -or (Test-PreviewUrl 'http://127.0.0.1:11435/health'))) { break }
    $taskReady = $false
    Start-Sleep -Seconds 1
}
if (-not $taskReady) { throw 'A preview service did not become ready. Check the latest .tmp/*.err logs.' }
Write-Output 'Preview ready: http://127.0.0.1:5173/ — services remain running after this command exits.'
