[CmdletBinding()]
param(
  [switch]$Frontend = $true,
  [switch]$Backend  = $true,
  [switch]$CompassAI = $true,
  [switch]$AurorAI   = $true,
  [switch]$Agency    = $true
)

function Get-RunCommand {
  param([string]$Path)

  $p = Resolve-Path $Path
  $pkg = Join-Path $p "package.json"
  $pyProject = Join-Path $p "pyproject.toml"
  $req = Join-Path $p "requirements.txt"
  $manage = Join-Path $p "manage.py"
  $dotnet = Get-ChildItem -Path $p -Filter *.sln -File -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $dotnet) { $dotnet = Get-ChildItem -Path $p -Filter *.csproj -File -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 }

  if (Test-Path $pkg) {
    # prefer dev if present, else start
    try {
      $json = Get-Content $pkg -Raw | ConvertFrom-Json
      if ($json.scripts.dev) { return "npm install; npm run dev" }
      if ($json.scripts.start) { return "npm install; npm run start" }
    } catch {}
    return "npm install; npm run dev"
  }

  if (Test-Path $pyProject) {
    return "python -m pip install -U pip; python -m pip install -e .; python -m pytest -q; python -m uvicorn app:app --reload"
  }

  if (Test-Path $manage) {
    return "python -m pip install -U pip; pip install -r requirements.txt; python manage.py runserver"
  }

  if (Test-Path $req) {
    return "python -m pip install -U pip; pip install -r requirements.txt; python -m pytest -q"
  }

  if ($dotnet) {
    return "dotnet restore; dotnet run"
  }

  return "Write-Host 'No known runner detected in this folder.' -ForegroundColor Yellow; dir"
}

function Start-AppTab {
  param(
    [Parameter(Mandatory)] [string]$Title,
    [Parameter(Mandatory)] [string]$Path
  )

  $full = (Resolve-Path $Path).Path
  $cmd = Get-RunCommand -Path $full
  wt -w 0 new-tab --title $Title -d $full powershell -NoExit -Command $cmd | Out-Null
}

if ($Frontend -and (Test-Path ".\frontend")) { Start-AppTab -Title "frontend" -Path ".\frontend" }
if ($Backend  -and (Test-Path ".\backend"))  { Start-AppTab -Title "backend"  -Path ".\backend" }

if ($CompassAI -and (Test-Path ".\CompassAI")) { Start-AppTab -Title "CompassAI" -Path ".\CompassAI" }
if ($AurorAI   -and (Test-Path ".\AurorAI"))   { Start-AppTab -Title "AurorAI"   -Path ".\AurorAI" }
if ($Agency    -and (Test-Path ".\Agency"))    { Start-AppTab -Title "Agency"    -Path ".\Agency" }

Write-Host "Started selected apps in Windows Terminal tabs." -ForegroundColor Green
