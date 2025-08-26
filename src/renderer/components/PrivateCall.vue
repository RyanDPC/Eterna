<template>
  <div class="private-call-overlay" @click="$emit('close')">
    <div class="private-call-modal" @click.stop>
      <!-- Header de l'appel -->
      <div class="call-header">
        <div class="call-user-info">
          <div class="user-avatar">
            <img :src="friend.avatar || '/default-avatar.png'" :alt="friend.username" />
            <div :class="['status-indicator', friend.status === 'online' ? 'online' : 'offline']"></div>
          </div>
          <div class="user-details">
            <span class="username">{{ friend.username }}</span>
            <span class="call-status">{{ callStatus }}</span>
          </div>
        </div>
        <button @click="$emit('close')" class="btn-close" title="Fermer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenu de l'appel -->
      <div class="call-content">
        <!-- Appel en cours -->
        <div v-if="callState === 'connected'" class="call-active">
          <div class="call-timer">
            <span class="timer-label">Durée de l'appel</span>
            <span class="timer-value">{{ formatCallDuration }}</span>
          </div>
          
          <!-- Vidéo de l'ami (si appel vidéo) -->
          <div v-if="callType === 'video'" class="friend-video">
            <video ref="friendVideo" autoplay muted class="video-stream"></video>
            <div class="video-overlay">
              <span class="video-name">{{ friend.username }}</span>
            </div>
          </div>
          
          <!-- Audio uniquement -->
          <div v-else class="audio-only">
            <div class="audio-avatar">
              <img :src="friend.avatar || '/default-avatar.png'" :alt="friend.username" />
            </div>
            <div class="audio-info">
              <span class="audio-name">{{ friend.username }}</span>
              <span class="audio-status">Appel vocal en cours</span>
            </div>
          </div>
        </div>

        <!-- Appel en cours de connexion -->
        <div v-else-if="callState === 'connecting'" class="call-connecting">
          <div class="connecting-spinner">
            <div class="spinner"></div>
          </div>
          <div class="connecting-text">
            <span class="connecting-title">Connexion en cours...</span>
            <span class="connecting-subtitle">Appel de {{ friend.username }}</span>
          </div>
        </div>

        <!-- Appel entrant -->
        <div v-else-if="callState === 'incoming'" class="call-incoming">
          <div class="incoming-avatar">
            <img :src="friend.avatar || '/default-avatar.png'" :alt="friend.username" />
          </div>
          <div class="incoming-info">
            <span class="incoming-title">Appel entrant</span>
            <span class="incoming-name">{{ friend.username }}</span>
            <span class="incoming-type">{{ callType === 'video' ? 'Appel vidéo' : 'Appel vocal' }}</span>
          </div>
        </div>
      </div>

      <!-- Contrôles de l'appel -->
      <div class="call-controls">
        <!-- Boutons d'action -->
        <div class="control-buttons">
          <!-- Appel entrant -->
          <template v-if="callState === 'incoming'">
            <button @click="acceptCall" class="btn-accept" title="Accepter">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button @click="rejectCall" class="btn-reject" title="Refuser">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </template>

          <!-- Appel en cours -->
          <template v-else-if="callState === 'connected'">
            <button @click="toggleMute" :class="['btn-mute', { 'active': isMuted }]" :title="isMuted ? 'Activer le micro' : 'Couper le micro'">
              <svg v-if="!isMuted" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </button>
            
            <button @click="toggleDeafen" :class="['btn-deafen', { 'active': isDeafened }]" :title="isDeafened ? 'Activer le son' : 'Couper le son'">
              <svg v-if="!isDeafened" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </button>
            
            <button @click="endCall" class="btn-end" title="Terminer l'appel">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </template>

          <!-- Appel en cours de connexion -->
          <template v-else>
            <button @click="cancelCall" class="btn-cancel" title="Annuler">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </template>
        </div>

        <!-- Informations supplémentaires -->
        <div class="call-info">
          <span class="call-type">{{ callType === 'video' ? 'Appel vidéo' : 'Appel vocal' }}</span>
          <span v-if="callState === 'connected'" class="call-quality">Qualité: {{ callQuality }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFriendsStore } from '../stores/friendsStore'

// Props
const props = defineProps({
  friend: {
    type: Object,
    required: true
  },
  callType: {
    type: String,
    default: 'voice', // 'voice' ou 'video'
    validator: (value) => ['voice', 'video'].includes(value)
  }
})

// Emits
const emit = defineEmits(['close'])

// Store
const friendsStore = useFriendsStore()

// Réfs
const friendVideo = ref(null)
const callStartTime = ref(null)
const callDuration = ref(0)
const callTimer = ref(null)

// État de l'appel
const callState = ref('connecting') // 'connecting', 'connected', 'incoming', 'ended'
const isMuted = ref(false)
const isDeafened = ref(false)
const callQuality = ref('Excellente')

// Computed
const callStatus = computed(() => {
  switch (callState.value) {
    case 'connecting': return 'Connexion...'
    case 'connected': return 'En cours'
    case 'incoming': return 'Appel entrant'
    case 'ended': return 'Terminé'
    default: return 'Inconnu'
  }
})

