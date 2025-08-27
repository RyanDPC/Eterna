<template>
  <div 
    id="app" 
    class="h-screen w-screen bg-background-primary text-white overflow-hidden flex flex-col"
    :style="appearanceStyle"
  >
    <!-- Background animé -->
    <div class="animated-background"></div>
    
    <!-- Particules flottantes -->
    <div class="floating-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    
    <!-- Lignes de connexion -->
    <div class="connection-lines">
      <div class="connection-line"></div>
      <div class="connection-line"></div>
      <div class="connection-line"></div>
    </div>

    <!-- Modal d'authentification - Affiché par défaut -->
    <AuthModal
      v-if="!authStore.isAuthenticated"
      @close="handleCloseAuth"
      @login="handleLogin"
      @register="handleRegister"
    />

    <!-- Vérificateur de mises à jour -->
    <UpdateChecker />

    <!-- Interface principale après authentification -->
    <div v-if="authStore.isAuthenticated" class="h-full flex flex-col">
      <!-- Header élégant et minimaliste -->
      <header class="h-16 header-sakura flex items-center justify-between px-6 backdrop-blur-md flex-shrink-0">
        <!-- Profil utilisateur principal -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-sakura-400 to-sakura-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
            <span class="text-white font-black text-2xl">{{ authStore.currentUser?.username?.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="text-left">
            <div class="text-xl font-bold text-white">{{ authStore.getUserDisplayName }}</div>
            <div class="text-sm text-sakura-400 font-medium flex items-center gap-2">
              <div class="w-2 h-2 bg-sakura-400 rounded-full animate-pulse"></div>
              {{ tLocal('app.online') }}
            </div>
          </div>
        </div>

        

        <!-- Actions et contrôles -->
        <div class="flex items-center gap-4">
                          <!-- Bouton des membres -->
                <button
                  @click="openMembersModal"
                  class="w-10 h-10 bg-sakura-500 hover:bg-sakura-600 rounded-xl flex items-center justify-center transition-colors shadow-lg hover:scale-105"
                  title="Voir les membres"
                >
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>

                                <!-- Bouton de debug temporaire -->
                <button
                  @click="debugFixEverything"
                  class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors shadow-lg hover:scale-105"
                  title="Debug: Corriger tout"
                >
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </button>

          <!-- Contrôles de fenêtre harmonisés -->
          <div class="flex items-center gap-1 ml-2">
            <button
              @click="minimizeWindow"
              class="w-6 h-6 bg-background-primary/60 hover:bg-background-primary/80 rounded-lg flex items-center justify-center transition-colors"
              :title="tLocal('window.minimize')"
            >
              <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
              </svg>
            </button>
            
            <button
              @click="maximizeWindow"
              class="w-6 h-6 bg-background-primary/60 hover:bg-background-primary/80 rounded-lg flex items-center justify-center transition-colors"
              :title="tLocal('window.maximize')"
            >
              <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            
            <button
              @click="closeWindow"
              class="w-6 h-6 bg-background-primary/60 hover:bg-background-primary/80 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors"
              :title="tLocal('window.close')"
            >
              <svg class="w-3 h-3 text-gray-300 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Corps principal - Prend toute la hauteur restante -->
      <main class="flex-1 flex overflow-hidden min-h-0">
        <!-- Sidebar navigation -->
        <aside class="w-20 bg-background-secondary border-r border-border-primary flex flex-col items-center py-4 gap-4 flex-shrink-0">
          <!-- Photo de profil de l'utilisateur -->
          <div class="w-12 h-12 rounded-2xl overflow-hidden cursor-pointer hover:scale-110 transition-transform shadow-lg">
            <img 
              v-if="authStore.currentUser?.avatar" 
              :src="authStore.currentUser.avatar" 
              :alt="authStore.getUserDisplayName"
              class="w-full h-full object-cover"
            />
            <div 
              v-else
              class="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">{{ authStore.currentUser?.username?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
          </div>

          <!-- Bouton Amis - Directement sous l'icône E -->
          <button
            @click="showFriendsPanel = !showFriendsPanel"
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-lg',
              showFriendsPanel 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500'
            ]"
            :title="tLocal('navigation.friends')"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </button>

          <!-- Séparateur -->
          <div class="w-8 h-px bg-border-primary"></div>

          <!-- Boutons d'action serveurs - Cachés quand les amis sont ouverts -->
          <div v-if="!showFriendsPanel" class="flex flex-col items-center gap-3">
            <button
              @click="showCreateModal = true"
              class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-lg"
              :title="tLocal('servers.create')"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              @click="showJoinModal = true"
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-lg"
              :title="tLocal('servers.join')"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </button>
          </div>

          <!-- Séparateur dynamique -->
          <div v-if="!showFriendsPanel" class="w-8 h-px bg-border-primary"></div>

          <!-- Serveurs minimisés style Discord - Affichés uniquement quand les amis sont ouverts -->
          <div v-if="showFriendsPanel" class="flex flex-col items-center gap-2">
            <div
              v-for="server in userServers"
              :key="server.id"
              @click="selectServerFromSidebar(server)"
              :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:rounded-xl duration-200',
                'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-pink-500 hover:to-purple-600'
              ]"
              :title="server.name"
            >
              <span class="text-white font-bold text-sm">{{ server.name.charAt(0).toUpperCase() }}</span>
            </div>
          </div>

        </aside>

          <!-- Zone principale - Prend toute la largeur restante -->
          <div class="flex-1 flex min-w-0">
            <!-- Sidebar des serveurs - Cachée quand les amis sont ouverts -->
            <nav 
              v-if="!showFriendsPanel"
              class="w-80 bg-gradient-to-b from-background-secondary via-background-secondary/95 to-background-primary/90 border-r border-border-primary/30 flex flex-col flex-shrink-0 backdrop-blur-sm transition-all duration-300"
            >
              <!-- Espace pour le contenu des serveurs -->
              <div class="p-6">
                <!-- Composant ServerList intégré avec style moderne -->
                                <div class="flex-1 overflow-hidden">
                  <ServerList
                    :servers="userServers"
                    :current-user="authStore.currentUser"
                    :current-channel="currentChannel"
                    :current-server="currentServer"
                    :compact="false"
                    @create="showCreateServerModal"
                    @join="showJoinServerModal"
                    @select-server="selectServer"
                    @select-channel="selectChannel"
                    @add-channel="addChannel"
                    @voice-channel-created="handleVoiceChannelCreated"
                    @show-settings="showServerSettingsModal"
                    @open-voice-status="openVoiceStatusModal"
                  />
                </div>
              </div>
            </nav>

            <!-- Panneau des amis - S'affiche en grand quand actif -->
            <div 
              v-if="showFriendsPanel" 
              class="w-96 bg-gradient-to-b from-background-secondary via-background-secondary/95 to-background-primary/90 border-r border-border-primary/30 flex flex-col flex-shrink-0 backdrop-blur-sm transition-all duration-300"
            >
              <FriendsPanel />
            </div>

          <!-- Zone de chat - Design moderne et élégant -->
          <div class="chat-area flex-1 flex flex-col bg-gradient-to-br from-background-primary via-background-primary/95 to-background-secondary/80 min-w-0 backdrop-blur-sm">
            <div class="chat-header h-20 bg-gradient-to-r from-background-secondary/90 to-background-secondary/70 border-b border-border-primary/20 flex items-center justify-between px-8 flex-shrink-0 backdrop-blur-md">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h1 class="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent truncate">
                    {{ currentChannel?.name || tLocal('channels.selectChannel') }}
                  </h1>
                  <p class="text-sm text-gray-400">{{ currentServer?.name || tLocal('servers.noServerSelected') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <button 
                  @click="showSettingsModal = true"
                  class="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 hover:border-pink-500/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                  :title="tLocal('navigation.settings')"
                >
                  <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="messages-container flex-1 p-8 overflow-y-auto min-h-0">
              <div class="space-y-6">
                <div
                  v-for="message in currentChannelMessages"
                  :key="message.id"
                  class="flex items-start gap-5 group hover:bg-white/5 p-4 rounded-2xl transition-all duration-300"
                >
                  <!-- Avatar avec effet de brillance -->
                  <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                    <span class="text-white font-bold text-lg">{{ message.author.username?.charAt(0).toUpperCase() || 'U' }}</span>
                  </div>

                  <!-- Contenu du message avec design moderne -->
                  <div class="message-content flex-1 min-w-0">
                    <div class="message-header flex items-center gap-4 mb-3">
                      <span class="message-author font-bold text-lg bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {{ message.author.displayName || message.author.username || tLocal('messages.user') }}
                      </span>
                      <span class="message-time text-sm text-gray-400 flex-shrink-0 bg-gray-800/50 px-3 py-1 rounded-full">
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                    <div class="message-text text-gray-200 break-words text-base leading-relaxed bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                      {{ message.content }}
                    </div>
                  </div>
                </div>
                
                <!-- Message d'état si aucun message -->
                <div v-if="currentChannelMessages.length === 0" class="text-center py-20">
                  <div class="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-300 mb-2">{{ tLocal('messages.noMessages') }}</h3>
                  <p class="text-gray-500">{{ tLocal('messages.beFirstToMessage') }}</p>
                </div>
              </div>
            </div>

            <div class="message-input-area p-8 bg-gradient-to-r from-background-secondary/90 to-background-secondary/70 border-t border-border-primary/20 flex-shrink-0 backdrop-blur-md">
              <div class="flex items-end gap-6">
                <div class="message-input flex-1 min-w-0">
                  <input
                    v-model="newMessage"
                    @keyup.enter="sendMessage"
                    type="text"
                    :placeholder="tLocal('messages.writeMessage')"
                    class="w-full bg-background-primary/50 border border-pink-500/30 rounded-2xl px-6 py-4 text-white placeholder:text-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 backdrop-blur-sm hover:bg-background-primary/70"
                  />
                </div>
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                  class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals de serveurs -->
    <ServerModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @create="handleCreateServer"
    />
    
    <JoinServerModal
      v-if="showJoinModal"
      @close="showJoinModal = false"
      @join="handleJoinServer"
    />
    
    <ServerSettingsModal
      v-if="isServerSettingsModalOpen"
      :server="selectedServerForSettings"
      @close="isServerSettingsModalOpen = false"
      @leave="handleServerLeft"
    />

    <!-- Modal des paramètres -->
    <SettingsModal 
      :show="showSettingsModal"
      @close="showSettingsModal = false"
    />

    <!-- Modal de statut vocal -->
    <VoiceStatusModal 
      :is-visible="showVoiceStatusModal"
      :current-user="authStore.currentUser"
      @close="closeVoiceStatusModal"
    />

    <!-- Modal des membres -->
    <MembersModal 
      :show="showMembersModal"
      :current-server="currentServer"
      @close="showMembersModal = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useAppStore } from './stores/appStore'
import { useI18n } from './i18n'
import AuthModal from './components/AuthModal.vue'
import ServerList from './components/ServerList.vue'
import ServerModal from './components/ServerModal.vue'
import JoinServerModal from './components/JoinServerModal.vue'
import ServerSettingsModal from './components/ServerSettingsModal.vue'
import SettingsModal from './components/SettingsModal.vue'

import FriendsPanel from './components/FriendsPanel.vue'
import VoiceStatusModal from './components/VoiceStatusModal.vue'
import MembersModal from './components/MembersModal.vue'
import UpdateChecker from './components/UpdateChecker.vue'

// Stores
const authStore = useAuthStore()
const appStore = useAppStore()

// Internationalisation
const { t } = useI18n()

// Fonction de traduction locale qui utilise la langue du store
const tLocal = (key) => {
  const lang = appStore.settings.language || 'fr'
  return t(key, lang)
}

// État local pour le chat
const newMessage = ref('')
const showCreateModal = ref(false)
const showJoinModal = ref(false)
const isServerSettingsModalOpen = ref(false)
const selectedServerForSettings = ref(null)
const showSettingsModal = ref(false)
const showFriendsPanel = ref(false)
const showVoiceStatusModal = ref(false)
const showMembersModal = ref(false)

// Gestion du modal de statut vocal
const openVoiceStatusModal = () => {
  showVoiceStatusModal.value = true
}

const closeVoiceStatusModal = () => {
  showVoiceStatusModal.value = false
}

// Gestion du modal des membres
const openMembersModal = () => {
  console.log('🔍 App.vue - openMembersModal called')
  console.log('🔍 App.vue - currentServer:', currentServer.value)
  console.log('🔍 App.vue - showMembersModal ref:', showMembersModal.value)
  showMembersModal.value = true
  console.log('🔍 App.vue - showMembersModal set to true')
}

// Fonction de debug pour corriger tout
const debugFixEverything = () => {
  console.log('🔧 DEBUG: Nettoyage complet et création d\'un serveur propre')
  
  // Nettoyer complètement la base de données
  appStore.clearAllData()
  
  // Créer un serveur propre et stable
  appStore.createCleanServer()
  
  // Corriger le rôle de l'utilisateur actuel
  appStore.fixCurrentUserRole()
  
  console.log('🔧 DEBUG: Nettoyage terminé, rechargement de la page...')
  
  // Recharger la page après un délai
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

const channels = computed(() => appStore.currentServerChannels)
const currentChannel = computed(() => appStore.currentChannel)
const currentChannelMessages = computed(() => appStore.currentChannelMessages)
const currentServer = computed(() => appStore.currentServer)
const voiceStatus = computed(() => appStore.voiceStatus)
const userServers = computed(() => {
  // Vérifier que les stores sont initialisés et que l'utilisateur est connecté
  if (!appStore.servers || !authStore.currentUser) {
    console.log('userServers: Stores non initialisés ou utilisateur non connecté')
    return []
  }
  
  console.log('userServers: Tous les serveurs:', appStore.servers)
  console.log('userServers: Utilisateur actuel:', authStore.currentUser)
  
  const filteredServers = appStore.servers.filter(server => {
    const hasMembers = server.members && Array.isArray(server.members)
    
    // Vérifier si l'utilisateur est membre OU si c'est un serveur par défaut
    const isMember = hasMembers && (
      server.members.includes(authStore.currentUser.id) || 
      server.members.includes('default-user')
    )
    
    console.log(`Serveur ${server.name}: members=${server.members}, isMember=${isMember}`)
    
    return isMember
  })
  
  console.log('userServers: Serveurs filtrés:', filteredServers)
  return filteredServers
})

// 🎨 STYLES D'APPEARANCE DYNAMIQUES - APPLIQUÉS AUTOMATIQUEMENT
const appearanceStyle = computed(() => {
  const settings = appStore.settings
  
  // Styles de base
  const baseStyles = {
    fontSize: `${settings.fontSize || 16}px`,
    transform: `scale(${(settings.zoomLevel || 100) / 100})`,
    transformOrigin: 'top left'
  }
  
  // Variables CSS personnalisées
  const cssVariables = {
    '--accent-color': settings.accentColor || '#5865f2',
    '--accent-color-hover': settings.accentColor ? `${settings.accentColor}dd` : '#5865f2dd',
    '--accent-color-light': settings.accentColor ? `${settings.accentColor}33` : '#5865f233',
    '--transparency': `${(100 - (settings.transparency || 0)) / 100}`,
    '--backdrop-blur': settings.backdropBlur ? 'blur(10px)' : 'none',
    '--reduced-motion': settings.reducedMotion ? 'none' : 'all',
    '--compact-spacing': settings.compactMode ? '0.75' : '1'
  }
  
  // Appliquer la transparence si activée
  if (settings.transparency > 0) {
    baseStyles.opacity = cssVariables['--transparency']
  }
  
  // Appliquer le flou d'arrière-plan
  if (settings.backdropBlur) {
    baseStyles.backdropFilter = cssVariables['--backdrop-blur']
  }
  
  // Combiner tous les styles
  return {
    ...baseStyles,
    ...Object.fromEntries(
      Object.entries(cssVariables).map(([key, value]) => [key, value])
    )
  }
})

// 🎯 APPLIQUER LES PARAMÈTRES D'APPEARANCE AU DOM
const applyAppearanceSettings = () => {
  const settings = appStore.settings
  
  // Appliquer le thème
  document.documentElement.setAttribute('data-theme', settings.theme || 'dark')
  document.body.setAttribute('data-theme', settings.theme || 'dark')
  
  // Appliquer la couleur d'accent - FORCE L'APPLICATION
  const accentColor = settings.accentColor || '#5865f2'
  document.documentElement.style.setProperty('--accent-color', accentColor)
  document.documentElement.style.setProperty('--accent-color-hover', `${accentColor}dd`)
  document.documentElement.style.setProperty('--accent-color-light', `${accentColor}33`)
  
  // Forcer l'application des couleurs sur tous les boutons
  const styleSheet = document.getElementById('dynamic-appearance-styles')
  if (styleSheet) {
    styleSheet.remove()
  }
  
  const newStyleSheet = document.createElement('style')
  newStyleSheet.id = 'dynamic-appearance-styles'
  newStyleSheet.innerHTML = `
    /* 🎨 STYLES DYNAMIQUES D'APPARENCE */
    :root {
      --accent-color: ${accentColor} !important;
      --accent-color-hover: ${accentColor}dd !important;
      --accent-color-light: ${accentColor}33 !important;
    }
    
    /* Application forcée de la couleur d'accent */
    .btn-primary,
    .theme-btn.active,
    .size-btn-discord.active,
    .color-option-discord.active,
    .theme-card-discord.active,
    .nav-item-discord.active,
    .welcome-card-discord:hover {
      background: ${accentColor} !important;
      border-color: ${accentColor} !important;
    }
    
    /* Survols avec couleur d'accent */
    .btn-primary:hover,
    .theme-btn:hover,
    .size-btn-discord:hover,
    .color-option-discord:hover,
    .welcome-card-discord:hover {
      background: ${accentColor}dd !important;
      box-shadow: 0 8px 25px ${accentColor}33 !important;
    }
    
    /* 🌸 THÈME CLAIR - SAKURA HARMONIEUX (COMPATIBLE AVEC LES PARAMÈTRES) */
    [data-theme="light"] {
      --background-primary: #fefefe !important;
      --background-secondary: #f8f9fa !important;
      --text-primary: #2c3e50 !important;
      --text-secondary: #5a6c7d !important;
      --border-primary: #e8ecef !important;
      --accent-color: #ff6b9d !important;
      --transparency: 0 !important;
      --backdrop-blur: none !important;
      --glass-effect: none !important;
    }
    
    /* 🌸 THÈME BLANC - SAKURA HARMONIEUX (MÊME COULEURS QUE CLAIR) */
    [data-theme="white"] {
      --background-primary: #fefefe !important;
      --background-secondary: #f8f9fa !important;
      --text-primary: #2c3e50 !important;
      --text-secondary: #5a6c7d !important;
      --border-primary: #e8ecef !important;
      --accent-color: #ff6b9d !important;
      --transparency: 0 !important;
      --backdrop-blur: none !important;
      --glass-effect: none !important;
    }
    
    /* 🌸 THÈME BLANC - STYLES SAKURA COMPLETS */
    [data-theme="white"] body,
    [data-theme="white"] #app,
    [data-theme="white"] .h-screen {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .sidebar {
      background: #fefefe !important;
      border-right: 1px solid #e8ecef !important;
    }
    
    [data-theme="white"] .server-list,
    [data-theme="white"] .server-card,
    [data-theme="white"] .server-item {
      background: transparent !important;
      color: #2c3e50 !important;
      border: none !important;
      box-shadow: none !important;
    }
    
    [data-theme="white"] .main-content,
    [data-theme="white"] .chat-container {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .channel-header {
      background: transparent !important;
      color: #2c3e50 !important;
      border-bottom: 1px solid #e8ecef !important;
    }
    
    [data-theme="white"] .message-area {
      background: transparent !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .message-input,
    [data-theme="white"] .input-container {
      background: transparent !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
    }
    
    [data-theme="white"] .friends-panel {
      background: transparent !important;
      color: #2c3e50 !important;
      border-left: 1px solid #e8ecef !important;
    }
    
    [data-theme="white"] .modal-content,
    [data-theme="white"] .settings-panel,
    [data-theme="white"] .settings-modal,
    [data-theme="white"] .settings-container,
    [data-theme="white"] .settings-sidebar,
    [data-theme="white"] .settings-content,
    [data-theme="white"] .settings-tab,
    [data-theme="white"] .settings-card,
    [data-theme="white"] .theme-card,
    [data-theme="white"] .color-option,
    [data-theme="white"] .size-btn,
    [data-theme="white"] .toggle-switch,
    [data-theme="white"] .slider-container,
    [data-theme="white"] .preview-section {
      background: #fefefe !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
      box-shadow: 0 2px 8px rgba(255, 107, 157, 0.12) !important;
    }
    
    [data-theme="white"] .btn,
    [data-theme="white"] .btn-primary,
    [data-theme="white"] .btn-secondary,
    [data-theme="white"] .nav-item,
    [data-theme="white"] .tab-button {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
    }
    
    [data-theme="white"] input,
    [data-theme="white"] select,
    [data-theme="white"] textarea,
    [data-theme="white"] .form-control {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
    }
    
    [data-theme="white"] .text-white,
    [data-theme="white"] h1,
    [data-theme="white"] h2,
    [data-theme="white"] h3,
    [data-theme="white"] p,
    [data-theme="white"] span,
    [data-theme="white"] div {
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] * {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      text-shadow: none !important;
      box-shadow: none !important;
      opacity: 1 !important;
    }
    
    /* 🌸 STYLES SPÉCIFIQUES SAKURA POUR LES PARAMÈTRES (THÈME BLANC) */
    [data-theme="white"] .nav-item {
      background: transparent !important;
      color: #5a6c7d !important;
      border-radius: 8px !important;
      padding: 12px 16px !important;
      margin: 2px 0 !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="white"] .nav-item:hover {
      background: #ff6b9d15 !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .nav-item.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
    }
    
    [data-theme="white"] .btn:hover,
    [data-theme="white"] .btn-primary:hover,
    [data-theme="white"] .btn-secondary:hover {
      background: #ff6b9d15 !important;
      border-color: #ff6b9d !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .btn-primary.active,
    [data-theme="white"] .btn.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
      border-color: #ff6b9d !important;
    }
    
    [data-theme="white"] .theme-card:hover {
      border-color: #ff6b9d40 !important;
      box-shadow: 0 4px 12px #ff6b9d20 !important;
    }
    
    [data-theme="white"] .theme-card.active {
      border-color: #ff6b9d !important;
      background: #ff6b9d08 !important;
      box-shadow: 0 4px 16px #ff6b9d30 !important;
    }
    
    [data-theme="white"] .size-btn:hover {
      background: #ff6b9d15 !important;
      border-color: #ff6b9d40 !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .size-btn.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
      border-color: #ff6b9d !important;
    }
    
    [data-theme="white"] .toggle-switch.active {
      background: #ff6b9d !important;
      border-color: #ff6b9d !important;
    }
    
    [data-theme="white"] .slider-container input[type="range"]::-webkit-slider-thumb {
      background: #ff6b9d !important;
      border: 2px solid #ffffff !important;
    }
    
    [data-theme="white"] input:focus,
    [data-theme="white"] select:focus,
    [data-theme="white"] textarea:focus,
    [data-theme="white"] .form-control:focus {
      border-color: #ff6b9d !important;
      box-shadow: 0 0 0 3px #ff6b9d20 !important;
      outline: none !important;
    }
    
    [data-theme="white"] .color-option:hover {
      border-color: #ff6b9d !important;
      transform: scale(1.1) !important;
    }
    
    [data-theme="white"] .color-option.active {
      border-color: #ff6b9d !important;
      box-shadow: 0 0 0 3px #ff6b9d30 !important;
    }
    
    [data-theme="white"] .settings-tab:hover {
      color: #2c3e50 !important;
      border-bottom-color: #ff6b9d40 !important;
    }
    
    [data-theme="white"] .settings-tab.active {
      color: #ff6b9d !important;
      border-bottom-color: #ff6b9d !important;
    }
    
    /* FOND PRINCIPAL - BLANC PUR */
    [data-theme="light"] body,
    [data-theme="light"] #app,
    [data-theme="light"] .h-screen {
      background: #ffffff !important;
      color: #1a1a1a !important;
    }
    
    /* SIDEBAR GAUCHE - BLANC PUR */
    [data-theme="light"] .sidebar {
      background: #ffffff !important;
      border-right: 1px solid #e0e0e0 !important;
    }
    
    /* LISTE DES SERVEURS - BLANC PUR (PAS DE SÉPARATION) */
    [data-theme="light"] .server-list,
    [data-theme="light"] .server-card,
    [data-theme="light"] .server-item {
      background: transparent !important;
      color: #1a1a1a !important;
      border: none !important;
      box-shadow: none !important;
    }
    
    /* CONTENU PRINCIPAL - BLANC PUR */
    [data-theme="light"] .main-content,
    [data-theme="light"] .chat-container {
      background: #ffffff !important;
      color: #1a1a1a !important;
    }
    
    /* EN-TÊTE DE CANAL - BLANC PUR (PAS DE SÉPARATION) */
    [data-theme="light"] .channel-header {
      background: transparent !important;
      color: #1a1a1a !important;
      border-bottom: 1px solid #e0e0e0 !important;
    }
    
    /* ZONE DE MESSAGES - BLANC PUR */
    [data-theme="light"] .message-area {
      background: transparent !important;
      color: #1a1a1a !important;
    }
    
    /* CHAMP DE SAISIE - BLANC PUR (PAS DE SÉPARATION) */
    [data-theme="light"] .message-input,
    [data-theme="light"] .input-container {
      background: transparent !important;
      color: #1a1a1a !important;
      border: 1px solid #e0e0e0 !important;
    }
    
    /* PANEL D'AMIS - BLANC PUR */
    [data-theme="light"] .friends-panel {
      background: transparent !important;
      color: #1a1a1a !important;
      border-left: 1px solid #e0e0e0 !important;
    }
    
    /* MODALES ET PARAMÈTRES - BLANC PUR PROPRE (SANS EFFET LUMINEUX) */
    [data-theme="light"] .modal-content,
    [data-theme="light"] .settings-panel,
    [data-theme="light"] .settings-modal,
    [data-theme="light"] .settings-container,
    [data-theme="light"] .settings-sidebar,
    [data-theme="light"] .settings-content,
    [data-theme="light"] .settings-tab,
    [data-theme="light"] .settings-card,
    [data-theme="light"] .theme-card,
    [data-theme="light"] .color-option,
    [data-theme="light"] .size-btn,
    [data-theme="light"] .toggle-switch,
    [data-theme="light"] .slider-container,
    [data-theme="light"] .preview-section {
      background: #ffffff !important;
      color: #1a1a1a !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* BOUTONS ET ÉLÉMENTS INTERACTIFS - BLANC PUR PROPRE */
    [data-theme="light"] .btn,
    [data-theme="light"] .btn-primary,
    [data-theme="light"] .btn-secondary,
    [data-theme="light"] .nav-item,
    [data-theme="light"] .tab-button {
      background: #ffffff !important;
      color: #1a1a1a !important;
      border: 1px solid #e0e0e0 !important;
    }
    
    /* INPUTS ET FORMULAIRES - BLANC PUR PROPRE */
    [data-theme="light"] input,
    [data-theme="light"] select,
    [data-theme="light"] textarea,
    [data-theme="light"] .form-control {
      background: #ffffff !important;
      color: #1a1a1a !important;
      border: 1px solid #e0e0e0 !important;
    }
    
    /* TEXTE - NOIR PROPRE POUR CONTRASTE */
    [data-theme="light"] .text-white,
    [data-theme="light"] h1,
    [data-theme="light"] h2,
    [data-theme="light"] h3,
    [data-theme="light"] p,
    [data-theme="light"] span,
    [data-theme="light"] div {
      color: #1a1a1a !important;
    }
    
    /* 🚨 SUPPRIMER TOUS LES EFFETS DE VOILE, LUMINEUX ET TRANSPARENCE */
    [data-theme="light"] * {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      text-shadow: none !important;
      box-shadow: none !important;
      opacity: 1 !important;
      background-color: #ffffff !important;
      color: #1a1a1a !important;
    }
    
    /* 🚨 FORCER LA SUPPRESSION TOTALE DE TOUTE TRANSPARENCE */
    [data-theme="light"] *,
    [data-theme="light"] *::before,
    [data-theme="light"] *::after {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      text-shadow: none !important;
      box-shadow: none !important;
      opacity: 1 !important;
      background-color: #ffffff !important;
      color: #1a1a1a !important;
    }
    
    /* 🌸 STYLES SPÉCIFIQUES POUR LES PARAMÈTRES EN THÈME CLAIR SAKURA */
    [data-theme="light"] .settings-modal,
    [data-theme="light"] .settings-container,
    [data-theme="light"] .settings-sidebar,
    [data-theme="light"] .settings-content,
    [data-theme="light"] .settings-tab,
    [data-theme="light"] .settings-card,
    [data-theme="light"] .theme-card,
    [data-theme="light"] .color-option,
    [data-theme="light"] .size-btn,
    [data-theme="light"] .toggle-switch,
    [data-theme="light"] .slider-container,
    [data-theme="light"] .preview-section,
    [data-theme="light"] .btn,
    [data-theme="light"] .btn-primary,
    [data-theme="light"] .btn-secondary,
    [data-theme="light"] .nav-item,
    [data-theme="light"] .tab-button,
    [data-theme="light"] input,
    [data-theme="light"] .form-control {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      opacity: 1 !important;
      text-shadow: none !important;
      box-shadow: none !important;
    }
    
    /* 🌸 COULEURS SAKURA POUR LES PARAMÈTRES */
    [data-theme="light"] .settings-modal {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="light"] .settings-sidebar {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border-right: 1px solid #e8ecef !important;
    }
    
    [data-theme="light"] .settings-content {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="light"] .nav-item {
      background: transparent !important;
      color: #5a6c7d !important;
      border-radius: 8px !important;
      padding: 12px 16px !important;
      margin: 2px 0 !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="light"] .nav-item:hover {
      background: #ff6b9d15 !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="light"] .nav-item.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
    }
    
    /* 🌸 BOUTONS ET ÉLÉMENTS INTERACTIFS SAKURA */
    [data-theme="light"] .btn,
    [data-theme="light"] .btn-primary,
    [data-theme="light"] .btn-secondary {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
      border-radius: 8px !important;
      padding: 8px 16px !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="light"] .btn:hover,
    [data-theme="light"] .btn-primary:hover,
    [data-theme="light"] .btn-secondary:hover {
      background: #ff6b9d15 !important;
      border-color: #ff6b9d !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="light"] .btn-primary.active,
    [data-theme="light"] .btn.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
      border-color: #ff6b9d !important;
    }
    
    /* 🌸 CARTES DE THÈME SAKURA */
    [data-theme="light"] .theme-card {
      background: #fefefe !important;
      color: #2c3e50 !important;
      border: 2px solid #e8ecef !important;
      border-radius: 12px !important;
      padding: 16px !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="light"] .theme-card:hover {
      border-color: #ff6b9d40 !important;
      box-shadow: 0 4px 12px #ff6b9d20 !important;
    }
    
    [data-theme="light"] .theme-card.active {
      border-color: #ff6b9d !important;
      background: #ff6b9d08 !important;
      box-shadow: 0 4px 16px #ff6b9d30 !important;
    }
    
    /* 🌸 BOUTONS DE TAILLE SAKURA */
    [data-theme="light"] .size-btn {
      background: #f8f9fa !important;
      color: #5a6c7d !important;
      border: 1px solid #e8ecef !important;
      border-radius: 6px !important;
      padding: 6px 12px !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="light"] .size-btn:hover {
      background: #ff6b9d15 !important;
      border-color: #ff6b9d40 !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="light"] .size-btn.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
      border-color: #ff6b9d !important;
    }
    
    /* 🌸 TOGGLES ET SLIDERS SAKURA */
    [data-theme="light"] .toggle-switch {
      background: #e8ecef !important;
      border: 1px solid #d1d5db !important;
    }
    
    [data-theme="light"] .toggle-switch.active {
      background: #ff6b9d !important;
      border-color: #ff6b9d !important;
    }
    
    [data-theme="light"] .slider-container input[type="range"] {
      background: #e8ecef !important;
    }
    
    [data-theme="light"] .slider-container input[type="range"]::-webkit-slider-thumb {
      background: #ff6b9d !important;
      border: 2px solid #ffffff !important;
    }
    
    /* 🌸 INPUTS ET FORMULAIRES SAKURA */
    [data-theme="light"] input,
    [data-theme="light"] select,
    [data-theme="light"] textarea,
    [data-theme="light"] .form-control {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
      border-radius: 8px !important;
      padding: 8px 12px !important;
    }
    
    [data-theme="light"] input:focus,
    [data-theme="light"] select:focus,
    [data-theme="light"] textarea:focus,
    [data-theme="light"] .form-control:focus {
      border-color: #ff6b9d !important;
      box-shadow: 0 0 0 3px #ff6b9d20 !important;
      outline: none !important;
    }
    
    /* 🌸 ÉLÉMENTS SPÉCIFIQUES DES PARAMÈTRES SAKURA */
    [data-theme="light"] .color-option {
      background: #f8f9fa !important;
      border: 2px solid #e8ecef !important;
      border-radius: 50% !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="light"] .color-option:hover {
      border-color: #ff6b9d !important;
      transform: scale(1.1) !important;
    }
    
    [data-theme="light"] .color-option.active {
      border-color: #ff6b9d !important;
      box-shadow: 0 0 0 3px #ff6b9d30 !important;
    }
    
    [data-theme="light"] .preview-section {
      background: #f8f9fa !important;
      border: 1px solid #e8ecef !important;
      border-radius: 12px !important;
      padding: 16px !important;
    }
    
    [data-theme="light"] .settings-tab {
      background: transparent !important;
      color: #5a6c7d !important;
      border-bottom: 2px solid transparent !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="light"] .settings-tab:hover {
      color: #2c3e50 !important;
      border-bottom-color: #ff6b9d40 !important;
    }
    
    [data-theme="light"] .settings-tab.active {
      color: #ff6b9d !important;
      border-bottom-color: #ff6b9d !important;
    }
    
    /* 🌸 TEXTE ET LABELS SAKURA */
    [data-theme="light"] h1,
    [data-theme="light"] h2,
    [data-theme="light"] h3,
    [data-theme="light"] h4,
    [data-theme="light"] h5,
    [data-theme="light"] h6 {
      color: #2c3e50 !important;
    }
    
    [data-theme="light"] p,
    [data-theme="light"] span,
    [data-theme="light"] label,
    [data-theme="light"] .description {
      color: #5a6c7d !important;
    }
    
    [data-theme="light"] .section-title {
      color: #2c3e50 !important;
      font-weight: 600 !important;
    }
    
    /* 🌸 SCROLLBARS SAKURA */
    [data-theme="light"] ::-webkit-scrollbar {
      width: 8px !important;
    }
    
    [data-theme="light"] ::-webkit-scrollbar-track {
      background: #f8f9fa !important;
    }
    
    [data-theme="light"] ::-webkit-scrollbar-thumb {
      background: #ff6b9d40 !important;
      border-radius: 4px !important;
    }
    
    [data-theme="light"] ::-webkit-scrollbar-thumb:hover {
      background: #ff6b9d60 !important;
    }
    
    /* 🌸 THÈME BLANC - TOUS LES STYLES SAKURA (MÊME QUE CLAIR) */
    
    /* FOND PRINCIPAL - BLANC SAKURA DOUX */
    [data-theme="white"] body,
    [data-theme="white"] #app,
    [data-theme="white"] .h-screen {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    /* SIDEBAR GAUCHE - BLANC SAKURA DOUX */
    [data-theme="white"] .sidebar {
      background: #fefefe !important;
      border-right: 1px solid #e8ecef !important;
    }
    
    /* LISTE DES SERVEURS - BLANC SAKURA (PAS DE SÉPARATION) */
    [data-theme="white"] .server-list,
    [data-theme="white"] .server-card,
    [data-theme="white"] .server-item {
      background: transparent !important;
      color: #2c3e50 !important;
      border: none !important;
      box-shadow: none !important;
    }
    
    /* CONTENU PRINCIPAL - BLANC SAKURA DOUX */
    [data-theme="white"] .main-content,
    [data-theme="white"] .chat-container {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    /* EN-TÊTE DE CANAL - BLANC SAKURA (PAS DE SÉPARATION) */
    [data-theme="white"] .channel-header {
      background: transparent !important;
      color: #2c3e50 !important;
      border-bottom: 1px solid #e8ecef !important;
    }
    
    /* ZONE DE MESSAGES - BLANC SAKURA DOUX */
    [data-theme="white"] .message-area {
      background: transparent !important;
      color: #2c3e50 !important;
    }
    
    /* CHAMP DE SAISIE - BLANC SAKURA (PAS DE SÉPARATION) */
    [data-theme="white"] .message-input,
    [data-theme="white"] .input-container {
      background: transparent !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
    }
    
    /* PANEL D'AMIS - BLANC SAKURA DOUX */
    [data-theme="white"] .friends-panel {
      background: transparent !important;
      color: #2c3e50 !important;
      border-left: 1px solid #e8ecef !important;
    }
    
    /* MODALES ET PARAMÈTRES - BLANC SAKURA AVEC OMBRES DOUCES */
    [data-theme="white"] .modal-content,
    [data-theme="white"] .settings-panel,
    [data-theme="white"] .settings-modal,
    [data-theme="white"] .settings-container,
    [data-theme="white"] .settings-sidebar,
    [data-theme="white"] .settings-content,
    [data-theme="white"] .settings-tab,
    [data-theme="white"] .settings-card,
    [data-theme="white"] .theme-card,
    [data-theme="white"] .color-option,
    [data-theme="white"] .size-btn,
    [data-theme="white"] .toggle-switch,
    [data-theme="white"] .slider-container,
    [data-theme="white"] .preview-section {
      background: #fefefe !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
      box-shadow: 0 2px 8px rgba(255, 107, 157, 0.12) !important;
    }
    
    /* BOUTONS ET ÉLÉMENTS INTERACTIFS - BLANC SAKURA AVEC ACCENT */
    [data-theme="white"] .btn,
    [data-theme="white"] .btn-primary,
    [data-theme="white"] .btn-secondary,
    [data-theme="white"] .nav-item,
    [data-theme="white"] .tab-button {
      background: #fefefe !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
    }
    
    /* INPUTS ET FORMULAIRES - BLANC SAKURA DOUX */
    [data-theme="white"] input,
    [data-theme="white"] select,
    [data-theme="white"] textarea,
    [data-theme="white"] .form-control {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
    }
    
    /* TEXTE - COULEURS SAKURA HARMONIEUSES */
    [data-theme="white"] .text-white,
    [data-theme="white"] h1,
    [data-theme="white"] h2,
    [data-theme="white"] h3,
    [data-theme="white"] p,
    [data-theme="white"] span,
    [data-theme="white"] div {
      color: #2c3e50 !important;
    }
    
    /* SUPPRIMER TOUS LES EFFETS DE VOILE ET LUMINEUX */
    [data-theme="white"] * {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      text-shadow: none !important;
      box-shadow: none !important;
      opacity: 1 !important;
      background-color: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    /* FORCER LA SUPPRESSION TOTALE DE TOUTE TRANSPARENCE */
    [data-theme="white"] *,
    [data-theme="white"] *::before,
    [data-theme="white"] *::after {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      text-shadow: none !important;
      box-shadow: none !important;
      opacity: 1 !important;
      background-color: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    /* 🌸 STYLES SPÉCIFIQUES POUR LES PARAMÈTRES EN THÈME BLANC SAKURA */
    [data-theme="white"] .settings-modal,
    [data-theme="white"] .settings-container,
    [data-theme="white"] .settings-sidebar,
    [data-theme="white"] .settings-content,
    [data-theme="white"] .settings-tab,
    [data-theme="white"] .settings-card,
    [data-theme="white"] .theme-card,
    [data-theme="white"] .color-option,
    [data-theme="white"] .size-btn,
    [data-theme="white"] .toggle-switch,
    [data-theme="white"] .slider-container,
    [data-theme="white"] .preview-section,
    [data-theme="white"] .btn,
    [data-theme="white"] .btn-primary,
    [data-theme="white"] .btn-secondary,
    [data-theme="white"] .nav-item,
    [data-theme="white"] .tab-button,
    [data-theme="white"] input,
    [data-theme="white"] .form-control {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      opacity: 1 !important;
      text-shadow: none !important;
      box-shadow: none !important;
    }
    
    /* 🌸 COULEURS SAKURA POUR LES PARAMÈTRES (THÈME BLANC) */
    [data-theme="white"] .settings-modal {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .settings-sidebar {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border-right: 1px solid #e8ecef !important;
    }
    
    [data-theme="white"] .settings-content {
      background: #fefefe !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .nav-item {
      background: transparent !important;
      color: #5a6c7d !important;
      border-radius: 8px !important;
      padding: 12px 16px !important;
      margin: 2px 0 !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="white"] .nav-item:hover {
      background: #ff6b9d15 !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .nav-item.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
    }
    
    /* 🌸 BOUTONS ET ÉLÉMENTS INTERACTIFS SAKURA (THÈME BLANC) */
    [data-theme="white"] .btn,
    [data-theme="white"] .btn-primary,
    [data-theme="white"] .btn-secondary {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
      border-radius: 8px !important;
      padding: 8px 16px !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="white"] .btn:hover,
    [data-theme="white"] .btn-primary:hover,
    [data-theme="white"] .btn-secondary:hover {
      background: #ff6b9d15 !important;
      border-color: #ff6b9d !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .btn-primary.active,
    [data-theme="white"] .btn.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
      border-color: #ff6b9d !important;
    }
    
    /* 🌸 CARTES DE THÈME SAKURA (THÈME BLANC) */
    [data-theme="white"] .theme-card {
      background: #fefefe !important;
      color: #2c3e50 !important;
      border: 2px solid #e8ecef !important;
      border-radius: 12px !important;
      padding: 16px !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="white"] .theme-card:hover {
      border-color: #ff6b9d40 !important;
      box-shadow: 0 4px 12px #ff6b9d20 !important;
    }
    
    [data-theme="white"] .theme-card.active {
      border-color: #ff6b9d !important;
      background: #ff6b9d08 !important;
      box-shadow: 0 4px 16px #ff6b9d30 !important;
    }
    
    /* 🌸 BOUTONS DE TAILLE SAKURA (THÈME BLANC) */
    [data-theme="white"] .size-btn {
      background: #f8f9fa !important;
      color: #5a6c7d !important;
      border: 1px solid #e8ecef !important;
      border-radius: 6px !important;
      padding: 6px 12px !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="white"] .size-btn:hover {
      background: #ff6b9d15 !important;
      border-color: #ff6b9d40 !important;
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] .size-btn.active {
      background: #ff6b9d !important;
      color: #ffffff !important;
      border-color: #ff6b9d !important;
    }
    
    /* 🌸 TOGGLES ET SLIDERS SAKURA (THÈME BLANC) */
    [data-theme="white"] .toggle-switch {
      background: #e8ecef !important;
      border: 1px solid #d1d5db !important;
    }
    
    [data-theme="white"] .toggle-switch.active {
      background: #ff6b9d !important;
      border-color: #ff6b9d !important;
    }
    
    [data-theme="white"] .slider-container input[type="range"] {
      background: #e8ecef !important;
    }
    
    [data-theme="white"] .slider-container input[type="range"]::-webkit-slider-thumb {
      background: #ff6b9d !important;
      border: 2px solid #ffffff !important;
    }
    
    /* 🌸 INPUTS ET FORMULAIRES SAKURA (THÈME BLANC) */
    [data-theme="white"] input,
    [data-theme="white"] select,
    [data-theme="white"] textarea,
    [data-theme="white"] .form-control {
      background: #f8f9fa !important;
      color: #2c3e50 !important;
      border: 1px solid #e8ecef !important;
      border-radius: 8px !important;
      padding: 8px 12px !important;
    }
    
    [data-theme="white"] input:focus,
    [data-theme="white"] select:focus,
    [data-theme="white"] textarea:focus,
    [data-theme="white"] .form-control:focus {
      border-color: #ff6b9d !important;
      box-shadow: 0 0 0 3px #ff6b9d20 !important;
      outline: none !important;
    }
    
    /* 🌸 ÉLÉMENTS SPÉCIFIQUES DES PARAMÈTRES SAKURA (THÈME BLANC) */
    [data-theme="white"] .color-option {
      background: #f8f9fa !important;
      border: 2px solid #e8ecef !important;
      border-radius: 50% !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="white"] .color-option:hover {
      border-color: #ff6b9d !important;
      transform: scale(1.1) !important;
    }
    
    [data-theme="white"] .color-option.active {
      border-color: #ff6b9d !important;
      box-shadow: 0 0 0 3px #ff6b9d30 !important;
    }
    
    [data-theme="white"] .preview-section {
      background: #f8f9fa !important;
      border: 1px solid #e8ecef !important;
      border-radius: 12px !important;
      padding: 16px !important;
    }
    
    [data-theme="white"] .settings-tab {
      background: transparent !important;
      color: #5a6c7d !important;
      border-bottom: 2px solid transparent !important;
      transition: all 0.2s ease !important;
    }
    
    [data-theme="white"] .settings-tab:hover {
      color: #2c3e50 !important;
      border-bottom-color: #ff6b9d40 !important;
    }
    
    [data-theme="white"] .settings-tab.active {
      color: #ff6b9d !important;
      border-bottom-color: #ff6b9d !important;
    }
    
    /* 🌸 TEXTE ET LABELS SAKURA (THÈME BLANC) */
    [data-theme="white"] h1,
    [data-theme="white"] h2,
    [data-theme="white"] h3,
    [data-theme="white"] h4,
    [data-theme="white"] h5,
    [data-theme="white"] h6 {
      color: #2c3e50 !important;
    }
    
    [data-theme="white"] p,
    [data-theme="white"] span,
    [data-theme="white"] label,
    [data-theme="white"] .description {
      color: #5a6c7d !important;
    }
    
    [data-theme="white"] .section-title {
      color: #2c3e50 !important;
      font-weight: 600 !important;
    }
    
    /* 🌸 SCROLLBARS SAKURA (THÈME BLANC) */
    [data-theme="white"] ::-webkit-scrollbar {
      width: 8px !important;
    }
    
    [data-theme="white"] ::-webkit-scrollbar-track {
      background: #f8f9fa !important;
    }
    
    [data-theme="white"] ::-webkit-scrollbar-thumb {
      background: #ff6b9d40 !important;
      border-radius: 4px !important;
    }
    
    [data-theme="white"] ::-webkit-scrollbar-thumb:hover {
      background: #ff6b9d60 !important;
    }
    
    /* 🚨 SUPPRIMER TOUTE TRANSPARENCE SUR LES ÉLÉMENTS SPÉCIFIQUES */
    [data-theme="light"] .modal,
    [data-theme="light"] .modal-overlay,
    [data-theme="light"] .modal-backdrop,
    [data-theme="light"] .overlay,
    [data-theme="light"] .backdrop {
      background-color: #ffffff !important;
      opacity: 1 !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
    
    /* 🚨 FORCER L'OPACITÉ TOTALE SUR TOUS LES ÉLÉMENTS DE BASE */
    [data-theme="light"] html,
    [data-theme="light"] body,
    [data-theme="light"] #app,
    [data-theme="light"] .app-container,
    [data-theme="light"] .main-wrapper {
      background-color: #ffffff !important;
      opacity: 1 !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
    }
    
    /* 🚨 CORRIGER LE PROBLÈME DE ZOOM QUI COUPE L'INTERFACE */
    [data-theme="light"] #app,
    [data-theme="light"] .app-container,
    [data-theme="light"] .main-wrapper {
      min-width: 100vw !important;
      min-height: 100vh !important;
      overflow: visible !important;
      position: relative !important;
    }
    
    /* 🚨 FORCER L'ACCÈS AUX PARAMÈTRES MÊME AVEC ZOOM */
    [data-theme="light"] .settings-modal,
    [data-theme="light"] .settings-container {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 9999 !important;
      overflow: auto !important;
      transform: none !important;
    }
    
    /* 🎨 THÈME SOMBRE - VRAI THÈME D'AVANT AVEC FOND UNIFORME ET PLUS FONCÉ */
    [data-theme="dark"] {
      --background-primary: #0f0f1a !important;
      --background-secondary: #0a0a14 !important;
      --text-primary: #ffffff !important;
      --text-secondary: #b8c5d6 !important;
      --border-primary: #1a1a3a !important;
      --accent-color: #e94560 !important;
      --accent-secondary: #533483 !important;
      --accent-tertiary: #00d4ff !important;
    }
    
    /* FOND PRINCIPAL - BLEU TRÈS FONCÉ UNIFORME */
    [data-theme="dark"] body,
    [data-theme="dark"] #app,
    [data-theme="dark"] .h-screen {
      background: #0f0f1a !important;
      color: #ffffff !important;
    }
    
    /* SIDEBAR GAUCHE - MÊME FOND UNIFORME */
    [data-theme="dark"] .sidebar {
      background: #0f0f1a !important;
      border-right: 2px solid #1a1a3a !important;
      box-shadow: 2px 0 10px rgba(0, 212, 255, 0.1) !important;
    }
    
    /* LISTE DES SERVEURS - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] .server-list,
    [data-theme="dark"] .server-card,
    [data-theme="dark"] .server-item {
      background: transparent !important;
      color: #ffffff !important;
      border: none !important;
      box-shadow: none !important;
      transition: all 0.3s ease !important;
    }
    
    /* CONTENU PRINCIPAL - MÊME FOND UNIFORME */
    [data-theme="dark"] .main-content,
    [data-theme="dark"] .chat-container {
      background: #0f0f1a !important;
      color: #ffffff !important;
    }
    
    /* EN-TÊTE DE CANAL - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] .channel-header {
      background: transparent !important;
      color: #ffffff !important;
      border-bottom: 1px solid #1a1a3a !important;
      box-shadow: none !important;
    }
    
    /* ZONE DE MESSAGES - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] .message-area {
      background: transparent !important;
      color: #ffffff !important;
    }
    
    /* CHAMP DE SAISIE - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] .message-input,
    [data-theme="dark"] .input-container {
      background: transparent !important;
      color: #ffffff !important;
      border: 1px solid #1a1a3a !important;
      box-shadow: none !important;
    }
    
    /* PANEL D'AMIS - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] .friends-panel {
      background: transparent !important;
      color: #ffffff !important;
      border-left: 1px solid #1a1a3a !important;
      box-shadow: none !important;
    }
    
    /* MODALES ET PARAMÈTRES - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] .modal-content,
    [data-theme="dark"] .settings-panel,
    [data-theme="dark"] .settings-modal,
    [data-theme="dark"] .settings-container,
    [data-theme="dark"] .settings-sidebar,
    [data-theme="dark"] .settings-content,
    [data-theme="dark"] .settings-tab,
    [data-theme="dark"] .settings-card,
    [data-theme="dark"] .theme-card,
    [data-theme="dark"] .color-option,
    [data-theme="dark"] .size-btn,
    [data-theme="dark"] .toggle-switch,
    [data-theme="dark"] .slider-container,
    [data-theme="dark"] .preview-section {
      background: transparent !important;
      color: #ffffff !important;
      border: 1px solid #1a1a3a !important;
      box-shadow: none !important;
    }
    
    /* BOUTONS ET ÉLÉMENTS INTERACTIFS - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] .btn,
    [data-theme="dark"] .btn-primary,
    [data-theme="dark"] .btn-secondary,
    [data-theme="dark"] .nav-item,
    [data-theme="dark"] .tab-button {
      background: transparent !important;
      color: #ffffff !important;
      border: 1px solid #1a1a3a !important;
      box-shadow: none !important;
      transition: all 0.3s ease !important;
    }
    
    /* INPUTS ET FORMULAIRES - MÊME FOND QUE LA BASE (PAS DE SÉPARATION) */
    [data-theme="dark"] input,
    [data-theme="dark"] select,
    [data-theme="dark"] textarea,
    [data-theme="dark"] .form-control {
      background: transparent !important;
      color: #ffffff !important;
      border: 1px solid #1a1a3a !important;
      box-shadow: none !important;
    }
    
    /* TEXTE - BLANC AVEC EFFETS */
    [data-theme="dark"] .text-white,
    [data-theme="dark"] h1,
    [data-theme="dark"] h2,
    [data-theme="dark"] h3,
    [data-theme="dark"] p,
    [data-theme="dark"] span,
    [data-theme="dark"] div {
      color: #ffffff !important;
      text-shadow: 0 1px 3px rgba(0, 212, 255, 0.3) !important;
    }
    
    /* ANIMATIONS ET EFFETS - GARDER LES ANIMATIONS D'AVANT */
    [data-theme="dark"] * {
      transition: all 0.3s ease !important;
    }
    
    /* EFFETS DE SURVOL - ANIMATIONS D'AVANT */
    [data-theme="dark"] .server-card:hover,
    [data-theme="dark"] .server-item:hover,
    [data-theme="dark"] .btn:hover,
    [data-theme="dark"] .nav-item:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3) !important;
    }
    
    /* FORCER LES STYLES DES PARAMÈTRES EN THÈME SOMBRE ANIMÉ */
    [data-theme="dark"] .settings-modal,
    [data-theme="dark"] .settings-container,
    [data-theme="dark"] .settings-sidebar,
    [data-theme="dark"] .settings-content,
    [data-theme="dark"] .settings-tab,
    [data-theme="dark"] .settings-card,
    [data-theme="dark"] .theme-card,
    [data-theme="dark"] .color-option,
    [data-theme="dark"] .size-btn,
    [data-theme="dark"] .toggle-switch,
    [data-theme="dark"] .slider-container,
    [data-theme="dark"] .preview-section,
    [data-theme="dark"] .btn,
    [data-theme="dark"] .btn-primary,
    [data-theme="dark"] .btn-secondary,
    [data-theme="dark"] .nav-item,
    [data-theme="dark"] .tab-button,
    [data-theme="dark"] input,
    [data-theme="dark"] .select,
    [data-theme="dark"] textarea,
    [data-theme="dark"] .form-control {
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
      background-blend-mode: normal !important;
      mix-blend-mode: normal !important;
      opacity: 1 !important;
    }
  `
  document.head.appendChild(newStyleSheet)
  
  // Autres paramètres
  if (settings.transparency > 0) {
    document.documentElement.style.setProperty('--transparency', `${(100 - settings.transparency) / 100}`)
  }
  
  if (settings.backdropBlur) {
    document.documentElement.style.setProperty('--backdrop-blur', 'blur(10px)')
  } else {
    document.documentElement.style.setProperty('--backdrop-blur', 'none')
  }
  
  if (settings.reducedMotion) {
    document.documentElement.style.setProperty('--reduced-motion', 'none')
  } else {
    document.documentElement.style.setProperty('--reduced-motion', 'all')
  }
  
  if (settings.compactMode) {
    document.documentElement.classList.add('compact-mode')
  } else {
    document.documentElement.classList.remove('compact-mode')
  }
  
  // Appliquer la taille de police
  if (settings.fontSize) {
    document.documentElement.style.fontSize = `${settings.fontSize}px`
  }
  
  console.log('🎨 Paramètres d\'apparence appliqués avec force:', {
    theme: settings.theme,
    accentColor: accentColor,
    fontSize: settings.fontSize
  })
}

// Méthodes pour les contrôles de fenêtre
const minimizeWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.minimize()
  }
}

const maximizeWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.maximize()
  }
}

const closeWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.close()
  }
}

