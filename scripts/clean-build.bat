@echo off
echo 🧹 Nettoyage Rapide - Eterna App
echo =================================

:: Aller au répertoire racine
cd /d "%~dp0.."
if not exist "package.json" (
    echo ❌ package.json non trouvé
    pause
    exit /b 1
)

echo 🔄 Arrêt des processus Eterna en cours...
taskkill /F /IM Eterna.exe >nul 2>&1
if errorlevel 1 (
    echo ✅ Aucun processus Eterna en cours
) else (
    echo ✅ Processus Eterna arrêtés
)

echo.
echo 🧹 Nettoyage automatique des fichiers de build...
echo 📁 Suppression des fichiers inutiles...

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
echo 🎯 Nettoyage terminé ! 
echo 📦 Version portable conservée : dist_electron\win-unpacked\Eterna.exe
echo 🚀 Version installateur conservée : Eterna.exe (racine)
echo.
echo 💡 Utilisez scripts\build-exe.bat pour un build complet + nettoyage automatique

pause
