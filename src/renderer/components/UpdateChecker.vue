<template>
  <div v-if="showUpdateNotification" class="update-notification">
    <div class="update-content">
      <div class="update-icon">🔄</div>
      <div class="update-text">
        <h3>Nouvelle version disponible !</h3>
        <p>Version {{ latestVersion }} est maintenant disponible</p>
        <div class="update-actions">
          <button @click="downloadUpdate" class="btn-primary">
            📥 Télécharger
          </button>
          <button @click="dismissUpdate" class="btn-secondary">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'

export default {
  name: 'UpdateChecker',
  setup() {
    const appStore = useAppStore()
    const showUpdateNotification = ref(false)
    const latestVersion = ref('')
    const currentVersion = ref('')
    const updateCheckInterval = ref(null)

    const checkForUpdates = async () => {
      try {
        // Récupérer la version actuelle depuis package.json
        const response = await fetch('/package.json')
        const packageData = await response.json()
        currentVersion.value = packageData.version

        // Vérifier la dernière release sur GitHub
        const releasesResponse = await fetch('https://api.github.com/repos/ryand/Eterna/releases/latest')
        const releaseData = await releasesResponse.json()
        
        if (releaseData.tag_name && releaseData.tag_name !== `v${currentVersion.value}`) {
          latestVersion.value = releaseData.tag_name
          showUpdateNotification.value = true
          
          // Sauvegarder l'info de mise à jour
          appStore.setUpdateAvailable({
            version: latestVersion.value,
            downloadUrl: releaseData.assets?.[0]?.browser_download_url || '',
            releaseNotes: releaseData.body || ''
          })
        }
      } catch (error) {
        console.log('Erreur lors de la vérification des mises à jour:', error)
      }
    }

    const downloadUpdate = () => {
      if (appStore.updateInfo?.downloadUrl) {
        window.open(appStore.updateInfo.downloadUrl, '_blank')
      }
      dismissUpdate()
    }

    const dismissUpdate = () => {
      showUpdateNotification.value = false
      // Ne pas afficher à nouveau pendant 24h
      localStorage.setItem('updateDismissed', Date.now().toString())
    }

    const shouldShowUpdate = () => {
      const dismissed = localStorage.getItem('updateDismissed')
      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60)
        return hoursSinceDismissed >= 24
      }
      return true
    }

    onMounted(() => {
      // Vérifier immédiatement
      if (shouldShowUpdate()) {
        checkForUpdates()
      }

      // Vérifier toutes les heures
      updateCheckInterval.value = setInterval(() => {
        if (shouldShowUpdate()) {
          checkForUpdates()
        }
      }, 60 * 60 * 1000)
    })

    onUnmounted(() => {
      if (updateCheckInterval.value) {
        clearInterval(updateCheckInterval.value)
      }
    })

    return {
      showUpdateNotification,
      latestVersion,
      downloadUpdate,
      dismissUpdate
    }
  }
}
</script>

<style scoped>
.update-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 350px;
  animation: slideIn 0.3s ease-out;
}

.update-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.update-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.update-text h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.update-text p {
  margin: 0 0 15px 0;
  font-size: 14px;
  opacity: 0.9;
}

.update-actions {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .update-notification {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
