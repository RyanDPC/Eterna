<template>
  <Teleport to="body">
    <div class="modal-root">
      <div class="modal-overlay" @click="$emit('close')"></div>
      <div class="modal-dialog">
        <!-- En-tête du modal -->
        <div class="modal-header">
          <div class="modal-icon">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h1 class="modal-title">Rejoindre un serveur</h1>
          <p class="modal-subtitle">Découvrez et rejoignez des serveurs passionnants</p>
        </div>

        <!-- Contenu du modal -->
        <div class="modal-body">
          <!-- Barre de recherche -->
          <div class="search-section">
            <label for="serverSearch" class="search-label">Rechercher un serveur</label>
            <div class="search-input-container">
              <input
                id="serverSearch"
                v-model="searchQuery"
                type="text"
                placeholder="Tapez le nom d'un serveur..."
                class="search-input"
              />
              <button class="search-button">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <p class="search-help">
              Recherche stricte : affiche uniquement les serveurs commençant par votre saisie
            </p>
          </div>

          <!-- Liste des serveurs trouvés -->
          <div v-if="filteredServers.length > 0" class="servers-list">
            <div
              v-for="server in filteredServers"
              :key="server.id"
              class="server-card"
              @click="selectServer(server)"
            >
              <div class="server-avatar">
                {{ server.name.charAt(0).toUpperCase() }}
              </div>
              
              <div class="server-info">
                <h3 class="server-name">
                  {{ server.name }}
                  <span v-if="isExactMatch(server.name)" class="exact-match-badge" title="Correspondance exacte au début">
                    ⭐
                  </span>
                </h3>
                <div class="server-meta">
                  <span class="meta-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s9 3.582 9 8z" />
                    </svg>
                    {{ server.channels?.length || 0 }} canal{{ (server.channels?.length || 0) > 1 ? 's' : '' }}
                  </span>
                  <span class="meta-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(server.createdAt) }}
                  </span>
                </div>
                <p v-if="server.description" class="server-description">
                  {{ server.description }}
                </p>
              </div>
              
              <button
                v-if="!isAlreadyMember(server)"
                @click.stop="joinServer(server)"
                class="join-button"
                :disabled="isJoining === server.id"
              >
                <span v-if="isJoining === server.id" class="loading-spinner"></span>
                {{ isJoining === server.id ? 'Rejoignant...' : 'Rejoindre' }}
              </button>
              
              <div v-else class="already-member-badge">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Déjà membre
              </div>
            </div>
          </div>

          <!-- Message si aucun serveur trouvé -->
          <div v-else-if="searchQuery && !isLoading" class="empty-state">
            <div class="empty-icon">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.263" />
              </svg>
            </div>
            <h3 class="empty-title">Aucun serveur trouvé</h3>
            <p class="empty-description">Essayez avec un autre nom ou créez votre propre serveur</p>
          </div>

          <!-- Message d'encouragement et section invitation -->
          <div v-if="!searchQuery" class="encouragement-section">
            <div class="empty-icon">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="empty-title">Recherchez des serveurs</h3>
            <p class="empty-description">Tapez le nom d'un serveur pour commencer votre recherche</p>
            
            <!-- Séparateur et bouton invitation -->
            <div class="invite-section">
              <div class="divider">
                <span>ou</span>
              </div>
              <button
                @click="showInviteModal = true"
                class="invite-button"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Rejoindre par invitation
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
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal d'invitation -->
    <InviteModal
      v-if="showInviteModal"
      @close="showInviteModal = false"
      @joined="handleServerJoined"
    />
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'
import InviteModal from './InviteModal.vue'

// Props et emits
const emit = defineEmits(['close', 'join'])

// Stores
const appStore = useAppStore()
const authStore = useAuthStore()

// État local
const searchQuery = ref('')
const isLoading = ref(false)
const isJoining = ref(null)
const showInviteModal = ref(false)

// Serveurs publics disponibles (exclure ceux dont l'utilisateur est déjà membre)
const publicServers = computed(() => {
  const currentUserId = authStore.currentUser?.id
  
  // Vérifier que l'utilisateur est connecté
  if (!currentUserId) {
    return []
  }
  
  const allPublicServers = appStore.servers.filter(server => server.type === 'public')
  return allPublicServers.filter(server => !server.members.includes(currentUserId))
})

