// Système de traduction pour Eterna
export const translations = {
  fr: {
    // Interface générale
    app: {
      name: 'Eterna',
      online: 'En ligne',
      offline: 'Hors ligne',
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      confirm: 'Confirmer',
      yes: 'Oui',
      no: 'Non'
    },
    
    // Paramètres
    settings: {
      title: 'Paramètres utilisateur',
      myAccount: 'Mon compte',
      profile: 'Profil',
      privacy: 'Confidentialité',
      security: 'Sécurité',
      appearance: 'Apparence',
      notifications: 'Notifications',
      voice: 'Voix',
      chat: 'Chat',
      language: 'Langue',
      logout: 'Déconnexion',
      
      // Profil
      username: 'Nom d\'utilisateur',
      email: 'Email',
      avatar: 'Avatar',
      status: 'Statut',
      customStatus: 'Statut personnalisé',
      aboutMe: 'À propos de moi',
      
      // Apparence
      theme: 'Thème',
      dark: 'Sombre',
      light: 'Clair',
      auto: 'Automatique',
      colors: 'Couleurs',
      accent: 'Couleur d\'accent',
      transparency: 'Transparence',
      animations: 'Animations',
      
      // Notifications
      enableNotifications: 'Activer les notifications',
      sound: 'Son',
      mentions: 'Mentions',
      directMessages: 'Messages privés',
      serverUpdates: 'Mises à jour du serveur',
      
      // Langue
      language: 'Langue',
      french: 'Français',
      english: 'Anglais',
      german: 'Allemand',
      
      // Autres
      resetSettings: 'Réinitialiser les paramètres',
      resetConfirm: 'Êtes-vous sûr de vouloir réinitialiser tous vos paramètres ?',
      dataExport: 'Exporter les données',
      dataImport: 'Importer les données'
    }
  },
  
  en: {
    // General interface
    app: {
      name: 'Eterna',
      online: 'Online',
      offline: 'Offline',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No'
    },
    
    // Settings
    settings: {
      title: 'User Settings',
      myAccount: 'My Account',
      profile: 'Profile',
      privacy: 'Privacy',
      security: 'Security',
      appearance: 'Appearance',
      notifications: 'Notifications',
      voice: 'Voice',
      chat: 'Chat',
      language: 'Language',
      logout: 'Logout',
      
      // Profile
      username: 'Username',
      email: 'Email',
      avatar: 'Avatar',
      status: 'Status',
      customStatus: 'Custom Status',
      aboutMe: 'About Me',
      
      // Appearance
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
      auto: 'Auto',
      colors: 'Colors',
      accent: 'Accent Color',
      transparency: 'Transparency',
      animations: 'Animations',
      
      // Notifications
      enableNotifications: 'Enable Notifications',
      sound: 'Sound',
      mentions: 'Mentions',
      directMessages: 'Direct Messages',
      serverUpdates: 'Server Updates',
      
      // Language
      language: 'Language',
      french: 'French',
      english: 'English',
      german: 'German',
      
      // Others
      resetSettings: 'Reset Settings',
      resetConfirm: 'Are you sure you want to reset all your settings?',
      dataExport: 'Export Data',
      dataImport: 'Import Data'
    }
  },
  
  de: {
    // Allgemeine Benutzeroberfläche
    app: {
      name: 'Eterna',
      online: 'Online',
      offline: 'Offline',
      loading: 'Lädt...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      close: 'Schließen',
      confirm: 'Bestätigen',
      yes: 'Ja',
      no: 'Nein'
    },
    
    // Einstellungen
    settings: {
      title: 'Benutzereinstellungen',
      myAccount: 'Mein Konto',
      profile: 'Profil',
      privacy: 'Datenschutz',
      security: 'Sicherheit',
      appearance: 'Erscheinungsbild',
      notifications: 'Benachrichtigungen',
      voice: 'Stimme',
      chat: 'Chat',
      language: 'Sprache',
      logout: 'Abmelden',
      
      // Profil
      username: 'Benutzername',
      email: 'E-Mail',
      avatar: 'Avatar',
      status: 'Status',
      customStatus: 'Benutzerdefinierter Status',
      aboutMe: 'Über mich',
      
      // Erscheinungsbild
      theme: 'Thema',
      dark: 'Dunkel',
      light: 'Hell',
      auto: 'Automatisch',
      colors: 'Farben',
      accent: 'Akzentfarbe',
      transparency: 'Transparenz',
      animations: 'Animationen',
      
      // Benachrichtigungen
      enableNotifications: 'Benachrichtigungen aktivieren',
      sound: 'Ton',
      mentions: 'Erwähnungen',
      directMessages: 'Direktnachrichten',
      serverUpdates: 'Server-Updates',
      
      // Sprache
      language: 'Sprache',
      french: 'Französisch',
      english: 'Englisch',
      german: 'Deutsch',
      
      // Andere
      resetSettings: 'Einstellungen zurücksetzen',
      resetConfirm: 'Sind Sie sicher, dass Sie alle Ihre Einstellungen zurücksetzen möchten?',
      dataExport: 'Daten exportieren',
      dataImport: 'Daten importieren'
    }
  }
}

// Fonction utilitaire pour obtenir la traduction
export function t(key, language = 'fr') {
  const keys = key.split('.')
  let value = translations[language] || translations.fr
  
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k]
    } else {
      // Fallback vers le français si la traduction n'existe pas
      value = translations.fr
      for (const fallbackKey of keys) {
        if (value && value[fallbackKey] !== undefined) {
          value = value[fallbackKey]
        } else {
          return key // Retourner la clé si aucune traduction n'est trouvée
        }
      }
      break
    }
  }
  
  return value || key
}

// Hook Vue pour utiliser les traductions
export function useI18n() {
  const currentLanguage = { value: 'fr' } // Temporaire, sera connecté au store plus tard
  
  const t = (key) => {
    return translations[currentLanguage.value]?.[key] || key
  }
  
  const setLanguage = (language) => {
    console.log('Changement de langue vers:', language)
    // Sera connecté au store plus tard
  }
  
  return {
    t,
    currentLanguage,
    setLanguage,
    availableLanguages: ['fr', 'en', 'de']
  }
}