const formatCallDuration = computed(() => {
  const minutes = Math.floor(callDuration.value / 60)
  const seconds = callDuration.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Méthodes
const startCallTimer = () => {
  callStartTime.value = Date.now()
  callTimer.value = setInterval(() => {
    callDuration.value = Math.floor((Date.now() - callStartTime.value) / 1000)
  }, 1000)
}

const stopCallTimer = () => {
  if (callTimer.value) {
    clearInterval(callTimer.value)
    callTimer.value = null
  }
}

const acceptCall = async () => {
  try {
    callState.value = 'connecting'
    await friendsStore.acceptCall(props.friend.id, props.callType)
    callState.value = 'connected'
    startCallTimer()
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de l\'appel:', error)
    endCall()
  }
}

const rejectCall = async () => {
  try {
    await friendsStore.rejectCall(props.friend.id)
    endCall()
  } catch (error) {
    console.error('Erreur lors du refus de l\'appel:', error)
    endCall()
  }
}

const cancelCall = async () => {
  try {
    await friendsStore.cancelCall(props.friend.id)
    endCall()
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'appel:', error)
    endCall()
  }
}

const endCall = async () => {
  try {
    await friendsStore.endCall(props.friend.id)
  } catch (error) {
    console.error('Erreur lors de la fin de l\'appel:', error)
  } finally {
    stopCallTimer()
    callState.value = 'ended'
    emit('close')
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  // Logique pour couper/activer le micro
  friendsStore.toggleMicrophone(isMuted.value)
}

const toggleDeafen = () => {
  isDeafened.value = !isDeafened.value
  // Logique pour couper/activer le son
  friendsStore.toggleSpeaker(isDeafened.value)
}

// Simuler la connexion de l'appel
const simulateCallConnection = () => {
  setTimeout(() => {
    if (callState.value === 'connecting') {
      callState.value = 'connected'
      startCallTimer()
    }
  }, 2000)
}

// Initialisation
onMounted(() => {
  // Simuler la connexion pour la démo
  simulateCallConnection()
})

// Nettoyage
onUnmounted(() => {
  stopCallTimer()
})
</script>

<style scoped>
.private-call-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.private-call-modal {
  background: #36393f;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #202225;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.call-header {
  background: #2f3136;
  padding: 20px;
  border-bottom: 1px solid #202225;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.call-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #2f3136;
}

.status-indicator.online {
  background: #57f287;
}

.status-indicator.offline {
  background: #747f8d;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.call-status {
  color: #8e9297;
  font-size: 14px;
}

.btn-close {
  background: transparent;
  border: none;
  color: #b9bbbe;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #4f545c;
  color: #fff;
}

.call-content {
  flex: 1;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

/* Appel en cours */
.call-active {
  text-align: center;
  width: 100%;
}

.call-timer {
  margin-bottom: 30px;
}

.timer-label {
  display: block;
  color: #8e9297;
  font-size: 14px;
  margin-bottom: 8px;
}

.timer-value {
  display: block;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  font-family: monospace;
}

.friend-video {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.video-stream {
  width: 100%;
  height: 225px;
  border-radius: 8px;
  background: #202225;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.audio-only {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.audio-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #5865f2;
}

.audio-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audio-info {
  text-align: center;
}

.audio-name {
  display: block;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.audio-status {
  color: #8e9297;
  font-size: 14px;
}

/* Appel en cours de connexion */
.call-connecting {
  text-align: center;
}

.connecting-spinner {
  margin-bottom: 30px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #40444b;
  border-top: 4px solid #5865f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.connecting-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.connecting-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.connecting-subtitle {
  color: #8e9297;
  font-size: 14px;
}

/* Appel entrant */
.call-incoming {
  text-align: center;
}

.incoming-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 30px;
  border: 4px solid #57f287;
}

.incoming-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.incoming-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.incoming-title {
  color: #57f287;
  font-size: 16px;
  font-weight: 600;
}

.incoming-name {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.incoming-type {
  color: #8e9297;
  font-size: 14px;
}

/* Contrôles de l'appel */
.call-controls {
  background: #2f3136;
  padding: 20px;
  border-top: 1px solid #202225;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.control-buttons button {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.btn-accept {
  background: #57f287;
}

.btn-accept:hover {
  background: #3ba55c;
  transform: scale(1.05);
}

.btn-reject,
.btn-end,
.btn-cancel {
  background: #ed4245;
}

.btn-reject:hover,
.btn-end:hover,
.btn-cancel:hover {
  background: #c53030;
  transform: scale(1.05);
}

.btn-mute {
  background: #4f545c;
}

.btn-mute:hover {
  background: #5d6269;
}

.btn-mute.active {
  background: #ed4245;
}

.btn-deafen {
  background: #4f545c;
}

.btn-deafen:hover {
  background: #5d6269;
}

.btn-deafen.active {
  background: #ed4245;
}

.call-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #8e9297;
}

.call-type {
  text-transform: capitalize;
}

.call-quality {
  color: #57f287;
}
</style>



