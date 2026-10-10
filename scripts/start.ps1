$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
if (-not (Test-Path '.venv/Scripts/python.exe')) {
    throw 'Create the Python environment and install backend requirements first. See README.md.'
}
$pythonPath = Join-Path $projectRoot '.venv/Scripts/python.exe'
$backendArgs = @('-m','uvicorn','backend.app.main:app','--host','127.0.0.1','--port','8000')
if (Test-Path -LiteralPath 'backend/.env') { $backendArgs += @('--env-file','backend/.env') }
$backendProcess = Start-Process -FilePath $pythonPath -ArgumentList $backendArgs -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
try {
    npm run dev
} finally {
    if (-not $backendProcess.HasExited) { Stop-Process -Id $backendProcess.Id }
}
