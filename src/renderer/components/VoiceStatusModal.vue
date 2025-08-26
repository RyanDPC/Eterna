<template>
  <div 
    v-if="isVisible"
    class="voice-status-modal"
    :style="modalStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <!-- En-tête minimaliste avec drag handle -->
    <div class="modal-header">
      <div class="drag-handle">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <button @click="closeModal" class="close-btn" title="Fermer">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Contenu compact et élégant -->
    <div class="modal-content">
      <!-- Profil utilisateur compact -->
      <div class="user-profile">
        <div class="user-avatar">
          <span class="avatar-text">{{ getUserInitial }}</span>
          <div class="status-ring" :class="{ 'speaking': voiceStatus.isSpeaking }"></div>
        </div>
        <div class="user-info">
          <div class="username">{{ getUserDisplayName }}</div>
          <div class="user-status">{{ voiceStatus.currentVoiceChannel?.name || 'Aucun canal' }}</div>
        </div>
      </div>

      <!-- Contrôles vocaux compacts -->
      <div class="voice-controls">
        <button 
          @click="toggleMute"
          :class="['control-btn', voiceStatus.isMuted ? 'muted' : 'unmuted']"
          :title="voiceStatus.isMuted ? 'Activer micro' : 'Désactiver micro'"
        >
          <svg v-if="voiceStatus.isMuted" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <line x1="17" y1="14" x2="19" y2="16" />
            <line x1="19" y1="14" x2="17" y2="16" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        
        <button 
          @click="toggleDeafen"
          :class="['control-btn', voiceStatus.isDeafened ? 'deafened' : 'undeafened']"
          :title="voiceStatus.isDeafened ? 'Activer son' : 'Désactiver son'"
        >
          <svg v-if="voiceStatus.isDeafened" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
        
        <button 
          @click="disconnect"
          class="control-btn disconnect"
          title="Quitter le vocal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    default: null
  }
})

// Émettre les événements
const emit = defineEmits(['close'])

// Store
const appStore = useAppStore()

// État local pour le drag & drop
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const position = ref({ x: 100, y: 100 })

// Style du modal - draggable partout
const modalStyle = computed(() => {
  return {
    left: position.value.x + 'px',
    top: position.value.y + 'px',
    position: 'fixed',
    zIndex: 1000
  }
})

// Informations utilisateur
const getUserInitial = computed(() => {
  if (!props.currentUser) return 'U'
  return (props.currentUser.displayName || props.currentUser.username || 'U').charAt(0).toUpperCase()
})

const getUserDisplayName = computed(() => {
  if (!props.currentUser) return 'Utilisateur'
  return props.currentUser.displayName || props.currentUser.username || 'Utilisateur'
})

// Statut vocal depuis le store
const voiceStatus = computed(() => appStore.voiceStatus)

// Fonction de glissement améliorée pour plus de fluidité
const startDrag = (event) => {
  // Empêcher la sélection de texte pendant le drag
  event.preventDefault()
  
  isDragging.value = true
  const clientX = event.clientX || event.touches?.[0]?.clientX
  const clientY = event.clientY || event.touches?.[0]?.clientY
  
  dragStart.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }
  
  // Ajouter une classe pour le curseur de drag
  document.body.style.cursor = 'grabbing'
  document.body.style.userSelect = 'none'
  
  document.addEventListener('mousemove', onDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value) return
  
  // Empêcher le scroll et la sélection
  event.preventDefault()
  
  const clientX = event.clientX || event.touches?.[0]?.clientX
  const clientY = event.clientY || event.touches?.[0]?.clientY
  
  // Calculer la nouvelle position avec une animation fluide
  const newX = clientX - dragStart.value.x
  const newY = clientY - dragStart.value.y
  
  // Appliquer la position directement pour un mouvement fluide
  position.value = {
    x: newX,
    y: newY
  }
}

const stopDrag = (event) => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  // Restaurer le curseur et la sélection
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// Contrôles vocaux SÉCURISÉS
const toggleMute = () => {
  // Vérifier que l'utilisateur contrôle son propre statut
  if (appStore.canControlUser(props.currentUser?.id)) {
    appStore.toggleMute(props.currentUser?.id)
  } else {
    console.warn('Tentative non autorisée de contrôle du micro')
  }
}

const toggleDeafen = () => {
  // Vérifier que l'utilisateur contrôle son propre statut
  if (appStore.canControlUser(props.currentUser?.id)) {
    appStore.toggleDeafen(props.currentUser?.id)
  } else {
    console.warn('Tentative non autorisée de contrôle du son')
  }
}

const disconnect = () => {
  // Vérifier que l'utilisateur se déconnecte lui-même
  if (appStore.canControlUser(props.currentUser?.id)) {
    appStore.disconnectFromVoiceChannel(props.currentUser?.id)
    closeModal()
  } else {
    console.warn('Tentative non autorisée de déconnexion')
  }
}

const closeModal = () => {
  emit('close')
}

// Nettoyage des événements
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>

<style scoped>
.voice-status-modal {
  width: 200px;
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px);
  overflow: hidden;
  user-select: none;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: fixed;
  z-index: 1000;
  cursor: grab;
}

.voice-status-modal:active {
  cursor: grabbing;
}

.voice-status-modal:hover {
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
  background: rgba(17, 24, 39, 0.7);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(236, 72, 153, 0.15);
  border-bottom: 1px solid rgba(236, 72, 153, 0.2);
  cursor: grab;
}

.modal-header:active {
  cursor: grabbing;
}

.drag-handle {
  display: flex;
  align-items: center;
  color: rgba(236, 72, 153, 0.7);
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.close-btn {
  width: 18px;
  height: 18px;
  background: rgba(236, 72, 153, 0.2);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(236, 72, 153, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(236, 72, 153, 0.3);
  border-color: rgba(236, 72, 153, 0.5);
  color: rgba(236, 72, 153, 1);
  transform: scale(1.1);
}

.modal-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Profil utilisateur compact et élégant */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.status-ring {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(236, 72, 153, 0.8);
  border: 2px solid rgba(17, 24, 39, 0.9);
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.4);
  transition: all 0.3s ease;
}

.status-ring.speaking {
  background: #10b981;
  animation: pulse 1.5s ease-in-out infinite;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.username {
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.user-status {
  color: rgba(236, 72, 153, 0.8);
  font-size: 11px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Contrôles vocaux compacts et élégants */
.voice-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn.unmuted {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.control-btn.unmuted:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.control-btn.muted {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.control-btn.muted:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.control-btn.undeafened {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.control-btn.undeafened:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.control-btn.deafened {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.control-btn.deafened:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
}

.control-btn.disconnect {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.control-btn.disconnect:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>
