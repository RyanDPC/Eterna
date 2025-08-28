/**
 * 🎨 Gestionnaire de thème simplifié pour Eterna
 * Un seul thème de base, sans adaptation automatique
 */

class ThemeManager {
  constructor() {
    this.currentTheme = 'base'
    this.init()
  }

  /**
   * Initialise le gestionnaire de thème
   */
  init() {
    console.log('🎨 ThemeManager initialisé - Thème de base activé')
    this.applyBaseTheme()
  }

  /**
   * Applique le thème de base d'Eterna
   */
  applyBaseTheme() {
    // Supprimer tous les attributs de thème
    document.documentElement.removeAttribute('data-theme')
    document.body.removeAttribute('data-theme')
    
    // Supprimer toutes les classes de thème
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-auto')
    document.body.classList.add('theme-base')
    
    console.log('🎨 Thème de base d\'Eterna appliqué')
    
    this.emitThemeChange('base')
  }

  /**
   * Émet un événement de changement de thème
   */
  emitThemeChange(theme) {
    const event = new CustomEvent('themeChanged', {
      detail: { theme, isBase: true }
    })
    window.dispatchEvent(event)
  }

  /**
   * Obtient le thème actuel
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * Obtient le thème appliqué
   */
  getAppliedTheme() {
    return 'base'
  }

  /**
   * Vérifie si c'est le thème de base
   */
  isBaseTheme() {
    return true
  }

  /**
   * Force l'application du thème de base
   */
  forceBaseTheme() {
    console.log('🔄 Forçage de l\'application du thème de base')
    this.applyBaseTheme()
  }

  /**
   * Rafraîchit le thème (toujours le thème de base)
   */
  refreshTheme() {
    console.log('🔄 Rafraîchissement du thème de base')
    this.applyBaseTheme()
  }

  /**
   * Obtient les informations de debug
   */
  getDebugInfo() {
    return {
      currentTheme: this.currentTheme,
      appliedTheme: this.getAppliedTheme(),
      htmlDataTheme: document.documentElement.getAttribute('data-theme'),
      bodyDataTheme: document.body.getAttribute('data-theme'),
      bodyClasses: document.body.className,
      isBaseTheme: this.isBaseTheme()
    }
  }
}

// Créer et exposer l'instance
const themeManager = new ThemeManager()

// Exposer globalement pour compatibilité
if (typeof window !== 'undefined') {
  window.themeManager = themeManager
}

export default themeManager
