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
    npx electron-builder --win nsis
) else (
    echo ❌ electron-builder non trouvé
    pause
    exit /b 1
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
    echo 📦 Ou utilisez l'installateur : dist_electron\Eterna-Setup-1.0.0.exe
) else (
    echo ❌ Exécutable non trouvé
)

echo.
echo 🔄 Copie de l'installateur à la racine pour GitHub...
if exist "dist_electron\Eterna-Setup-1.0.0.exe" (
    copy "dist_electron\Eterna-Setup-1.0.0.exe" "Eterna.exe" >nul
    if errorlevel 1 (
        echo ❌ Erreur lors de la copie de l'installateur
    ) else (
        echo ✅ Installateur copié à la racine : Eterna.exe
        echo 🌐 Maintenant visible par GitHub pour les releases automatiques !
    )
) else (
    echo ⚠️ Installateur non trouvé, copie impossible
    echo 🔍 Vérification du contenu du dossier dist_electron...
    dir dist_electron\*.exe
)

echo.
echo 🧹 Nettoyage automatique des fichiers inutiles...
echo 📁 Suppression des fichiers de build inutiles...

:: Supprimer l'installateur du dossier dist_electron (déjà copié à la racine)
if exist "dist_electron\Eterna-Setup-1.0.0.exe" (
    del "dist_electron\Eterna-Setup-1.0.0.exe" >nul 2>&1
    echo ✅ Installateur supprimé de dist_electron
)

:: Supprimer les fichiers de build inutiles
if exist "dist_electron\Eterna-Setup-1.0.0.exe.blockmap" (
    del "dist_electron\Eterna-Setup-1.0.0.exe.blockmap" >nul 2>&1
    echo ✅ Fichier .blockmap supprimé
)

if exist "dist_electron\builder-debug.yml" (
    del "dist_electron\builder-debug.yml" >nul 2>&1
    echo ✅ Fichier builder-debug.yml supprimé
)

if exist "dist_electron\builder-effective-config.yaml" (
    del "dist_electron\builder-effective-config.yaml" >nul 2>&1
    echo ✅ Fichier builder-effective-config.yaml supprimé
)

if exist "dist_electron\latest.yml" (
    del "dist_electron\latest.yml" >nul 2>&1
    echo ✅ Fichier latest.yml supprimé
)

:: Supprimer le dossier dist (plus nécessaire)
if exist "dist" (
    rmdir /s /q "dist" >nul 2>&1
    echo ✅ Dossier dist supprimé
)

echo.
echo 🎯 Build terminé ! 
echo 📦 Version portable : dist_electron\win-unpacked\Eterna.exe
echo 🚀 Version installateur : Eterna.exe (racine)
echo 🌐 Utilisez scripts\create-release.bat pour créer une release GitHub
echo.
echo 💡 Si vous avez des problèmes d'installation, utilisez scripts\clean-eterna.bat

pause
