@echo off
echo 🚀 Build Executable - Eterna App
echo =================================

:: Vérifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    pause
    exit /b 1
)

:: Aller au répertoire racine
cd /d "%~dp0.."
if not exist "package.json" (
    echo ❌ package.json non trouvé
    pause
    exit /b 1
)

:: Arrêter tous les processus Eterna en cours
echo 🔄 Arrêt des processus Eterna en cours...
taskkill /F /IM Eterna.exe >nul 2>&1
if errorlevel 1 (
    echo ✅ Aucun processus Eterna en cours
) else (
    echo ✅ Processus Eterna arrêtés
)

echo 📦 Installation des dépendances...
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo 🧹 Nettoyage des dossiers de build...
if exist "dist" (
    rmdir /s /q "dist" 2>nul
    if errorlevel 1 (
        echo ⚠️ Impossible de supprimer le dossier dist
    )
)
if exist "dist_electron" (
    rmdir /s /q "dist_electron" 2>nul
    if errorlevel 1 (
        echo ⚠️ Impossible de supprimer le dossier dist_electron
    )
)

echo 🔨 Build du frontend Vue.js...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur lors du build du frontend
    pause
    exit /b 1
)

echo ✅ Frontend construit avec succès !

echo 🎯 Création de l'exécutable avec electron-builder...
if exist "node_modules\.bin\electron-builder.cmd" (
    echo 📦 electron-builder trouvé, création de l'exécutable...
    call npx electron-builder --win
) else (
    echo ❌ electron-builder non trouvé
    echo 📦 Installation d'electron-builder...
    call npm install --save-dev electron-builder
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation d'electron-builder
        pause
        exit /b 1
    )
    echo 🎯 Création de l'exécutable...
    call npx electron-builder --win
)

if errorlevel 1 (
    echo ❌ Erreur lors de la création de l'exécutable
    pause
    exit /b 1
)

echo ✅ Build de l'exécutable terminé avec succès !
echo 📁 Exécutable créé dans : %CD%\dist_electron\
echo 🎯 Fichier principal : dist_electron\win-unpacked\Eterna.exe
echo 🎉 Votre app Eterna est prête !

echo.
echo 🚀 Test de l'exécutable...
if exist "dist_electron\win-unpacked\Eterna.exe" (
    echo ✅ Exécutable trouvé et prêt à l'emploi !
    echo 💡 Double-cliquez sur dist_electron\win-unpacked\Eterna.exe pour tester
    echo 📦 Ou utilisez l'installateur : dist_electron\Eterna Setup 1.0.0.exe
) else (
    echo ❌ Exécutable non trouvé
)

echo.
echo 💡 Si vous avez des problèmes d'installation, utilisez scripts\clean-eterna.bat

pause
