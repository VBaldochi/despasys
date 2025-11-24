#!/usr/bin/env pwsh
# Script para iniciar todo o ambiente de desenvolvimento

Write-Host "🚀 Iniciando DespaSys com ML..." -ForegroundColor Cyan

# Verificar se está na raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script na raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Função para iniciar processo em novo terminal
function Start-InNewTerminal {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory = (Get-Location)
    )
    
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location '$WorkingDirectory'; Write-Host '🔷 $Title' -ForegroundColor Cyan; $Command"
}

Write-Host ""
Write-Host "📦 1. Instalando dependências Next.js..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🐍 2. Verificando ambiente Python..." -ForegroundColor Yellow
if (-not (Test-Path "reco-api\.venv")) {
    Write-Host "   Criando ambiente virtual Python..." -ForegroundColor Gray
    cd reco-api
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    cd ..
    Write-Host "   ✅ Ambiente Python criado!" -ForegroundColor Green
} else {
    Write-Host "   ✅ Ambiente Python já existe!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 3. Iniciando serviços..." -ForegroundColor Yellow

# Iniciar Next.js em novo terminal
Write-Host "   🌐 Iniciando Next.js na porta 3001..." -ForegroundColor Gray
Start-InNewTerminal -Title "Next.js Dev Server" -Command "npm run dev"

# Aguardar 2 segundos
Start-Sleep -Seconds 2

# Iniciar ML API em novo terminal
Write-Host "   🤖 Iniciando ML API na porta 8020..." -ForegroundColor Gray
Start-InNewTerminal -Title "ML API (FastAPI)" -Command ".\.venv\Scripts\Activate.ps1; uvicorn app:app --reload --port 8020" -WorkingDirectory "$PWD\reco-api"

Write-Host ""
Write-Host "✅ Todos os serviços foram iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 URLs disponíveis:" -ForegroundColor Cyan
Write-Host "   🌐 Next.js App:     http://localhost:3001" -ForegroundColor White
Write-Host "   🤖 ML API:          http://localhost:8020" -ForegroundColor White
Write-Host "   📚 ML API Docs:     http://localhost:8020/docs" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Na primeira execução, treine o modelo ML!" -ForegroundColor Yellow
Write-Host "   Veja instruções em: docs/ML-INTEGRATION.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
