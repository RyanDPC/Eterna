@echo off
echo ===== ETERNA - LANCEMENT COMPLET =====
echo.

echo 🚀 Lancement de l'application Eterna...
echo.

REM Aller à la racine du projet
cd /d "%~dp0.."

REM Vérifier que package.json existe
if not exist "package.json" (
    echo ❌ ERREUR: package.json non trouvé
    pause
    exit /b 1
)

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Installation échouée
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
)

echo.
echo 🔧 Lancement du serveur backend...
start "Eterna Backend" cmd /k "npm run dev:backend"

echo.
echo ⏳ Attendre 3 secondes que le serveur démarre...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Lancement du frontend...
start "Eterna Frontend" cmd /k "npm run dev:frontend"

echo.
echo ========================================
echo    ✅ Eterna est en cours de lancement !
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🖥️  Backend: http://localhost:3000
echo.
echo 🔄 Fermez cette fenêtre quand vous avez fini
echo.
pause
