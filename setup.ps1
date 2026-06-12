# ============================================================
#  setup.ps1 - finaliza a separacao e sobe pro GitHub
#  Rode uma vez:  Abra o PowerShell nesta pasta e execute:
#      powershell -ExecutionPolicy Bypass -File .\setup.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$projeto = $PSScriptRoot
$repo    = "https://github.com/Holandara/painel-transparencia-hackonsult.git"

# Caminho do HTML original (o arquivo que voce enviou no chat).
# Se ele nao existir mais, ajuste $origem para onde estiver o painel-transparencia.html.
$origem = "C:\Users\SaraHolandaMesquitaT\AppData\Roaming\Claude\local-agent-mode-sessions\9ce8a385-5e6d-49ff-938b-84274bb51141\c07f5e87-8830-48d5-aadd-1da0e5aaab4b\local_ea335947-660b-4936-9da1-529a813b4e17\uploads\painel-transparencia.html"

# ---- 1. Extrai o geojson (a linha "const GEO = {...}") para js/geo-data.js ----
if (-not (Test-Path $origem)) {
    Write-Host "ERRO: nao encontrei o HTML original em:`n  $origem" -ForegroundColor Red
    Write-Host "Edite a variavel `$origem no topo deste script com o caminho correto." -ForegroundColor Yellow
    exit 1
}

Write-Host "Extraindo o geojson para js/geo-data.js..." -ForegroundColor Cyan
$linhaGeo = Select-String -Path $origem -Pattern '^const GEO' | Select-Object -First 1
if (-not $linhaGeo) {
    Write-Host "ERRO: nao achei a linha 'const GEO' no HTML original." -ForegroundColor Red
    exit 1
}
$jsDir = Join-Path $projeto "js"
if (-not (Test-Path $jsDir)) { New-Item -ItemType Directory -Path $jsDir | Out-Null }
$utf8 = New-Object System.Text.UTF8Encoding($false)   # UTF-8 sem BOM
[System.IO.File]::WriteAllText((Join-Path $jsDir "geo-data.js"), $linhaGeo.Line + "`n", $utf8)
Write-Host "  -> js/geo-data.js criado." -ForegroundColor Green

# ---- 2. Git: init, commit e push ----
Set-Location $projeto
if (-not (Test-Path (Join-Path $projeto ".git"))) {
    git init | Out-Null
}
git add -A
git commit -m "Separa HTML/CSS/JS do painel de transparencia" | Out-Null
git branch -M main
if (-not (git remote | Select-String -Quiet "origin")) {
    git remote add origin $repo
} else {
    git remote set-url origin $repo
}
Write-Host "Enviando para o GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "`nPronto! Repo: $repo" -ForegroundColor Green
