<#
Stop the Who Shared It server previously started with `start-server.ps1`.

Usage:
  .\stop-server.ps1

The script reads `server.pid` if present and attempts to stop that PID.
If the PID file is missing it will try to find the process listening on port 3000
and stop it as a fallback.
#>

$project = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pidFile = Join-Path $project 'server.pid'

if (Test-Path $pidFile) {
  $storedPid = (Get-Content $pidFile | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }) -as [int]
  if ($storedPid -and (Get-Process -Id $storedPid -ErrorAction SilentlyContinue)) {
    Write-Output "Stopping server PID $storedPid..."
    Stop-Process -Id $storedPid -Force -ErrorAction SilentlyContinue
    Remove-Item $pidFile -ErrorAction SilentlyContinue
    Write-Output "Stopped and removed server.pid"
    exit 0
  } else {
    Write-Output "PID in server.pid not running; removing stale PID file."
    Remove-Item $pidFile -ErrorAction SilentlyContinue
  }
}

# Fallback: find process using TCP port 3000
try {
  $conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($conn -and $conn.OwningProcess) {
    $pid2 = $conn.OwningProcess
    Write-Output "Stopping process listening on port 3000 (PID $pid2)..."
    Stop-Process -Id $pid2 -Force -ErrorAction SilentlyContinue
    Write-Output "Stopped PID $pid2"
    exit 0
  } else {
    Write-Output "No server PID found and nothing listening on port 3000. Nothing to stop."
  }
} catch {
  Write-Output "Unable to inspect TCP connections: $_"
}
