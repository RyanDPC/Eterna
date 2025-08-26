<template>
  <div class="server-list" :class="{ 'compact': compact }">
    <!-- Liste des serveurs -->
    <div v-if="userServers.length > 0" class="servers-container">
      <div
        v-for="server in userServers"
        :key="server.id"
        class="server-item"
        :class="{ 'is-selected': selectedServer?.id === server.id }"
        @click="selectServer(server)"
      >
        <!-- Avatar du serveur -->
        <div class="server-avatar">
          {{ server.name.charAt(0).toUpperCase() }}
        </div>

        <!-- Informations du serveur - Cachées en mode compact -->
        <div v-if="!compact" class="server-info">
          <h3 class="server-name">{{ server.name }}</h3>
          <p v-if="server.description" class="server-description">{{ server.description }}</p>
          <div class="server-meta">
            <span class="meta-item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {{ server.members?.length || 0 }} membre{{ (server.members?.length || 0) > 1 ? 's' : '' }}
            </span>
            <span class="meta-item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ server.channels?.length || 0 }} canal{{ (server.channels?.length || 0) > 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Indicateur de sélection -->
        <div v-if="selectedServer?.id === server.id" class="selection-indicator">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Bouton des paramètres du serveur -->
        <button
          @click.stop="showServerSettings(server)"
          class="server-settings-button"
          :title="`Paramètres de ${server.name}`"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Message si aucun serveur -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="empty-title">Aucun serveur</h3>
      <p class="empty-description">Créez ou rejoignez votre premier serveur pour commencer</p>
    </div>

    <!-- Canaux du serveur sélectionné - Cachés en mode compact -->
    <div v-if="selectedServer && !compact" class="channels-section">
      <div class="channels-header">
        <div class="channels-actions">
          <button 
            @click="showAddVoiceChannelModal = true" 
            class="add-voice-channel-btn" 
            title="Ajouter un canal vocal"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>Ajouter un vocal</span>
          </button>
        </div>
      </div>

      <!-- Canaux textuels (sans les CTL) -->
      <div v-if="regularTextChannels.length > 0" class="channel-category">
        <h4 class="category-title">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Canaux textuels
        </h4>
        <div class="channels-list">
          <div
            v-for="channel in regularTextChannels"
            :key="channel.id"
            class="text-channel"
            @click="selectChannel(channel)"
          >
            <span class="channel-hash">#</span>
            <span class="channel-name">{{ channel.name }}</span>
          </div>
        </div>
      </div>

      <!-- Canaux vocaux -->
      <div v-if="voiceChannels.length > 0" class="voice-channels-section">
        <div class="category-header">
          <h4 class="category-title">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            VOCAUX
          </h4>
        </div>
        
        <!-- Statut vocal intégré supprimé - Plus de duplication -->
        
        <div class="channels-list">
          <div
            v-for="channel in voiceChannels"
            :key="channel.id"
            class="voice-channel-item"
          >
            <div class="channel-info">
              <span class="channel-hash">🔊</span>
              <span class="channel-name">{{ channel.name }}</span>
                                <!-- Badge de notification supprimé -->
            </div>
            
            <div class="voice-actions">
              <button 
                @click="toggleLinkedTextChannel(channel.id)"
                class="discussion-btn"
                :class="{ 
                  'is-disabled': !isVoiceChannelJoined(channel.id),
                  'is-active': isCurrentChannelLinked(channel.id)
                }"
                :title="!isVoiceChannelJoined(channel.id) ? 'Connectez-vous au vocal pour accéder à la discussion' : 
                        (isCurrentChannelLinked(channel.id) ? 'Quitter la discussion' : 'Ouvrir la discussion')"
                :disabled="!isVoiceChannelJoined(channel.id)"
              >
                {{ isCurrentChannelLinked(channel.id) ? '❌' : '💬' }}
              </button>
              
              <button 
                @click="joinVoiceChannel(channel)"
                class="voice-join-btn"
                :class="{ 'is-joined': isVoiceChannelJoined(channel.id) }"
                :disabled="isVoiceChannelJoined(channel.id)"
                :title="isVoiceChannelJoined(channel.id) ? 'Déjà connecté à ce canal' : 'Rejoindre le canal vocal'"
              >
                <svg v-if="!isVoiceChannelJoined(channel.id)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.202 12 3.665 12 4.414v7.172c0 .748-.917 1.212-1.707.707L5.586 15z" clip-rule="evenodd" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2-2-2" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6l2-2-2-2" />
                </svg>
                {{ isVoiceChannelJoined(channel.id) ? 'Connecté' : 'Rejoindre' }}
              </button>
            </div>
            
            <!-- Statut vocal intégré horizontalement sous le canal -->
            <div v-if="isVoiceChannelJoined(channel.id)" class="integrated-voice-status-horizontal">
              <div class="voice-user-info-horizontal">
                <div class="voice-avatar">
                  <span class="voice-avatar-text">{{ getUserInitial }}</span>
                </div>
                <div class="voice-user-details-horizontal">
                  <div class="voice-username">{{ getUserDisplayName }}</div>
                  <div class="voice-controls-icons">
                    <button 
                      @click="toggleMute"
                      :class="['voice-control-icon', voiceStatus?.isMuted ? 'muted' : 'unmuted']"
                      :title="voiceStatus?.isMuted ? 'Activer micro' : 'Désactiver micro'"
                    >
                      <svg v-if="voiceStatus?.isMuted" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <line x1="17" y1="14" x2="19" y2="16" />
                        <line x1="19" y1="14" x2="17" y2="16" />
                      </svg>
                      <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    
                    <button 
                      @click="toggleDeafen"
                      :class="['voice-control-icon', voiceStatus?.isDeafened ? 'deafened' : 'undeafened']"
                      :title="voiceStatus?.isDeafened ? 'Activer son' : 'Désactiver son'"
                    >
                      <svg v-if="voiceStatus?.isDeafened" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    
                    <button 
                      @click="disconnectFromVoice"
                      class="voice-control-icon disconnect"
                      title="Quitter le vocal"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button 
                  @click="openVoiceStatusModal"
                  class="voice-modal-btn"
                  title="Ouvrir le modal de statut vocal"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>

              <!-- Liste des participants vocaux (pour les administrateurs) -->
              <div v-if="appStore.hasAdminPermissions() && voiceParticipants.length > 1" class="voice-participants-list">
                <div class="participants-header">
                  <span class="participants-title">Participants ({{ voiceParticipants.length }})</span>
                </div>
                <div class="participants-grid">
                  <div 
                    v-for="participant in voiceParticipants" 
                    :key="participant.id"
                    class="participant-item"
                    :class="{ 'is-current-user': participant.id === props.currentUser?.id }"
                  >
                    <div class="participant-avatar">
                      <span class="participant-initial">{{ participant.username?.charAt(0).toUpperCase() || 'U' }}</span>
                    </div>
                    <div class="participant-info">
                      <div class="participant-name">{{ participant.username || 'Utilisateur' }}</div>
                      <div class="participant-status">
                        <span v-if="participant.isMuted" class="status-muted">🔇</span>
                        <span v-if="participant.isDeafened" class="status-deafened">🔇</span>
                        <span v-if="participant.isSpeaking" class="status-speaking">🎤</span>
                      </div>
                    </div>
                    <!-- Contrôles d'administration -->
                    <div v-if="participant.id !== props.currentUser?.id" class="admin-controls">
                      <button 
                        @click="adminMuteUser(participant.id)"
                        :class="['admin-control-btn', participant.isMuted ? 'muted' : 'unmuted']"
                        :title="participant.isMuted ? 'Activer le micro' : 'Couper le micro'"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                      <button 
                        @click="adminDeafenUser(participant.id)"
                        :class="['admin-control-btn', participant.isDeafened ? 'deafened' : 'undeafened']"
                        :title="participant.isDeafened ? 'Activer le son' : 'Couper le son'"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <button 
                        @click="adminDisconnectUser(participant.id)"
                        class="admin-control-btn disconnect"
                        title="Déconnecter l'utilisateur"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun canal -->
      <div v-if="!regularTextChannels.length && !voiceChannels.length" class="channels-empty">
        <p>Aucun canal dans ce serveur</p>
        <button @click="showAddVoiceChannelModal = true" class="btn btn-primary">
          Ajouter un canal vocal
        </button>
      </div>
    </div>
  </div>

   <!-- Modal d'ajout de canal vocal -->
   <div v-if="showAddVoiceChannelModal" class="modal-overlay" @click="closeAddVoiceChannelModal">
     <div class="modal-content" @click.stop>
       <div class="modal-header">
         <h3 class="modal-title">Ajouter un canal vocal</h3>
         <button @click="closeAddVoiceChannelModal" class="modal-close-btn">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       </div>
       
       <div class="modal-body">
         <div class="form-group">
           <label for="voiceChannelName" class="form-label">Nom du canal vocal</label>
           <input
             id="voiceChannelName"
             v-model="newVoiceChannelName"
             type="text"
             placeholder="ex: Gaming, Musique, Lounge..."
             class="form-input"
             @keyup.enter="createVoiceChannel"
           />
           <p class="form-help">
             Un canal textuel lié sera automatiquement créé avec le nom "{{ newVoiceChannelName || 'Nom' }} — discussion"
           </p>
         </div>
       </div>
       
       <div class="modal-footer">
         <button @click="closeAddVoiceChannelModal" class="btn btn-secondary">Annuler</button>
         <button 
           @click="createVoiceChannel" 
           class="btn btn-primary"
           :disabled="!newVoiceChannelName.trim()"
         >
           Créer le canal vocal
         </button>
             </div>
    </div>
  </div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore'

