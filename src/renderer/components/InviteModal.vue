<template>
  <Teleport to="body">
    <div class="modal-root">
      <div class="modal-overlay" @click="$emit('close')"></div>
      <div class="modal-dialog">
        <!-- En-tête du modal -->
        <div class="modal-header">
          <div class="modal-icon">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 class="modal-title">Rejoindre un serveur</h1>
          <p class="modal-subtitle">Entrez le code d'invitation pour rejoindre un serveur</p>
        </div>

        <!-- Contenu du modal -->
        <div class="modal-body">
          <!-- Champ de saisie du code d'invitation -->
          <div class="invite-input-section">
            <label for="inviteCode" class="input-label">Code d'invitation</label>
            <div class="input-container">
              <input
                id="inviteCode"
                v-model="inviteCode"
                type="text"
                placeholder="Ex: abc123def"
                class="invite-input"
                @keyup.enter="joinServerByInvite"
                maxlength="20"
              />
              <button
                @click="joinServerByInvite"
                class="join-button"
                :disabled="!inviteCode.trim() || isJoining"
              >
                <span v-if="isJoining" class="loading-spinner"></span>
                {{ isJoining ? 'Rejoignant...' : 'Rejoindre' }}
              </button>
            </div>
            <p class="input-help">
              Le code d'invitation est généralement composé de 8 caractères (lettres et chiffres)
            </p>
          </div>

          <!-- Informations sur le serveur trouvé -->
          <div v-if="foundServer" class="server-preview">
            <h3 class="preview-title">Serveur trouvé</h3>
            <div class="server-card">
              <div class="server-avatar">
                {{ foundServer.name.charAt(0).toUpperCase() }}
              </div>
              <div class="server-info">
                <h4 class="server-name">{{ foundServer.name }}</h4>
                <p v-if="foundServer.description" class="server-description">
                  {{ foundServer.description }}
                </p>
                <div class="server-meta">
                  <span class="meta-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {{ foundServer.members?.length || 0 }} membre{{ (foundServer.members?.length || 0) > 1 ? 's' : '' }}
                  </span>
                  <span class="meta-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s9 3.582 9 8z" />
                    </svg>
                    {{ foundServer.channels?.length || 0 }} canal{{ (foundServer.channels?.length || 0) > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="error-message">
            <div class="error-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Message de succès -->
          <div v-if="successMessage" class="success-message">
            <div class="success-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>{{ successMessage }}</span>
          </div>

          <!-- Bouton fermer -->
          <div class="modal-actions">
            <button
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              Fermer
            </button>
          </div>
        </div>

        <!-- Bouton fermer en haut -->
        <button
          @click="$emit('close')"
          class="modal-close"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'

// Props et emits
const emit = defineEmits(['close', 'joined'])

// Stores
const appStore = useAppStore()
const authStore = useAuthStore()

// État local
const inviteCode = ref('')
const isJoining = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Serveur trouvé par le code d'invitation
const foundServer = computed(() => {
  if (!inviteCode.value.trim()) return null
  
  const code = inviteCode.value.trim()
  return appStore.servers.find(server => server.inviteLink === code)
})

// Surveiller les changements du code d'invitation
watch(inviteCode, () => {
  // Réinitialiser les messages
  errorMessage.value = ''
  successMessage.value = ''
})

// Rejoindre le serveur par invitation
const joinServerByInvite = async () => {
  const code = inviteCode.value.trim()
  if (!code) return

  try {
    isJoining.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Vérifier que l'utilisateur est connecté
    if (!authStore.currentUser?.id) {
      throw new Error('Vous devez être connecté pour rejoindre un serveur')
    }

    // Rejoindre le serveur
    await appStore.joinServerByInvite(code, authStore.currentUser.id)
    
    successMessage.value = `Vous avez rejoint le serveur "${foundServer.value?.name}" avec succès !`
    
    // Fermer le modal après un délai
    setTimeout(() => {
      emit('joined', foundServer.value?.id)
      emit('close')
    }, 2000)
    
  } catch (error) {
    console.error('Erreur lors de la jointure:', error)
    errorMessage.value = error.message || 'Erreur lors de la jointure du serveur'
  } finally {
    isJoining.value = false
  }
}
</script>

<style scoped>
/* Modal root */
.modal-root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Overlay */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}

/* Dialog */
.modal-dialog {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #2d3748;
  border-radius: 24px;
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  z-index: 1;
}

/* En-tête du modal */
.modal-header {
  text-align: center;
  padding: 40px 40px 20px;
  background: linear-gradient(135deg, #2d3748 0%, #1a1a2e 100%);
  border-radius: 24px 24px 0 0;
}

.modal-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.modal-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  font-size: 1.125rem;
  color: #a0aec0;
  margin: 0;
}

/* Corps du modal */
.modal-body {
  padding: 40px;
}

/* Section de saisie */
.invite-input-section {
  margin-bottom: 32px;
}

.input-label {
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.input-container {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.invite-input {
  flex: 1;
  padding: 16px 20px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 12px;
  color: white;
  font-size: 1.125rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.invite-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.invite-input::placeholder {
  color: #718096;
  letter-spacing: normal;
}

.input-help {
  font-size: 0.875rem;
  color: #a0aec0;
  font-style: italic;
  margin: 0;
}

.join-button {
  padding: 16px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.join-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
}

.join-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Aperçu du serveur */
.server-preview {
  margin-bottom: 32px;
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.server-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 16px;
}

.server-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  flex-shrink: 0;
}

.server-info {
  flex: 1;
  min-width: 0;
}

.server-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.server-description {
  color: #a0aec0;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 12px;
}

.server-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #718096;
  font-size: 0.875rem;
}

/* Messages */
.error-message,
.success-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-weight: 500;
}

.error-message {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #fca5a5;
}

.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
}

.error-icon,
.success-icon {
  flex-shrink: 0;
}

/* Spinner de chargement */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Boutons d'action */
.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.btn {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #4a5568;
  color: white;
}

.btn-secondary:hover {
  background: #2d3748;
  transform: translateY(-2px);
}

/* Bouton fermer */
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(45, 55, 72, 0.8);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(45, 55, 72, 1);
  color: white;
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-dialog {
    width: 95%;
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 30px 20px 20px;
  }
  
  .modal-body {
    padding: 30px 20px;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .input-container {
    flex-direction: column;
  }
  
  .join-button {
    width: 100%;
  }
  
  .server-card {
    flex-direction: column;
    text-align: center;
  }
  
  .server-meta {
    justify-content: center;
  }
}
</style>
