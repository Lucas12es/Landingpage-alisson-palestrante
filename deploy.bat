@echo off
setlocal
chcp 65001 >nul
REM ===========================================================================
REM  Publicacao - Landing Page Alisson de Araujo
REM  Rode este arquivo (duplo clique) para enviar as alteracoes ao GitHub.
REM  O Cloudflare publica automaticamente apos o envio.
REM  Preencha REPO_URL uma unica vez, com o endereco do repositorio no GitHub.
REM ===========================================================================
set "REPO_URL=https://github.com/Lucas12es/Landingpage--alisson-palestrante.git"
set "BRANCH=main"

cd /d "%~dp0"

if "%REPO_URL%"=="" (
  echo [ERRO] Edite o deploy.bat e preencha REPO_URL com o endereco do repositorio.
  pause
  exit /b 1
)

if not exist ".git" (
  git init
  git branch -M %BRANCH%
  git remote add origin %REPO_URL%
)

git add -A
git commit -m "Atualiza site" 
git pull --rebase origin %BRANCH%
git push -u origin %BRANCH%

echo.
echo Concluido. Aguarde alguns minutos para o Cloudflare publicar.
pause