// Serveurs filtrés par recherche
const filteredServers = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  return publicServers.value.filter(server => {
    // Recherche stricte : UNIQUEMENT les serveurs qui commencent par la recherche
    return server.name.toLowerCase().startsWith(query)
  }).sort((a, b) => {
    // Trier par ordre alphabétique
    return a.name.localeCompare(b.name)
  })
})

// Sélectionner un serveur
const selectServer = (server) => {
  searchQuery.value = server.name
}

// Formater la date de création
const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Aujourd\'hui'
  if (diffDays === 2) return 'Hier'
  if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`
  if (diffDays <= 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays <= 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'short' 
  })
}

// Vérifier si le serveur correspond exactement au début de la recherche
const isExactMatch = (serverName) => {
  if (!searchQuery.value.trim()) return false
  return serverName.toLowerCase().startsWith(searchQuery.value.toLowerCase().trim())
}

// Vérifier si l'utilisateur est déjà membre du serveur
const isAlreadyMember = (server) => {
  const currentUserId = authStore.currentUser?.id
  if (!currentUserId) return false
  return server.members.includes(currentUserId)
}

// Rejoindre un serveur
const joinServer = async (server) => {
  try {
    // Vérifier que l'utilisateur est connecté
    const currentUserId = authStore.currentUser?.id
    if (!currentUserId) {
      throw new Error('Vous devez être connecté pour rejoindre un serveur')
    }
    
    // Vérifier que l'utilisateur n'est pas déjà membre
    if (server.members.includes(currentUserId)) {
      throw new Error('Vous êtes déjà membre de ce serveur')
    }
    
    isJoining.value = server.id
    
    // Émettre l'événement de jointure
    await emit('join', server.id)
    
    // Réinitialiser l'état de chargement
    isJoining.value = null
    
    console.log(`Tentative de jointure au serveur ${server.name} par l'utilisateur ${currentUserId}`)
    
  } catch (error) {
    console.error('Erreur lors de la jointure:', error)
    isJoining.value = null
  }
}

// Gérer la jointure réussie via invitation
const handleServerJoined = (serverId) => {
  // Fermer le modal principal
  emit('close')
  // Émettre l'événement de jointure
  emit('join', serverId)
}

// Forcer la mise à jour au montage du composant
onMounted(() => {
  // Le composant est prêt
})


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
  max-width: 700px;
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
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  font-size: 1.5rem;
  color: #a0aec0;
  margin: 0;
}

/* Corps du modal */
.modal-body {
  padding: 40px;
}

/* Section de recherche */
.search-section {
  margin-bottom: 40px;
}

.search-label {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.search-input-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 20px 24px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 16px;
  color: white;
  font-size: 1.25rem;
  padding-right: 80px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.search-button {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: #3b82f6;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.search-button:hover {
  background: #2d3748;
  transform: translateY(-50%) scale(1.05);
}

.search-help {
  font-size: 0.875rem;
  color: #a0aec0;
  margin-top: 8px;
  font-style: italic;
  text-align: center;
}

/* Liste des serveurs */
.servers-list {
  margin-bottom: 40px;
}

.server-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.server-card:hover {
  border-color: #3b82f6;
  background: #374151;
  transform: translateY(-2px);
}

.server-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 800;
  flex-shrink: 0;
}

.server-info {
  flex: 1;
  min-width: 0;
}

.server-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.exact-match-badge {
  font-size: 1rem;
  color: #fbbf24;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.server-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a0aec0;
  font-size: 1rem;
}

.server-description {
  color: #e2e8f0;
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
}

.join-button {
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.join-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
}

.join-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.already-member-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #10b981;
  color: white;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.8;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Section d'encouragement */
.encouragement-section {
  text-align: center;
  padding: 40px 0;
}

/* Section d'invitation */
.invite-section {
  margin-top: 32px;
  text-align: center;
}

.divider {
  position: relative;
  margin: 24px 0;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #4a5568;
}

.divider span {
  background: #1a1a2e;
  padding: 0 16px;
  color: #a0aec0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.invite-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.invite-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
}

/* États vides */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #4a5568;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
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
  margin: 0;
  line-height: 1.5;
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
  
  .server-card {
    flex-direction: column;
    text-align: center;
  }
  
  .server-meta {
    justify-content: center;
  }
  
  .join-button {
    width: 100%;
  }
}
</style>
