# Remove BOM from App.js
$content = Get-Content -Path "src/App.js" -Raw
if ($content[0] -eq "`u{FEFF}") {
    $content = $content.Substring(1)
    Set-Content -Path "src/App.js" -Value $content -NoNewline -Encoding UTF8
    Write-Host "Fixed BOM in src/App.js"
}

# Remove BOM from button.jsx
$content = Get-Content -Path "src/components/ui/button.jsx" -Raw
if ($content[0] -eq "`u{FEFF}") {
    $content = $content.Substring(1)
    Set-Content -Path "src/components/ui/button.jsx" -Value $content -NoNewline -Encoding UTF8
    Write-Host "Fixed BOM in src/components/ui/button.jsx"
}

# Remove BOM from calendar.jsx
$content = Get-Content -Path "src/components/ui/calendar.jsx" -Raw
if ($content[0] -eq "`u{FEFF}") {
    $content = $content.Substring(1)
    Set-Content -Path "src/components/ui/calendar.jsx" -Value $content -NoNewline -Encoding UTF8
    Write-Host "Fixed BOM in src/components/ui/calendar.jsx"
}

# Remove BOM from index.js
$content = Get-Content -Path "src/index.js" -Raw
if ($content[0] -eq "`u{FEFF}") {
    $content = $content.Substring(1)
    Set-Content -Path "src/index.js" -Value $content -NoNewline -Encoding UTF8
    Write-Host "Fixed BOM in src/index.js"
}

# Remove BOM from utils.js
$content = Get-Content -Path "src/lib/utils.js" -Raw
if ($content[0] -eq "`u{FEFF}") {
    $content = $content.Substring(1)
    Set-Content -Path "src/lib/utils.js" -Value $content -NoNewline -Encoding UTF8
    Write-Host "Fixed BOM in src/lib/utils.js"
}

# Fix Cases.js - remove ArrowRight import
$casesPath = "src/pages/Cases.js"
$casesContent = Get-Content -Path $casesPath -Raw
# Remove ArrowRight from import line
$casesContent = $casesContent -replace ',\s*ArrowRight', '' -replace 'import\s*\{\s*ArrowRight\s*\}\s*from\s*["'']lucide-react["''];?\s*', ''
Set-Content -Path $casesPath -Value $casesContent -Encoding UTF8
Write-Host "Fixed unused import in $casesPath"

# Fix FAQ.js - comment out unused variables
$faqPath = "src/pages/FAQ.js"
$faqContent = Get-Content -Path $faqPath -Raw
# Comment out the unused destructuring
$faqContent = $faqContent -replace 'const\s*\{\s*t,\s*language\s*\}\s*=\s*useTranslation\(\s*\);', '// const { t, language } = useTranslation(); // Temporarily commented out'
Set-Content -Path $faqPath -Value $faqContent -Encoding UTF8
Write-Host "Commented out unused variables in $faqPath"

# Fix SealedCard.js - remove AlertCircle import
$sealedCardPath = "src/pages/SealedCard.js"
$sealedCardContent = Get-Content -Path $sealedCardPath -Raw
# Remove AlertCircle from import line
$sealedCardContent = $sealedCardContent -replace ',\s*AlertCircle', '' -replace 'import\s*\{\s*AlertCircle\s*\}\s*from\s*["'']lucide-react["''];?\s*', ''
Set-Content -Path $sealedCardPath -Value $sealedCardContent -Encoding UTF8
Write-Host "Fixed unused import in $sealedCardPath"


# Remove BOM from all affected files in one go
$files = @(
    "src/App.js",
    "src/components/ui/button.jsx",
    "src/components/ui/calendar.jsx",
    "src/index.js",
    "src/lib/utils.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw
        if ($content[0] -eq "`u{FEFF}") {
            $content = $content.Substring(1)
            Set-Content -Path $file -Value $content -NoNewline -Encoding UTF8
            Write-Host "✓ Fixed BOM in $file"
        } else {
            Write-Host "No BOM found in $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}