// Props
const props = defineProps({
  servers: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: Object,
    default: null
  },
  currentChannel: {
    type: Object,
    default: null
  },
  currentServer: {
    type: Object,
    default: null
  },
  compact: {
    type: Boolean,
    default: false
  },
  isVoiceStatusDocked: {
    type: Boolean,
    default: false
  }
})

// Émettre les événements
const emit = defineEmits(['create', 'join', 'select-server', 'select-channel', 'add-channel', 'voice-channel-created', 'show-settings', 'open-voice-status'])

// Store
const appStore = useAppStore()

// État local - synchronisé avec la prop currentServer
const selectedServer = computed(() => {
  // Si currentServer est fourni, l'utiliser
  if (props.currentServer) {
    return props.currentServer
  }
  
  // Sinon, utiliser l'état local (pour la compatibilité)
  return selectedServerLocal.value
})

const selectedServerLocal = ref(null)
const joinedVoiceChannels = ref(new Set())
const showAddVoiceChannelModal = ref(false)
const newVoiceChannelName = ref('')


// Serveurs de l'utilisateur
const userServers = computed(() => {
  if (!props.servers || !props.currentUser) return []
  return props.servers.filter(server =>
    server.members && server.members.includes(props.currentUser.id)
  )
})

// Canaux textuels du serveur sélectionné (sans les CTL)
const regularTextChannels = computed(() => {
  if (!selectedServer.value?.channels) return []
  return selectedServer.value.channels.filter(channel => 
    channel.type === 'text' && !channel.isLinked
  )
})