// Méthodes pour la gestion des serveurs et canaux
const selectServer = (server) => {
  appStore.setCurrentServer(server)
  // Cacher le panneau d'amis quand on sélectionne un serveur
  showFriendsPanel.value = false
}

// Sélectionner un serveur depuis la sidebar minimisée (mode amis)
const selectServerFromSidebar = (server) => {
  appStore.setCurrentServer(server)
  // Fermer le panneau d'amis et revenir à la vue normale
  showFriendsPanel.value = false
}

const selectChannel = (channelData) => {
  // Si c'est un objet avec plus d'infos (venant du ServerList)
  if (channelData.channel) {
    // Vérifier si c'est un CTL et si l'utilisateur est toujours connecté au vocal
    if (channelData.channel.isLinked && channelData.isLinkedChannel) {
      const linkedVoiceId = channelData.channel.linkedVoiceId
      console.log(`Sélection du CTL lié au vocal ${linkedVoiceId}`)
    }
    
    appStore.setCurrentChannel(channelData.channel)
  } else {
    // Compatibilité avec l'ancien format (juste le canal)
    appStore.setCurrentChannel(channelData)
  }
}

// Gestion des canaux vocaux
const handleVoiceChannelClick = (voiceChannel) => {
  if (appStore.voiceStatus.isConnected && appStore.voiceStatus.currentVoiceChannel?.id === voiceChannel.id) {
    // Si déjà connecté au même canal, se déconnecter
    appStore.disconnectFromVoiceChannel()
  } else {
    // Se connecter au nouveau canal vocal
    appStore.connectToVoiceChannel(voiceChannel)
  }
}



