# 🚀 Eterna - Application de Communication

Application de communication moderne et intuitive, construite avec Vue.js et Node.js.

## 📁 Structure du Projet

```
Eterna/
├── scripts/
│   ├── LAUNCH.bat        # 🚀 Lancement de l'application
│   ├── build-exe.bat     # 🔨 Construction de l'exécutable
│   └── README.md         # 📚 Documentation des scripts
├── src/                  # 📂 Code source
├── server/               # 🖥️  Serveur backend
├── database/             # 🗄️  Base de données
├── package.json          # 📦 Configuration npm
└── README.md             # 📖 Ce fichier
```

## 🚀 Démarrage Rapide

### Option 1 : Double-clic (Recommandé)
1. **Lancer l'app** : Double-cliquez sur `scripts\LAUNCH.bat`
2. **Construire l'exe** : Double-cliquez sur `scripts\build-exe.bat`

### Option 2 : Ligne de commande
```bash
# Installation des dépendances
npm install

# Mode développement
npm run dev

# Construction de production
npm run build
```

## 🔧 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** (installé avec Node.js)
- **Git** (pour cloner le projet)

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone [url-du-repo]
   cd Eterna
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application**
   ```bash
   npm run dev
   ```

## 🎯 Fonctionnalités

- 💬 **Chat en temps réel** avec WebSocket
- 🎨 **Interface moderne** et responsive
- 🌙 **Thèmes clair/sombre** automatiques
- 🔐 **Authentification sécurisée**
- 📱 **Design adaptatif** mobile/desktop
- 🎵 **Support audio** et notifications

## 🛠️ Technologies

- **Frontend** : Vue.js 3, Vite, CSS3
- **Backend** : Node.js, Express, Socket.io
- **Base de données** : SQLite
- **Build** : Vite, Electron (pour l'exécutable)

## 📚 Scripts Disponibles

### `scripts/LAUNCH.bat`
- Lance automatiquement l'application
- Vérifie et installe les dépendances si nécessaire
- Mode développement avec hot-reload

### `scripts/build-exe.bat`
- Construit l'application pour la production
- Crée le dossier `dist/` avec les fichiers optimisés
- Gestion d'erreurs robuste

## 🚨 Dépannage

### Problèmes courants
1. **Node.js non trouvé** : Installez Node.js depuis [nodejs.org](https://nodejs.org/)
2. **Dépendances manquantes** : Exécutez `npm install`
3. **Port déjà utilisé** : Fermez les autres applications ou changez le port

### Logs et erreurs
- Vérifiez la console pour les messages d'erreur
- Les logs sont affichés dans le terminal
- Utilisez `npm run build` pour vérifier la construction

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

---

**Développé avec ❤️ pour une communication moderne et intuitive**