// Canaux vocaux du serveur sélectionné
const voiceChannels = computed(() => {
  if (!selectedServer.value?.channels) return []
  return selectedServer.value.channels.filter(channel => channel.type === 'voice')
})

// Computed properties
const voiceStatus = computed(() => appStore.voiceStatus)

// Participants vocaux connectés au canal actuel
const voiceParticipants = computed(() => appStore.getVoiceParticipants())

// Fonctions d'administration sécurisées
const adminMuteUser = (targetUserId) => {
  if (appStore.hasAdminPermissions()) {
    const success = appStore.adminMuteUser(targetUserId)
    if (success) {
      console.log(`Utilisateur ${targetUserId} mute par l'administrateur`)
    }
  } else {
    console.warn('Permissions d\'administration insuffisantes')
  }
}

const adminDeafenUser = (targetUserId) => {
  if (appStore.hasAdminPermissions()) {
    const success = appStore.adminDeafenUser(targetUserId)
    if (success) {
      console.log(`Utilisateur ${targetUserId} deafen par l'administrateur`)
    }
  } else {
    console.warn('Permissions d\'administration insuffisantes')
  }
}

const adminDisconnectUser = (targetUserId) => {
  if (appStore.hasAdminPermissions()) {
    const success = appStore.adminDisconnectUser(targetUserId)
    if (success) {
      console.log(`Utilisateur ${targetUserId} déconnecté par l'administrateur`)
    }
  } else {
    console.warn('Permissions d\'administration insuffisantes')
  }
}

