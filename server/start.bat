@echo off
echo ===== ETERNA - DÉMARRAGE SERVEUR =====
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si les dépendances sont installées
if not exist "..\node_modules" (
    echo Installation des dépendances...
    cd ..
    npm install
    cd server
    if %errorlevel% neq 0 (
        echo ERREUR: Échec de l'installation des dépendances
        pause
        exit /b 1
    )
)

REM Vérifier si le fichier .env existe
if not exist "..\.env" (
    echo ATTENTION: Le fichier .env n'existe pas
    if exist "..\env.example" (
        echo Copie de env.example vers .env...
        copy "..\env.example" "..\.env"
        echo Fichier .env créé. Veuillez le configurer avant de continuer.
        pause
    )
)

echo Démarrage du serveur backend...
echo Le serveur sera accessible sur: http://localhost:3000
echo.
echo Appuyez sur Ctrl+C pour arrêter
echo.

REM Démarrer le serveur backend
cd ..
npm run start:backend

pause










