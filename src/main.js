const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../Eterna.ico'),
    titleBarStyle: 'hidden',
    frame: false,
    show: false
  });

  // Charger l'application
  if (isDev) {
    // Mode développement
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Mode production - Chemin corrigé
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Chargement du fichier:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Gérer la fermeture de la fenêtre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Gestion des erreurs de chargement
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Erreur de chargement:', errorCode, errorDescription, validatedURL);
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Créer la fenêtre quand l'app est prête
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers pour les contrôles de fenêtre
ipcMain.handle('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) mainWindow.close();
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
});

// IPC handlers pour la persistance des données
ipcMain.handle('save-data', async (event, filename, data) => {
  try {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, filename);
    
    await fs.writeFile(filePath, data, 'utf8');
    console.log('Données sauvegardées:', filePath);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
});

ipcMain.handle('load-data', async (event, filename) => {
  try {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, filename);
    
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Données chargées:', filePath);
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return null;
  }
});

ipcMain.handle('delete-data', async (event, filename) => {
  try {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, filename);
    
    await fs.unlink(filePath);
    console.log('Fichier supprimé:', filePath);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return false;
  }
});

