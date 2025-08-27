@echo off
echo 🚀 Création de Release Eterna
echo ==============================

:: Aller au répertoire racine
cd /d "%~dp0.."
if not exist "package.json" (
    echo ❌ package.json non trouvé
    pause
    exit /b 1
)

:: Vérifier Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé ou pas dans le PATH
    pause
    exit /b 1
)

:: Vérifier le statut Git
git status --porcelain | findstr /r "^" >nul
if errorlevel 0 (
    echo ⚠️ Il y a des modifications non commitées
    echo 💡 Voulez-vous les committer avant de créer la release ? (O/N)
    set /p choice=
    if /i "%choice%"=="O" (
        echo 📝 Commit des modifications...
        git add .
        set /p commit_msg="Message de commit: "
        git commit -m "%commit_msg%"
    ) else (
        echo ❌ Release annulée - commit d'abord vos modifications
        pause
        exit /b 1
    )
)

:: Lire la version actuelle
for /f "tokens=3" %%i in ('findstr /C:"\"version\":" package.json') do set current_version=%%i
set current_version=%current_version:"=%
set current_version=%current_version:,=%

echo 📦 Version actuelle: %current_version%

:: Demander la nouvelle version
echo 💡 Format de version: v1.0.0, v1.1.0, etc.
set /p new_version="Nouvelle version (ex: v1.1.0): "

:: Valider le format de version
echo %new_version% | findstr /r "^v[0-9]\+\.[0-9]\+\.[0-9]\+$" >nul
if errorlevel 1 (
    echo ❌ Format de version invalide. Utilisez le format vX.Y.Z
    pause
    exit /b 1
)

:: Mettre à jour package.json
echo 🔄 Mise à jour de package.json...
powershell -Command "(Get-Content package.json) -replace '\"version\": \"[^\"]*\"', '\"version\": \"%new_version:1,1=%' | Set-Content package.json"

:: Commit de la nouvelle version
echo 📝 Commit de la nouvelle version...
git add package.json
git commit -m "Bump version to %new_version%"

:: Créer le tag
echo 🏷️ Création du tag %new_version%...
git tag %new_version%

:: Pousser les changements
echo 🚀 Push des changements et du tag...
git push origin main
git push origin %new_version%

echo.
echo ✅ Release %new_version% créée avec succès !
echo 🌐 GitHub Actions va automatiquement :
echo   1. Builder l'exécutable
echo   2. Créer la release GitHub
echo   3. Attacher l'exécutable à la release
echo   4. Mettre à jour le frontend automatiquement
echo.
echo 📱 Vérifiez l'onglet Actions sur GitHub pour suivre le processus
echo 🔗 https://github.com/[votre-username]/Eterna/actions

pause
