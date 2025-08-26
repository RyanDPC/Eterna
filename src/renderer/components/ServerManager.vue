<template>
  <div class="space-y-3">
    <!-- En-tête compact -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-white">Communautés</h3>
    </div>

    <!-- Boutons d'action -->
    <div class="flex flex-col gap-2">
      <!-- Bouton créer un serveur -->
      <button
        v-if="userServers.length < 5"
        @click="showCreateModal = true"
        class="w-full flex items-center gap-2 p-2 bg-background-primary border border-border-primary rounded-lg hover:border-pink-500/50 transition-all group"
        title="Créer une communauté"
      >
        <div class="w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span class="text-xs text-gray-300 group-hover:text-white transition-colors">Créer</span>
      </button>
      
      <div v-else class="text-red-400 text-xs text-center p-2">
        Limite de 5 communautés atteinte
      </div>

      <!-- Bouton rejoindre un serveur -->
      <button
        @click="showJoinModal = true"
        class="w-full flex items-center gap-2 p-2 bg-background-primary border border-border-primary rounded-lg hover:border-pink-500/50 transition-all group"
        title="Rejoindre une communauté"
      >
        <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <span class="text-xs text-gray-300 group-hover:text-white transition-colors">Rejoindre</span>
      </button>
    </div>

    <!-- Modal de création de serveur -->
    <ServerModal
      v-if="showCreateModal"
      :server="editingServer"
      @close="closeCreateModal"
      @save="handleServerSave"
    />

    <!-- Modal de rejoindre un serveur -->
    <JoinServerModal
      v-if="showJoinModal"
      @close="closeJoinModal"
      @join="handleJoinServer"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'
import ServerModal from './ServerModal.vue'
import JoinServerModal from './JoinServerModal.vue'

// Stores
const authStore = useAuthStore()
const appStore = useAppStore()

// État local
const showCreateModal = ref(false)
const showJoinModal = ref(false)
const editingServer = ref(null)

// Serveurs de l'utilisateur connecté
const userServers = computed(() => {
  // Vérifier que les stores sont initialisés et que l'utilisateur est connecté
  if (!appStore.servers || !authStore.currentUser) {
    return []
  }
  
  return appStore.servers.filter(server => 
    server.ownerId === authStore.currentUser.id
  )
})

// Fermer le modal de création
const closeCreateModal = () => {
  showCreateModal.value = false
  editingServer.value = null
}

// Fermer le modal de rejoindre
const closeJoinModal = () => {
  showJoinModal.value = false
}

// Sauvegarder un serveur
const handleServerSave = async (serverData) => {
  try {
    await appStore.createServer({
      ...serverData,
      ownerId: authStore.currentUser.id
    })
    closeCreateModal()
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  }
}

// Rejoindre un serveur
const handleJoinServer = async (serverId) => {
  try {
    await appStore.joinServer(serverId, authStore.currentUser.id)
    closeJoinModal()
  } catch (error) {
    console.error('Erreur lors de la jointure:', error)
  }
}
</script>
