@{
  frontend  = "npm install; npm run start"

  backend   = '& ".\.venv\Scripts\python.exe" ".\server.py"'
  AurorA   = '& ".\.venv\Scripts\python.exe" ".\server.py"'
  CompassAI = '& ".\backend\.venv\Scripts\python.exe" ".\backend\server.py"'

  # Agency still TBD (we'll fill once we extract project.scripts)
  Agency    = 'Write-Host "Agency not configured yet (need project.scripts from pyproject.toml)" -ForegroundColor Yellow; dir'
}
