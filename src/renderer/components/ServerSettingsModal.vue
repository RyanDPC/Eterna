<template>
  <Teleport to="body">
    <div class="modal-root">
      <div class="modal-overlay" @click="$emit('close')"></div>
      <div class="modal-dialog">
        <!-- En-tête du modal -->
        <div class="modal-header">
          <div class="modal-icon">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 class="modal-title">Paramètres du serveur</h1>
          <p class="modal-subtitle">{{ server?.name }}</p>
        </div>

        <!-- Contenu du modal -->
        <div class="modal-body">
          <!-- Informations du serveur -->
          <div class="server-info-section">
            <h3 class="section-title">Informations du serveur</h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">Nom</label>
                <span class="info-value">{{ server?.name }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Type</label>
                <span class="info-value">
                  <span :class="['type-badge', server?.type === 'public' ? 'type-public' : 'type-private']">
                    {{ server?.type === 'public' ? 'Public' : 'Privé' }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <label class="info-label">Membres</label>
                <span class="info-value">{{ server?.members?.length || 0 }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Canaux</label>
                <span class="info-value">{{ server?.channels?.length || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Lien d'invitation -->
          <div class="invite-section">
            <h3 class="section-title">Lien d'invitation</h3>
            <p class="section-description">
              Partagez ce lien avec vos amis pour qu'ils puissent rejoindre le serveur.
            </p>
            
            <div class="invite-link-container">
              <div class="invite-link-display">
                <span class="invite-code">{{ server?.inviteLink || 'Génération...' }}</span>
                <button
                  @click="copyInviteLink"
                  class="copy-button"
                  :title="copyStatus === 'copied' ? 'Copié !' : 'Copier le lien'"
                >
                  <svg v-if="copyStatus === 'idle'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="copyStatus === 'copied'" class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
              
              <button
                @click="regenerateInviteLink"
                class="regenerate-button"
                :disabled="isRegenerating"
              >
                <span v-if="isRegenerating" class="loading-spinner"></span>
                {{ isRegenerating ? 'Régénération...' : 'Régénérer le lien' }}
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions-section">
            <h3 class="section-title">Actions</h3>
            <div class="actions-grid">
              <button
                @click="leaveServer"
                class="action-button danger"
                :disabled="isLeaving"
              >
                <span v-if="isLeaving" class="loading-spinner"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {{ isLeaving ? 'Départ...' : 'Quitter le serveur' }}
              </button>
            </div>
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
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'

// Props et emits
const props = defineProps({
  server: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'leave'])

// Stores
const appStore = useAppStore()
const authStore = useAuthStore()

// État local
const copyStatus = ref('idle')
const isRegenerating = ref(false)
const isLeaving = ref(false)

// Vérifier si l'utilisateur est propriétaire du serveur
const isOwner = computed(() => {
  return props.server?.ownerId === authStore.currentUser?.id
})

// Copier le lien d'invitation
const copyInviteLink = async () => {
  try {
    const inviteLink = `${window.location.origin}/invite/${props.server?.inviteLink}`
    await navigator.clipboard.writeText(inviteLink)
    
    copyStatus.value = 'copied'
    setTimeout(() => {
      copyStatus.value = 'idle'
    }, 2000)
    
    console.log('Lien d\'invitation copié:', inviteLink)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

// Régénérer le lien d'invitation
const regenerateInviteLink = async () => {
  try {
    isRegenerating.value = true
    
    await appStore.regenerateInviteLink(props.server.id)
    
    console.log('Nouveau lien d\'invitation généré')
  } catch (error) {
    console.error('Erreur lors de la régénération:', error)
  } finally {
    isRegenerating.value = false
  }
}

// Quitter le serveur
const leaveServer = async () => {
  if (!confirm('Êtes-vous sûr de vouloir quitter ce serveur ?')) {
    return
  }

  try {
    isLeaving.value = true
    
    await appStore.leaveServer(props.server.id, authStore.currentUser?.id)
    
    emit('leave', props.server.id)
    emit('close')
    
    console.log('Serveur quitté avec succès')
  } catch (error) {
    console.error('Erreur lors du départ:', error)
  } finally {
    isLeaving.value = false
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
  max-width: 600px;
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
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
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
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  font-size: 1.25rem;
  color: #a0aec0;
  margin: 0;
}

/* Corps du modal */
.modal-body {
  padding: 40px;
}

/* Sections */
.server-info-section,
.invite-section,
.actions-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.section-description {
  color: #a0aec0;
  font-size: 1rem;
  margin-bottom: 20px;
  line-height: 1.6;
}

/* Grille d'informations */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  background: #2d3748;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #4a5568;
}

.info-label {
  display: block;
  font-size: 0.875rem;
  color: #a0aec0;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
}

/* Badge de type */
.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.type-public {
  background: #10b981;
  color: white;
}

.type-private {
  background: #f59e0b;
  color: white;
}

/* Lien d'invitation */
.invite-link-container {
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 16px;
  padding: 24px;
}

.invite-link-display {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.invite-code {
  flex: 1;
  background: #1a1a2e;
  padding: 16px 20px;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b82f6;
  border: 1px solid #4a5568;
}

.copy-button {
  width: 48px;
  height: 48px;
  background: #4a5568;
  border: none;
  border-radius: 12px;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.regenerate-button {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.regenerate-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
}

.regenerate-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Actions */
.actions-grid {
  display: grid;
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.danger {
  background: #dc2626;
  color: white;
}

.action-button.danger:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-2px);
}

.action-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner de chargement */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
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
  margin-top: 40px;
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
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .invite-link-display {
    flex-direction: column;
    align-items: stretch;
  }
  
  .invite-code {
    text-align: center;
  }
}
</style>


