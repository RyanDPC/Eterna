@echo off
echo 🧹 Nettoyage Complet - Eterna App
echo ==================================

echo ⚠️  ATTENTION: Ce script va supprimer TOUTES les traces d'Eterna
echo.

:: Arrêter tous les processus Eterna
echo 🔄 Arrêt des processus Eterna...
taskkill /F /IM Eterna.exe >nul 2>&1
if errorlevel 1 (
    echo ✅ Aucun processus Eterna en cours
) else (
    echo ✅ Processus Eterna arrêtés
)

:: Supprimer les raccourcis du bureau
echo 🗑️  Suppression des raccourcis du bureau...
if exist "%USERPROFILE%\Desktop\Eterna.lnk" (
    del "%USERPROFILE%\Desktop\Eterna.lnk"
    echo ✅ Raccourci bureau supprimé
)

:: Supprimer les raccourcis du menu démarrer
echo 🗑️  Suppression des raccourcis du menu démarrer...
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Eterna" (
    rmdir /s /q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Eterna"
    echo ✅ Raccourcis menu démarrer supprimés
)

:: Supprimer les données de l'application
echo 🗑️  Suppression des données de l'application...
if exist "%APPDATA%\Eterna" (
    rmdir /s /q "%APPDATA%\Eterna"
    echo ✅ Données app supprimées
)

if exist "%LOCALAPPDATA%\Eterna" (
    rmdir /s /q "%LOCALAPPDATA%\Eterna"
    echo ✅ Données locales supprimées
)

:: Supprimer les clés de registre (optionnel)
echo 🔍 Vérification des clés de registre...
reg query "HKEY_CURRENT_USER\Software\Eterna" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Clés de registre trouvées (suppression manuelle recommandée)
    echo 💡 Utilisez regedit pour supprimer HKEY_CURRENT_USER\Software\Eterna
)

:: Nettoyer les dossiers de build
echo 🧹 Nettoyage des dossiers de build...
if exist "dist" (
    rmdir /s /q "dist"
    echo ✅ Dossier dist supprimé
)

if exist "dist_electron" (
    rmdir /s /q "dist_electron"
    echo ✅ Dossier dist_electron supprimé
)

echo.
echo ✅ Nettoyage terminé !
echo 💡 Vous pouvez maintenant réinstaller Eterna sans conflit
echo.

pause