const getUserInitial = computed(() => {
  if (!props.currentUser) return 'U'
  return (props.currentUser.displayName || props.currentUser.username || 'U').charAt(0).toUpperCase()
})

const getUserDisplayName = computed(() => {
  if (!props.currentUser) return 'Utilisateur'
  return props.currentUser.displayName || props.currentUser.username || 'Utilisateur'
})

// Méthodes
const openVoiceStatusModal = () => {
  emit('open-voice-status')
}

// Sélectionner un serveur
const selectServer = (server) => {
  selectedServerLocal.value = server
  emit('select-server', server)
}

// Sélectionner un canal
const selectChannel = (channel) => {
  emit('select-channel', { server: selectedServer.value, channel })
}

// Ajouter un canal
const addChannel = () => {
  emit('add-channel', selectedServer.value)
}

// Gestion des canaux vocaux - Seulement rejoindre, pas quitter
const joinVoiceChannel = (channel) => {
  // Vérifier si déjà connecté à ce canal
  if (appStore.voiceStatus.isConnected && appStore.voiceStatus.currentVoiceChannel?.id === channel.id) {
    console.log('Déjà connecté au canal vocal:', channel.name)
    return
  }
  
  // Se connecter au nouveau canal vocal
  appStore.connectToVoiceChannel(channel)
  joinedVoiceChannels.value.add(channel.id)
  console.log('Connecté au canal vocal:', channel.name)
}

const isVoiceChannelJoined = (channelId) => {
  // Utiliser le store principal pour vérifier si connecté au canal vocal
  return appStore.voiceStatus.isConnected && appStore.voiceStatus.currentVoiceChannel?.id === channelId
}

// Méthodes de contrôle du statut vocal SÉCURISÉES
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

const disconnectFromVoice = () => {
  // Vérifier que l'utilisateur se déconnecte lui-même
  if (appStore.canControlUser(props.currentUser?.id)) {
    appStore.disconnectFromVoiceChannel(props.currentUser?.id)
    // Vider le Set des canaux rejoints
    joinedVoiceChannels.value.clear()
  } else {
    console.warn('Tentative non autorisée de déconnexion')
  }
}

// Fonction déjà déclarée plus haut

// Gestion des événements vocaux (pour compatibilité)
const handleVoiceJoin = (channelId) => {
  console.log('Rejoint le canal vocal:', channelId)
}

const handleVoiceLeave = (channelId) => {
  console.log('Quitté le canal vocal:', channelId)
}

const handleVoiceMute = (data) => {
  console.log('Mute:', data)
}

const handleVoiceDeafen = (data) => {
  console.log('Deafen:', data)
}

// Afficher les paramètres du serveur
const showServerSettings = (server) => {
  console.log('🔧 showServerSettings appelé avec:', server)
  emit('show-settings', server)
}