const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentChannel.value) return

  try {
    await appStore.addMessage({
      content: newMessage.value.trim(),
      channelId: currentChannel.value.id,
      author: {
        id: authStore.currentUser.id,
        username: authStore.currentUser.username,
        displayName: authStore.getUserDisplayName
      }
    })
    newMessage.value = ''
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 🚨 FONCTION DE RESET DU ZOOM (URGENCE)
const resetZoom = () => {
  try {
    // Reset du zoom dans le store
    appStore.resetZoom()
    
    // Forcer la mise à jour de l'interface
    nextTick(() => {
      // Recharger les paramètres d'apparence
      applyAppearanceSettings()
      
      // Notification de succès
      console.log('🎯 Zoom reset à 100% avec succès !')
      
      // Optionnel : Afficher une notification à l'utilisateur
      if (window.electronAPI && window.electronAPI.showNotification) {
        window.electronAPI.showNotification('Zoom reset', 'Le zoom a été remis à 100%')
      }
    })
  } catch (error) {
    console.error('❌ Erreur lors du reset du zoom:', error)
    
    // Fallback : reset direct via localStorage
    try {
      const currentSettings = JSON.parse(localStorage.getItem('eterna-settings') || '{}')
      currentSettings.zoomLevel = '100'
      localStorage.setItem('eterna-settings', JSON.stringify(currentSettings))
      
      // Recharger la page pour appliquer le reset
      window.location.reload()
    } catch (fallbackError) {
      console.error('❌ Erreur fallback:', fallbackError)
    }
  }
}



// Gestion de l'authentification
const handleLogin = async (credentials) => {
  try {
    await authStore.login(credentials)
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}

const handleRegister = async (userData) => {
  try {
    await authStore.register(userData)
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
  }
}



// Fonctions déjà déclarées plus haut

const handleCloseAuth = () => {
  // Empêcher la fermeture si pas connecté
  if (!authStore.isAuthenticated) {
    return
  }
}

// Méthodes pour les modals de serveurs
const showCreateServerModal = () => {
  showCreateModal.value = true
}

const showJoinServerModal = () => {
  showJoinModal.value = true
}

const showServerSettingsModal = (server) => {
  console.log('🎯 showServerSettingsModal reçu dans App.vue:', server)
  selectedServerForSettings.value = server
  isServerSettingsModalOpen.value = true
}

const handleServerLeft = (serverId) => {
  // Le serveur a été quitté, mettre à jour l'interface
  console.log('Serveur quitté:', serverId)
  
  // Si c'était le serveur actuel, le désélectionner
  if (currentServer.value?.id === serverId) {
    currentServer.value = null
    currentChannel.value = null
  }
}

const handleCreateServer = (serverData) => {
  try {
    // Ajouter l'ID de l'utilisateur actuel aux données du serveur
    const serverDataWithOwner = {
      ...serverData,
      ownerId: authStore.currentUser?.id || 'default-user'
    }
    
    console.log('Création du serveur avec données:', serverDataWithOwner)
    appStore.createServer(serverDataWithOwner)
    showCreateModal.value = false
  } catch (error) {
    console.error('Erreur lors de la création du serveur:', error)
  }
}

const handleJoinServer = async (serverId) => {
  try {
    // Vérifier que l'utilisateur est connecté
    if (!authStore.currentUser?.id) {
      console.error('Utilisateur non connecté')
      return
    }

    // Rejoindre le serveur
    await appStore.joinServer(serverId, authStore.currentUser.id)
    
    // Fermer le modal
    showJoinModal.value = false
    
    // Optionnel : Afficher une notification de succès
    console.log('Serveur rejoint avec succès !')
    
  } catch (error) {
    console.error('Erreur lors de la jointure du serveur:', error)
    // Optionnel : Afficher une notification d'erreur
  }
}



const addChannel = (server) => {
  // TODO: Implémenter l'ajout de canal
  console.log('Ajouter un canal au serveur:', server.name)
}

const handleVoiceChannelCreated = ({ voiceChannel, linkedTextChannel }) => {
  console.log('Nouveau canal vocal créé:', voiceChannel)
  console.log('Nouveau CTL créé:', linkedTextChannel)
  
  // Mettre à jour la liste des serveurs pour refléter les nouveaux canaux
  // Le store Pinia se met à jour automatiquement, donc pas besoin de logique supplémentaire ici
  
  // Optionnel : Afficher une notification de succès
  // showNotification('Canal vocal créé avec succès !')
}





// 🎨 WATCHER POUR APPLIQUER AUTOMATIQUEMENT LES CHANGEMENTS D'APPEARANCE
// Surveiller seulement les changements de thème et couleur d'accent
watch(
  () => [appStore.settings.theme, appStore.settings.accentColor],
  ([newTheme, newAccentColor]) => {
    console.log('🎨 Changement de thème/couleur détecté:', { theme: newTheme, accent: newAccentColor })
    applyAppearanceSettings()
  },
  { immediate: false }
)

// Initialisation du store au montage du composant
onMounted(async () => {
  console.log('Initialisation de l\'application...')
  
  try {
    // Initialiser le store d'application
    await appStore.initialize(authStore.currentUser?.id)
    console.log('Store initialisé avec succès')
    
    // 🎨 APPLIQUER IMMÉDIATEMENT LES PARAMÈTRES D'APPEARANCE
    applyAppearanceSettings()
    console.log('🎨 Paramètres d\'apparence appliqués au démarrage')
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du store:', error)
  }
})
</script>

<style scoped>
/* Styles spécifiques au composant */
.app-logo:hover .logo-icon {
  transform: scale(1.05);
}

.server-item:hover .server-avatar {
  transform: scale(1.05);
}

.channel-item:hover {
  transform: translateX(4px);
}

.message:hover {
  transform: translateY(-2px);
}

/* Animations d'entrée */
.message {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.setting-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

/* Section d'accueil des paramètres */
.welcome-settings {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.1), rgba(114, 137, 218, 0.1));
  border-radius: 16px;
  border: 1px solid rgba(88, 101, 242, 0.2);
  margin-top: 20px;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.welcome-settings h3 {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  background: linear-gradient(90deg, #fff, #b9bbbe);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-settings p {
  color: #b9bbbe;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
}

/* Amélioration des boutons */
.btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

/* Amélioration des toggles */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  transition: all 0.3s ease;
}

.toggle-switch:hover {
  transform: scale(1.05);
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #4a5568, #2d3748);
  transition: 0.3s;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 2px;
  background: linear-gradient(135deg, #fff, #f7fafc);
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #5865f2, #7289da);
  border-color: rgba(88, 101, 242, 0.5);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
  box-shadow: 0 2px 8px rgba(88, 101, 242, 0.4);
}

/* Amélioration des sélecteurs */
.setting-select {
  background: linear-gradient(135deg, rgba(74, 85, 104, 0.3), rgba(45, 55, 72, 0.3));
  border: 1px solid rgba(88, 101, 242, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  padding: 10px 14px;
  font-size: 0.875rem;
  min-width: 180px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.setting-select:focus {
  outline: none;
  border-color: #5865f2;
  box-shadow: 0 0 0 3px rgba(88, 101, 242, 0.2);
  transform: translateY(-1px);
}

.setting-select:hover {
  border-color: #7289da;
  background: linear-gradient(135deg, rgba(74, 85, 104, 0.4), rgba(45, 55, 72, 0.4));
}

/* Amélioration des boutons de thème */
.theme-toggle {
  display: flex;
  gap: 8px;
}

.theme-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #40444b, #2f3136);
  border: 2px solid rgba(88, 101, 242, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b9bbbe;
  position: relative;
  overflow: hidden;
}

.theme-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.1), rgba(114, 137, 218, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-btn:hover {
  background: linear-gradient(135deg, #4a5568, #36393f);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.theme-btn:hover::before {
  opacity: 1;
}

.theme-btn.active {
  background: linear-gradient(135deg, #5865f2, #7289da);
  border-color: #5865f2;
  color: #fff;
  box-shadow: 0 8px 25px rgba(88, 101, 242, 0.4);
  transform: translateY(-2px);
}

.theme-btn > * {
  position: relative;
  z-index: 1;
}

/* 🎨 STYLES GLOBAUX POUR LES VARIABLES CSS D'APPEARANCE */
:root {
  /* Couleurs d'accent par défaut */
  --accent-color: #5865f2;
  --accent-color-hover: #5865f2dd;
  --accent-color-light: #5865f233;
  
  /* Transparence et effets */
  --transparency: 1;
  --backdrop-blur: none;
  --reduced-motion: all;
  --compact-spacing: 1;
}

/* 🎯 APPLIQUER LES VARIABLES CSS À TOUS LES ÉLÉMENTS */
* {
  transition: var(--reduced-motion);
}

/* 🚨 CORRIGER LE PROBLÈME DE ZOOM GLOBAL */
#app {
  min-width: 100vw !important;
  min-height: 100vh !important;
  overflow: visible !important;
  position: relative !important;
}

/* 🚨 FORCER L'ACCÈS AUX PARAMÈTRES MÊME AVEC ZOOM (TOUS THÈMES) */
.settings-modal,
.settings-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  overflow: auto !important;
  transform: none !important;
}

/* 🚨 CORRIGER L'OVERFLOW DU ZOOM */
body {
  overflow-x: auto !important;
  overflow-y: auto !important;
}

/* 🎨 STYLES DE BASE POUR LES THÈMES */
.server-card,
.server-item,
.friends-panel,
.main-content,
.sidebar,
.channel-header,
.message-input,
.modal-content,
.settings-panel,
.server-list,
.friends-panel,
.chat-container,
.message-area,
.input-container {
  opacity: 1 !important;
  background-image: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  filter: none !important;
}

/* FORCER LES COULEURS SOLIDES */
.server-card,
.server-item,
.friends-panel,
.main-content,
.sidebar,
.channel-header,
.message-input,
.modal-content,
.settings-panel {
  background: var(--background-primary) !important;
  color: var(--text-primary) !important;
}

/* SUPPRIMER LES EFFETS DE LUMIÈRE */
.server-card:hover,
.server-item:hover,
.friends-panel:hover,
.main-content:hover,
.sidebar:hover,
.channel-header:hover,
.message-input:hover,
.modal-content:hover,
.settings-panel:hover {
  box-shadow: none !important;
  filter: none !important;
  transform: none !important;
}

/* Mode compact */
.compact-mode * {
  margin: calc(var(--compact-spacing) * 0.5em) !important;
  padding: calc(var(--compact-spacing) * 0.5em) !important;
}

.compact-mode .message,
.compact-mode .channel-item,
.compact-mode .server-item {
  margin: calc(var(--compact-spacing) * 0.25em) 0 !important;
  padding: calc(var(--compact-spacing) * 0.5em) !important;
}

/* Transparence globale */
.transparent-elements {
  opacity: var(--transparency);
}

/* Flou d'arrière-plan */
.backdrop-blur-enabled {
  backdrop-filter: var(--backdrop-blur);
}

/* Animations réduites */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Thèmes dynamiques maintenant appliqués via JavaScript */

/* Styles supprimés - Plus nécessaire */
</style>
