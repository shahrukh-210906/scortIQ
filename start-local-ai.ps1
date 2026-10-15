param([int]$Port = 11435)
$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$taskServer = Join-Path $taskRoot '.tmp\llama-runtime\llama-server.exe'
$taskAdapter = Join-Path $taskRoot 'ml\output\gemma-tutor-v1'
$taskBase = Join-Path $taskRoot 'ml\cache\gemma3-4b.gguf'
$taskToken = Join-Path $taskRoot '.tmp\local-tutor-token'
if (!(Test-Path -LiteralPath $taskServer) -or !(Test-Path -LiteralPath (Join-Path $taskAdapter 'adapter-f16.gguf')) -or !(Test-Path -LiteralPath $taskToken) -or !(Test-Path -LiteralPath $taskBase)) {
    throw 'The local model, trained adapter or private token is missing. Follow ml/LOCAL_TUTOR.md to restore the setup.'
}
$taskHealth = $null
try { $taskHealth = Invoke-RestMethod "http://127.0.0.1:$Port/health" -TimeoutSec 2 } catch {}
if ($taskHealth -and $taskHealth.status -eq 'ok') {
    $taskHeaders = @{Authorization = 'Bearer ' + (Get-Content -LiteralPath $taskToken -Raw).Trim()}
    $taskModels = Invoke-RestMethod "http://127.0.0.1:$Port/v1/models" -Headers $taskHeaders -TimeoutSec 3
    $taskAdapters = Invoke-RestMethod "http://127.0.0.1:$Port/lora-adapters" -Headers $taskHeaders -TimeoutSec 3
    if ($taskModels.data.id -contains 'scortiq-socratic-gemma-v1' -and ($taskAdapters | Where-Object {$_.path -like '*gemma-tutor-v1/adapter-f16.gguf' -and $_.scale -eq 1})) {
        Write-Output 'The trained local tutor is already running.'
        exit 0
    }
    throw "Port $Port is serving another candidate. It was left running."
}
if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
    throw "Port $Port is in use by another service. It was left running."
}
$env:OMP_NUM_THREADS = '4'
$env:PYTHONUTF8 = '1'
$taskStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$taskProcess = Start-Process -FilePath $taskServer -ArgumentList '--model','ml/cache/gemma3-4b.gguf','--lora','ml/output/gemma-tutor-v1/adapter-f16.gguf','--alias','scortiq-socratic-gemma-v1','--ctx-size','4096','--n-gpu-layers','99','--parallel','1','--flash-attn','on','--host','127.0.0.1','--port',"$Port",'--api-key-file','.tmp/local-tutor-token','--no-webui','--seed','42','--repeat-penalty','1.1','--no-jinja','--chat-template','gemma','--no-prefill-assistant' -WorkingDirectory $taskRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $taskRoot ".tmp\local-tutor-$taskStamp.log") -RedirectStandardError (Join-Path $taskRoot ".tmp\local-tutor-$taskStamp.err") -PassThru
Set-Content -LiteralPath (Join-Path $taskRoot '.tmp\local-tutor.pid') -Value $taskProcess.Id
Write-Output "Starting the local trained tutor on port $Port. Model loading can take a short while; health is available at http://127.0.0.1:$Port/health."
