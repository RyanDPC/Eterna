# 🚀 Guide de Release Automatique - Eterna

Ce guide explique comment utiliser le système de release automatique qui place l'exécutable à la racine du projet et met à jour automatiquement le frontend.

## 📋 Prérequis

- Node.js 18+ installé
- Git configuré avec accès au repository
- GitHub Actions activé sur le repository

## 🔄 Processus de Release Automatique

### 1. Build et Copie Automatique

Le script `scripts/build-exe.bat` :
- Build l'application complète
- Copie automatiquement l'exécutable à la racine du projet
- Rend l'exécutable visible par GitHub

### 2. Création de Release

Utilisez le script `scripts/create-release.bat` :

```bash
# Exécuter le script
scripts\create-release.bat
```

Le script va :
- Vérifier le statut Git
- Demander la nouvelle version (ex: v1.1.0)
- Mettre à jour `package.json`
- Créer un tag Git
- Pousser les changements

### 3. GitHub Actions Automatique

Dès qu'un tag est poussé, GitHub Actions :
- Build automatiquement l'application
- Crée la release GitHub
- Attache l'exécutable à la release
- Met à jour le frontend

## 📁 Structure des Fichiers

```
Eterna/
├── Eterna-Setup-1.0.0.exe          ← Exécutable à la racine (visible par GitHub)
├── .github/workflows/release.yml    ← Workflow GitHub Actions
├── scripts/
│   ├── build-exe.bat               ← Build + copie automatique
│   └── create-release.bat          ← Création de release
└── src/renderer/components/
    └── UpdateChecker.vue           ← Vérification automatique des mises à jour
```

## 🎯 Workflow Complet

### Étape 1 : Développement
```bash
# Faire vos modifications
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main
```

### Étape 2 : Release
```bash
# Créer une release
scripts\create-release.bat
# Suivre les instructions (version, etc.)
```

### Étape 3 : Automatisation
- GitHub Actions build automatiquement
- L'exécutable est créé et copié à la racine
- La release est publiée avec l'exécutable
- Le frontend est mis à jour automatiquement

## 🔍 Vérification des Mises à Jour

Le composant `UpdateChecker.vue` :
- Vérifie automatiquement les nouvelles versions
- Affiche une notification élégante
- Permet le téléchargement direct
- Se souvient des préférences utilisateur

## 📱 Interface Utilisateur

L'utilisateur voit :
- Notification de mise à jour disponible
- Bouton de téléchargement direct
- Option "Plus tard" (ne se redemande pas avant 24h)

## 🛠️ Configuration Avancée

### Personnalisation du Workflow

Modifiez `.github/workflows/release.yml` pour :
- Changer la fréquence de vérification
- Ajouter des étapes de test
- Personnaliser le processus de build

### Personnalisation des Notifications

Modifiez `UpdateChecker.vue` pour :
- Changer l'apparence des notifications
- Modifier la fréquence de vérification
- Personnaliser les messages

## 🚨 Dépannage

### L'exécutable n'est pas copié
- Vérifiez que `dist_electron\Eterna-Setup-1.0.0.exe` existe
- Relancez `scripts\build-exe.bat`

### GitHub Actions ne se déclenche pas
- Vérifiez que le tag suit le format `v*`
- Vérifiez les permissions GitHub Actions
- Consultez l'onglet Actions sur GitHub

### Le frontend ne se met pas à jour
- Vérifiez que l'UpdateChecker est bien importé dans App.vue
- Consultez la console pour les erreurs
- Vérifiez les permissions CORS

## 📚 Commandes Utiles

```bash
# Build manuel
scripts\build-exe.bat

# Création de release
scripts\create-release.bat

# Vérification du statut Git
git status

# Voir les tags
git tag

# Voir les releases GitHub
gh release list
```

## 🎉 Avantages du Système

✅ **Automatisation complète** : Plus besoin de copier manuellement les fichiers  
✅ **Visibilité GitHub** : L'exécutable est toujours visible dans le repository  
✅ **Mises à jour automatiques** : Le frontend se met à jour tout seul  
✅ **Processus standardisé** : Workflow reproductible et fiable  
✅ **Notifications utilisateur** : L'utilisateur est informé des nouvelles versions  

## 🔗 Liens Utiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Electron Builder](https://www.electron.build/)
- [Vue.js](https://vuejs.org/)
- [Pinia Store](https://pinia.vuejs.org/)

---

**💡 Conseil** : Testez d'abord le processus sur une branche de développement avant de l'utiliser en production.
