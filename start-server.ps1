<#
Start the Who Shared It server in background and save PID to server.pid

Usage:
  .\start-server.ps1

This script must be run from PowerShell. It will run `npm start` in the
project directory and write the child process PID to `server.pid` so it can
be stopped later with `stop-server.ps1`.
#>

$project = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pidFile = Join-Path $project 'server.pid'

if (Test-Path $pidFile) {
  try {
    $existingPid = Get-Content $pidFile | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
    if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
      Write-Output "Server already appears to be running (PID $existingPid). Use stop-server.ps1 first or remove server.pid if stale."
      exit 0
    } else {
      Remove-Item $pidFile -ErrorAction SilentlyContinue
    }
  } catch {
    Remove-Item $pidFile -ErrorAction SilentlyContinue
  }
}

Write-Output "Starting Who Shared It server (npm start) in background..."

# Prefer starting node directly to avoid shell shims opening GUI processes
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($node) {
  $scriptPath = Join-Path $project 'server\app.js'
  $proc = Start-Process -FilePath $node -ArgumentList @($scriptPath) -WorkingDirectory $project -PassThru
} else {
  # Fallback to npm start if node is not directly available
  $proc = Start-Process -FilePath npm -ArgumentList 'start' -WorkingDirectory $project -PassThru
}

Start-Sleep -Milliseconds 800

if ($proc -and $proc.Id) {
  $proc.Id | Out-File -FilePath $pidFile -Encoding ascii
  Write-Output "Server started with PID $($proc.Id). PID stored in server.pid"
} else {
  Write-Error "Failed to start server process. Check npm output in a foreground shell."
}