// Gestion des CTL (Canaux Textuels Liés)
const toggleLinkedTextChannel = (voiceChannelId) => {
  // Vérifier si l'utilisateur est connecté au canal vocal
  if (!isVoiceChannelJoined(voiceChannelId)) {
    console.warn('Vous devez être connecté au canal vocal pour accéder à la discussion')
    return
  }
  
  // Si on est actuellement dans le CTL, revenir au canal général
  if (isCurrentChannelLinked(voiceChannelId)) {
    const generalChannel = selectedServer.value.channels.find(channel => 
      channel.type === 'text' && !channel.isLinked
    )
    if (generalChannel) {
      emit('select-channel', { 
        server: selectedServer.value, 
        channel: generalChannel,
        isLinkedChannel: false 
      })
    }
    return
  }
  
  // Sinon, ouvrir le CTL
  const linkedChannel = props.servers
    .flatMap(server => server.channels || [])
    .find(channel => channel.linkedVoiceId === voiceChannelId && channel.isLinked)
  
  if (linkedChannel) {
    // Émettre l'événement pour sélectionner le CTL comme canal principal
    emit('select-channel', { 
      server: selectedServer.value, 
      channel: linkedChannel,
      isLinkedChannel: true 
    })
    
    // Sauvegarder l'état dans localStorage
    localStorage.setItem(`ctl-open-${voiceChannelId}`, 'true')
  }
}



const getUnreadCount = (voiceChannelId) => {
  // Simuler un compteur de messages non lus (à remplacer par un vrai calcul)
  // Pour l'instant, retourne un nombre aléatoire pour la démo
  return Math.floor(Math.random() * 5)
}

// Vérifier si le canal vocal actuel est le canal principal sélectionné
const isCurrentChannelLinked = (voiceChannelId) => {
  // Vérifier si le canal actuellement sélectionné est le CTL de ce canal vocal
  return props.currentChannel?.isLinked && props.currentChannel?.linkedVoiceId === voiceChannelId
}

// Gestion de l'ajout de canaux vocaux
const openAddVoiceChannelModal = () => {
  showAddVoiceChannelModal.value = true
  newVoiceChannelName.value = ''
}

const closeAddVoiceChannelModal = () => {
  showAddVoiceChannelModal.value = false
  newVoiceChannelName.value = ''
}

const createVoiceChannel = async () => {
  if (!newVoiceChannelName.value.trim() || !selectedServer.value) return
  
  try {
    // Utiliser le store pour créer le canal vocal et son CTL
    const { voiceChannel, linkedTextChannel } = await appStore.createVoiceChannel(
      selectedServer.value.id,
      { name: newVoiceChannelName.value.trim() }
    )
    
    console.log('Canal vocal créé:', voiceChannel)
    console.log('CTL créé:', linkedTextChannel)
    
    // Fermer le modal et réinitialiser
    closeAddVoiceChannelModal()
    
    // Émettre un événement pour notifier le composant parent
    emit('voice-channel-created', { voiceChannel, linkedTextChannel })
    
  } catch (error) {
    console.error('Erreur lors de la création du canal vocal:', error)
    // Ici on pourrait afficher une notification d'erreur
  }
}


</script>

<style scoped>
.server-list {
  padding: 0;
  background: transparent;
  border-radius: 0;
  height: 100%;
  overflow-y: auto;
}

.server-list.compact {
  padding: 16px;
}

.servers-container {
  margin-bottom: 32px;
}

.server-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%);
  border: 1px solid rgba(74, 85, 104, 0.3);
  border-radius: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.server-item:hover {
  background: linear-gradient(135deg, rgba(55, 65, 81, 0.9) 0%, rgba(45, 55, 72, 0.9) 100%);
  border-color: rgba(113, 128, 150, 0.5);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.server-item.is-selected {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-color: #3b82f6;
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.server-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  flex-shrink: 0;
}

.server-info {
  flex: 1;
  min-width: 0;
}

.server-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 8px 0;
}

