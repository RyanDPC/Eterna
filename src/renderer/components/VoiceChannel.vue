<template>
  <div class="voice-channel" :class="{ 'is-active': isActive, 'is-connecting': isConnecting }">
    <!-- Icône du canal vocal -->
    <div class="voice-icon" @click="toggleVoice">
      <svg v-if="!isActive" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.202 12 3.665 12 4.414v7.172c0 .748-.917 1.212-1.707.707L5.586 15z" clip-rule="evenodd" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2-2-2" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6l2-2-2-2" />
      </svg>
    </div>

    <!-- Informations du canal -->
    <div class="channel-info">
      <h4 class="channel-name">{{ channel.name }}</h4>
      <div class="channel-status">
        <span v-if="isActive" class="status-active">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Connecté
        </span>
        <span v-else-if="isConnecting" class="status-connecting">
          <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connexion...
        </span>
        <span v-else class="status-inactive">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Déconnecté
        </span>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="voice-actions">
      <!-- Bouton Mute -->
      <button 
        @click="toggleMute" 
        class="voice-btn"
        :class="{ 'is-muted': isMuted }"
        :disabled="!isActive"
      >
        <svg v-if="!isMuted" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.202 12 3.665 12 4.414v7.172c0 .748-.917 1.212-1.707.707L5.586 15z" clip-rule="evenodd" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2-2-2" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6l2-2-2-2" />
        </svg>
      </button>

      <!-- Bouton Deafen -->
      <button 
        @click="toggleDeafen" 
        class="voice-btn"
        :class="{ 'is-deafened': isDeafened }"
        :disabled="!isActive"
      >
        <svg v-if="!isDeafened" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343a1 1 0 011.414 0l12 12a1 1 0 11-1.414 1.414l-12-12a1 1 0 010-1.414z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343a1 1 0 011.414 0l12 12a1 1 0 11-1.414 1.414l-12-12a1 1 0 010-1.414z" />
        </svg>
      </button>

      <!-- Bouton Déconnexion -->
      <button 
        @click="disconnect" 
        class="voice-btn disconnect-btn"
        :disabled="!isActive"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>

    <!-- Indicateur de niveau sonore -->
    <div v-if="isActive" class="volume-indicator">
      <div class="volume-bar">
        <div class="volume-fill" :style="{ width: volumeLevel + '%' }"></div>
      </div>
      <span class="volume-text">{{ volumeLevel }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  channel: {
    type: Object,
    required: true
  }
})

// État local
const isActive = ref(false)
const isConnecting = ref(false)
const isMuted = ref(false)
const isDeafened = ref(false)
const volumeLevel = ref(50)

// Émettre les événements
const emit = defineEmits(['join', 'leave', 'mute', 'deafen'])

// Basculer la connexion vocale
const toggleVoice = async () => {
  if (isActive.value) {
    await disconnect()
  } else {
    await connect()
  }
}

// Se connecter au canal vocal
const connect = async () => {
  isConnecting.value = true
  try {
    // Simulation de connexion
    await new Promise(resolve => setTimeout(resolve, 1000))
    isActive.value = true
    isConnecting.value = false
    emit('join', props.channel.id)
  } catch (error) {
    console.error('Erreur de connexion vocale:', error)
    isConnecting.value = false
  }
}

// Se déconnecter du canal vocal
const disconnect = async () => {
  try {
    isActive.value = false
    isMuted.value = false
    isDeafened.value = false
    emit('leave', props.channel.id)
  } catch (error) {
    console.error('Erreur de déconnexion vocale:', error)
  }
}

// Basculer le mute
const toggleMute = () => {
  isMuted.value = !isMuted.value
  emit('mute', { channelId: props.channel.id, muted: isMuted.value })
}

// Basculer le deafen
const toggleDeafen = () => {
  isDeafened.value = !isDeafened.value
  emit('deafen', { channelId: props.channel.id, deafened: isDeafened.value })
}
</script>

<style scoped>
.voice-channel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.voice-channel:hover {
  background: #374151;
  border-color: #718096;
}

.voice-channel.is-active {
  background: linear-gradient(135deg, #2d3748 0%, #1a1a2e 100%);
  border-color: #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.voice-channel.is-connecting {
  border-color: #f59e0b;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.voice-icon {
  width: 40px;
  height: 40px;
  background: #4a5568;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.voice-channel.is-active .voice-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.voice-channel.is-connecting .voice-icon {
  background: #f59e0b;
  color: white;
}

.channel-info {
  flex: 1;
  min-width: 0;
}

.channel-name {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 4px 0;
}

.channel-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
}

.status-active {
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-connecting {
  color: #f59e0b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-inactive {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.voice-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.voice-btn {
  width: 32px;
  height: 32px;
  background: #4a5568;
  border: none;
  border-radius: 6px;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.voice-btn:hover:not(:disabled) {
  background: #5a6c7d;
  color: white;
  transform: scale(1.05);
}

.voice-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.voice-btn.is-muted {
  background: #dc2626;
  color: white;
}

.voice-btn.is-deafened {
  background: #dc2626;
  color: white;
}

.disconnect-btn:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.volume-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.volume-bar {
  width: 60px;
  height: 4px;
  background: #4a5568;
  border-radius: 2px;
  overflow: hidden;
}

.volume-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
  transition: width 0.3s ease;
}

.volume-text {
  font-size: 0.75rem;
  color: #a0aec0;
  min-width: 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .voice-channel {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .voice-actions {
    justify-content: center;
  }

  .volume-indicator {
    justify-content: center;
  }
}
</style>




