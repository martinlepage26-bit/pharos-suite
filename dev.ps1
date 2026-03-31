[CmdletBinding()]
param(
  [string[]]$Apps = @("frontend","backend","CompassAI","AurorA","Agency")
)

$ErrorActionPreference = "Stop"

function Get-Shell {
  if (Get-Command pwsh -ErrorAction SilentlyContinue) { return (Get-Command pwsh).Source }
  return (Get-Command powershell).Source
}

$cmdMapPath = Join-Path $PSScriptRoot "dev.commands.ps1"
if (!(Test-Path $cmdMapPath)) { throw "Missing dev.commands.ps1 at $cmdMapPath" }

$cmdMap = & $cmdMapPath
if ($cmdMap -isnot [hashtable]) { throw "dev.commands.ps1 must return a hashtable like @{ app = 'command' }" }

function Start-AppWindow {
  param(
    [Parameter(Mandatory)][string]$Name,
    [Parameter(Mandatory)][string]$Path,
    [string]$Command
  )

  $full = (Resolve-Path $Path).Path

  if ([string]::IsNullOrWhiteSpace($Command)) {
    $Command = 'Write-Host "No command configured." -ForegroundColor Yellow; dir'
  }

  # Ensure npm is found in new shells, and set working dir
  $invoke = @"
`$env:PATH = `$env:PATH + ';' + `$env:APPDATA + '\npm'
Set-Location -LiteralPath "$full"
`$host.UI.RawUI.WindowTitle = "$Name"
$Command
"@

  Start-Process -FilePath (Get-Shell) -WorkingDirectory $full -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy","Bypass",
    "-Command", $invoke
  ) | Out-Null
}

foreach ($app in $Apps) {
  $path = Join-Path $PSScriptRoot $app
  if (!(Test-Path $path)) { Write-Host "Skipping missing: $app" -ForegroundColor DarkYellow; continue }

  $cmd = $null
  if ($cmdMap.ContainsKey($app)) { $cmd = $cmdMap[$app] }

  Start-AppWindow -Name $app -Path $path -Command $cmd
}

Write-Host "Launched: $($Apps -join ', ')" -ForegroundColor Green