.server-description {
  font-size: 0.875rem;
  color: #a0aec0;
  margin: 0 0 12px 0;
  line-height: 1.4;
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
  font-size: 0.75rem;
}

.selection-indicator {
  color: #3b82f6;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  background: #4a5568;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #a0aec0;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.empty-description {
  font-size: 1rem;
  color: #a0aec0;
  margin-bottom: 24px;
}

.channels-section {
  border-top: 1px solid #2d3748;
  padding-top: 24px;
}

.channels-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.channels-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.add-voice-channel-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-voice-channel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}



.channels-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.add-channel-btn {
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

.add-channel-btn:hover {
  background: #5a6c7d;
  color: white;
  transform: scale(1.05);
}

.channel-category {
  margin-bottom: 24px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #a0aec0;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.channels-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-channel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 1px solid rgba(74, 85, 104, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

.text-channel:hover {
  background: linear-gradient(135deg, rgba(55, 65, 81, 0.8) 0%, rgba(45, 55, 72, 0.8) 100%);
  border-color: rgba(113, 128, 150, 0.4);
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.channel-hash {
  color: #3b82f6;
  font-weight: 600;
  font-size: 1rem;
}

.channel-name {
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 500;
}

.channels-empty {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
}

.channels-empty p {
  margin-bottom: 16px;
}

/* Canaux vocaux - Layout vertical */
.voice-channel-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 8px;
}

.voice-channel-item:hover {
  background: linear-gradient(135deg, rgba(55, 65, 81, 0.8) 0%, rgba(45, 55, 72, 0.8) 100%);
  border-color: rgba(113, 128, 150, 0.4);
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-hash {
  font-size: 16px;
}

.channel-name {
  color: white;
  font-weight: 500;
  font-size: 14px;
}

/* Badge de notification supprimé */

/* Actions vocales - Layout horizontal */
.voice-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.discussion-btn {
  padding: 6px 10px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  color: rgba(59, 130, 246, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.discussion-btn:hover:not(.is-disabled) {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
}

.discussion-btn.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.discussion-btn.is-active {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  color: rgba(239, 68, 68, 0.8);
}

.voice-join-btn {
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.8);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.voice-join-btn:hover {
  background: rgba(16, 185, 129, 1);
  transform: translateY(-1px);
}

.voice-join-btn.is-joined {
  background: rgba(107, 114, 128, 0.8);
  border-color: rgba(107, 114, 128, 0.3);
  cursor: not-allowed;
  opacity: 0.6;
}

.voice-join-btn:disabled {
  background: rgba(107, 114, 128, 0.6);
  border-color: rgba(107, 114, 128, 0.2);
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
}

.voice-join-btn:disabled:hover {
  background: rgba(107, 114, 128, 0.6);
  transform: none;
}

/* Statut vocal intégré horizontalement */
.integrated-voice-status-horizontal {
  margin-top: 8px;
  padding: 10px;
  background: rgba(236, 72, 153, 0.05);
  border-radius: 6px;
  border-left: 3px solid rgba(236, 72, 153, 0.3);
}

.voice-user-info-horizontal {
  display: flex;
  align-items: center;
  gap: 10px;
}

.voice-user-details-horizontal {
  flex: 1;
  min-width: 0;
}

.voice-username {
  color: white;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 2px;
}

.voice-status-text {
  color: rgba(236, 72, 153, 0.7);
  font-size: 11px;
}

/* Icônes de contrôle vocal */
.voice-controls-icons {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.voice-control-icon {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.voice-control-icon.unmuted {
  background: rgba(16, 185, 129, 0.8);
}

.voice-control-icon.unmuted:hover {
  background: rgba(16, 185, 129, 1);
  transform: scale(1.1);
}

.voice-control-icon.muted {
  background: rgba(239, 68, 68, 0.8);
}

.voice-control-icon.muted:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.voice-control-icon.undeafened {
  background: rgba(59, 130, 246, 0.8);
}

.voice-control-icon.undeafened:hover {
  background: rgba(59, 130, 246, 1);
  transform: scale(1.1);
}

.voice-control-icon.deafened {
  background: rgba(107, 114, 128, 0.8);
}

.voice-control-icon.deafened:hover {
  background: rgba(107, 114, 128, 1);
  transform: scale(1.1);
}

.voice-control-icon.disconnect {
  background: rgba(107, 114, 128, 0.8);
}

.voice-control-icon.disconnect:hover {
  background: rgba(239, 68, 68, 0.8);
  transform: scale(1.1);
}

/* Panneau CTL */
.linked-text-panel {
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
  border: 1px solid rgba(74, 85, 104, 0.3);
  border-radius: 16px;
  margin-top: 20px;
  backdrop-filter: blur(15px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(74, 85, 104, 0.2);
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-panel-btn {
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-panel-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
  transform: scale(1.05);
}

.panel-content {
  padding: 20px;
}

.messages-preview {
  margin-bottom: 20px;
}

.no-messages {
  text-align: center;
  color: #718096;
  font-style: italic;
  margin: 0;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-preview {
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(74, 85, 104, 0.2);
  border-radius: 8px;
  padding: 12px;
}

.message-author {
  font-weight: 600;
  color: #8b5cf6;
  margin-right: 8px;
}

.message-content {
  color: #e2e8f0;
}

.message-input-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.linked-message-input {
  flex: 1;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 85, 104, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.linked-message-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.linked-message-input::placeholder {
  color: #718096;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

/* Modal d'ajout de canal vocal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
  border: 1px solid rgba(74, 85, 104, 0.3);
  border-radius: 20px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid rgba(74, 85, 104, 0.2);
  margin-bottom: 24px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
  transform: scale(1.05);
}

/* Bouton des paramètres du serveur */
.server-settings-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(45, 55, 72, 0.8);
  border: none;
  border-radius: 8px;
  color: #a0aec0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
}

.server-item:hover .server-settings-button {
  opacity: 1;
  transform: scale(1);
}

.server-settings-button:hover {
  background: rgba(45, 55, 72, 1);
  color: white;
  transform: scale(1.1);
}

.modal-body {
  padding: 0 24px 24px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 85, 104, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input::placeholder {
  color: #718096;
}

.form-help {
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 8px;
  font-style: italic;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 24px 24px;
}

.btn-secondary {
  background: #4a5568;
  color: white;
}

.btn-secondary:hover {
  background: #2d3748;
  transform: translateY(-2px);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
}



/* Responsive */
@media (max-width: 768px) {
  .server-list {
    padding: 16px;
  }

  .server-item {
    flex-direction: column;
    text-align: center;
  }

  .server-meta {
    justify-content: center;
  }
}

/* Mode compact */
.server-list.compact {
  padding: 8px;
}

/* Styles pour l'intégration du statut vocal dans les canaux */
.voice-status-integration {
  margin-top: 8px;
  margin-left: 16px;
  margin-right: 8px;
}

.voice-user-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  border-left: 3px solid rgba(236, 72, 153, 0.6);
  transition: all 0.2s ease;
}

.voice-user-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-left-color: rgba(236, 72, 153, 0.8);
}

.voice-user-avatar {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.voice-avatar-text {
  color: white;
  font-weight: bold;
  font-size: 9px;
}

.voice-user-info {
  flex: 1;
  min-width: 0;
}

.voice-username {
  color: white;
  font-weight: 600;
  font-size: 11px;
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.voice-user-status {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(236, 72, 153, 0.7);
  font-size: 9px;
  font-weight: 500;
}

.voice-status-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(236, 72, 153, 0.6);
  transition: all 0.3s ease;
}

.voice-status-dot.speaking {
  background: #10b981;
  animation: pulse 1.5s ease-in-out infinite;
}

.voice-controls-compact {
  display: flex;
  gap: 3px;
  margin-left: auto;
}

.voice-control-mini {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.voice-control-mini.unmuted {
  background: rgba(16, 185, 129, 0.7);
}

.voice-control-mini.unmuted:hover {
  background: rgba(16, 185, 129, 0.9);
  transform: scale(1.1);
}

.voice-control-mini.muted {
  background: rgba(239, 68, 68, 0.7);
}

.voice-control-mini.muted:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: scale(1.1);
}

.voice-control-mini.undeafened {
  background: rgba(59, 130, 246, 0.7);
}

.voice-control-mini.undeafened:hover {
  background: rgba(59, 130, 246, 0.9);
  transform: scale(1.1);
}

.voice-control-mini.deafened {
  background: rgba(107, 114, 128, 0.7);
}

.voice-control-mini.deafened:hover {
  background: rgba(107, 114, 128, 0.9);
  transform: scale(1.1);
}

.voice-control-mini.disconnect {
  background: rgba(107, 114, 128, 0.7);
}

.voice-control-mini.disconnect:hover {
  background: rgba(239, 68, 68, 0.8);
  transform: scale(1.1);
}

/* Styles pour l'en-tête de catégorie et le bouton de statut vocal */
.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

/* Styles supprimés - Plus nécessaire */

.server-list.compact .server-item {
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.server-list.compact .server-avatar {
  width: 32px;
  height: 32px;
  font-size: 14px;
  margin-right: 0;
}

.server-list.compact .server-info {
  display: none;
}

.server-list.compact .selection-indicator {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
}

.server-list.compact .channels-section {
  display: none;
}

.server-list.compact .empty-state {
  padding: 20px 10px;
  text-align: center;
}

.server-list.compact .empty-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
}

.server-list.compact .empty-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.server-list.compact .empty-description {
  font-size: 12px;
  line-height: 1.4;
}

/* Statut vocal intégré directement sous le titre */
.integrated-voice-status {
  margin: 8px 0;
  padding: 12px;
  background: rgba(236, 72, 153, 0.05);
  border-radius: 8px;
  border-left: 3px solid rgba(236, 72, 153, 0.3);
}

.voice-user-info-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.voice-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.voice-user-details-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.voice-username {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.voice-status-text {
  color: rgba(236, 72, 153, 0.7);
  font-size: 11px;
}

.voice-modal-btn {
  width: 28px;
  height: 28px;
  background: rgba(236, 72, 153, 0.2);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(236, 72, 153, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.voice-modal-btn:hover {
  background: rgba(236, 72, 153, 0.3);
  border-color: rgba(236, 72, 153, 0.5);
  color: rgba(236, 72, 153, 1);
  transform: scale(1.05);
}

/* Liste des participants vocaux */
.voice-participants-list {
  margin-top: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.participants-header {
  margin-bottom: 8px;
}

.participants-title {
  color: rgba(236, 72, 153, 0.8);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.participants-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.participant-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.participant-item.is-current-user {
  background: rgba(236, 72, 153, 0.1);
  border-color: rgba(236, 72, 153, 0.3);
}

.participant-avatar {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.participant-info {
  flex: 1;
  min-width: 0;
}

.participant-name {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.participant-status {
  display: flex;
  gap: 4px;
  margin-top: 2px;
}

.status-muted, .status-deafened, .status-speaking {
  font-size: 10px;
}

.admin-controls {
  display: flex;
  gap: 4px;
}

.admin-control-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.7;
}

.admin-control-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.admin-control-btn.unmuted {
  background: rgba(16, 185, 129, 0.6);
}

.admin-control-btn.muted {
  background: rgba(239, 68, 68, 0.6);
}

.admin-control-btn.undeafened {
  background: rgba(59, 130, 246, 0.6);
}

.admin-control-btn.deafened {
  background: rgba(107, 114, 128, 0.6);
}

.admin-control-btn.disconnect {
  background: rgba(239, 68, 68, 0.6);
}
</style>
