<template>
  <div v-if="show" class="members-panel">
    <!-- En-tête du panneau -->
    <div class="panel-header">
      <h3 class="panel-title">Membres</h3>
      <button @click="closeModal" class="panel-close-btn">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Contenu du panneau -->
    <div class="panel-content">
      <!-- Statistiques du serveur -->
      <div class="server-stats">
        <div class="stat-item">
          <span class="stat-label">Total</span>
          <span class="stat-value">{{ totalMembers }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">En ligne</span>
          <span class="stat-value">{{ onlineMembers }}</span>
        </div>
      </div>

      <!-- Liste des membres par rôle -->
      <div class="members-sections">
        <!-- Owner (Créateur) -->
        <div v-if="ownerMembers.length > 0" class="member-section">
          <div class="section-header owner">
            <span class="section-title">Owner</span>
            <span class="member-count">{{ ownerMembers.length }}</span>
          </div>
          <div class="members-list">
            <div 
              v-for="member in ownerMembers" 
              :key="member.id"
              class="member-item owner clickable"
              @click="showMemberProfile(member)"
            >
              <div class="member-avatar">
                <span class="avatar-text">{{ member.username?.charAt(0).toUpperCase() || 'O' }}</span>
                <div class="status-indicator online"></div>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.username || 'Owner' }}</div>
                <div class="member-role">Owner</div>
              </div>
              <div class="owner-crown">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Administrateurs -->
        <div v-if="adminMembers.length > 0" class="member-section">
          <div class="section-header admin">
            <span class="section-title">Administrateurs</span>
            <span class="member-count">{{ adminMembers.length }}</span>
          </div>
          <div class="members-list">
            <div 
              v-for="member in adminMembers" 
              :key="member.id"
              class="member-item admin clickable"
              @click="showMemberProfile(member)"
            >
              <div class="member-avatar">
                <span class="avatar-text">{{ member.username?.charAt(0).toUpperCase() || 'A' }}</span>
                <div class="status-indicator online"></div>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.username || 'Admin' }}</div>
                <div class="member-role">Administrateur</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modérateurs -->
        <div v-if="moderatorMembers.length > 0" class="member-section">
          <div class="section-header moderator">
            <span class="section-title">Modérateurs</span>
            <span class="member-count">{{ moderatorMembers.length }}</span>
          </div>
          <div class="members-list">
            <div 
              v-for="member in moderatorMembers" 
              :key="member.id"
              class="member-item moderator clickable"
              @click="showMemberProfile(member)"
            >
              <div class="member-avatar">
                <span class="avatar-text">{{ member.username?.charAt(0).toUpperCase() || 'M' }}</span>
                <div class="status-indicator online"></div>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.username || 'Modérateur' }}</div>
                <div class="member-role">Modérateur</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Membres normaux -->
        <div v-if="regularMembers.length > 0" class="member-section">
          <div class="section-header member">
            <span class="section-title">Membres</span>
            <span class="member-count">{{ regularMembers.length }}</span>
          </div>
          <div class="members-list">
            <div 
              v-for="member in regularMembers" 
              :key="member.id"
              class="member-item regular clickable"
              @click="showMemberProfile(member)"
            >
              <div class="member-avatar">
                <span class="avatar-text">{{ member.username?.charAt(0).toUpperCase() || 'U' }}</span>
                <div class="status-indicator online"></div>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.username || 'Utilisateur' }}</div>
                <div class="member-role">Membre</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucun membre -->
        <div v-if="totalMembers === 0" class="empty-state">
          <div class="empty-icon">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="empty-title">Aucun membre</h3>
          <p class="empty-description">Ce serveur n'a pas encore de membres</p>
        </div>
      </div>
    </div>

    <!-- Modal du profil du membre -->
    <div v-if="selectedMember" class="member-profile-modal" @click="closeMemberProfile">
      <div class="profile-content" @click.stop>
        <div class="profile-header">
          <div class="profile-avatar">
            <span class="avatar-text">{{ selectedMember.username?.charAt(0).toUpperCase() || 'U' }}</span>
            <div class="status-indicator online"></div>
          </div>
          <div class="profile-info">
            <div class="profile-name">{{ selectedMember.username || 'Utilisateur' }}</div>
            <div class="profile-role">{{ getRoleDisplayName(selectedMember.role) }}</div>
          </div>
          <button @click="closeMemberProfile" class="profile-close-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="profile-body">
          <div class="profile-section">
            <h4 class="section-title">Informations</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nom d'utilisateur</span>
                <span class="info-value">{{ selectedMember.username || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tag</span>
                <span class="info-value">#{{ selectedMember.tag || '0000' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Rôle</span>
                <span class="info-value">{{ getRoleDisplayName(selectedMember.role) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Membre depuis</span>
                <span class="info-value">{{ formatDate(selectedMember.createdAt) }}</span>
              </div>
            </div>
          </div>
          
          <div class="profile-section">
            <h4 class="section-title">Actions</h4>
            <div class="action-buttons">
              <button class="action-btn primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message privé
              </button>
              <button class="action-btn secondary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Ajouter aux amis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentServer: {
    type: Object,
    default: null
  }
})

// Émettre les événements
const emit = defineEmits(['close'])

// Store
const authStore = useAuthStore()

// État local
const selectedMember = ref(null)

// Computed properties
const totalMembers = computed(() => {
  console.log('🔍 MembersModal - currentServer:', props.currentServer)
  console.log('🔍 MembersModal - members:', props.currentServer?.members)
  console.log('🔍 MembersModal - members length:', props.currentServer?.members?.length)
  if (!props.currentServer?.members) return 0
  return props.currentServer.members.length
})

const onlineMembers = computed(() => {
  if (!props.currentServer?.members) return 0
  return props.currentServer.members.length
})

const ownerMembers = computed(() => {
  console.log('🔍 MembersModal - ownerMembers computation')
  if (!props.currentServer?.members) {
    console.log('❌ No members array found')
    return []
  }
  console.log('🔍 Members array:', props.currentServer.members)
  
  const members = props.currentServer.members
    .map(memberId => {
      const user = authStore.getUserById(memberId)
      console.log(`🔍 Owner Member ID ${memberId}:`, user)
      console.log(`🔍 User role:`, user?.role)
      console.log(`🔍 User properties:`, Object.keys(user || {}))
      return user
    })
    .filter(member => {
      console.log(`🔍 Filtering member:`, member)
      console.log(`🔍 Member role:`, member?.role)
      console.log(`🔍 Is owner?`, member && member.role === 'owner')
      return member && member.role === 'owner'
    })
  console.log('🔍 Owner members found:', members)
  return members
})

const adminMembers = computed(() => {
  console.log('🔍 MembersModal - adminMembers computation')
  if (!props.currentServer?.members) return []
  const members = props.currentServer.members
    .map(memberId => {
      const user = authStore.getUserById(memberId)
      console.log(`🔍 Admin Member ID ${memberId}:`, user)
      return user
    })
    .filter(member => member && member.role === 'admin')
  console.log('🔍 Admin members found:', members)
  return members
})

const moderatorMembers = computed(() => {
  if (!props.currentServer?.members) return []
  return props.currentServer.members
    .map(memberId => authStore.getUserById(memberId))
    .filter(member => member && member.role === 'moderator')
})

const regularMembers = computed(() => {
  if (!props.currentServer?.members) return []
  return props.currentServer.members
    .map(memberId => authStore.getUserById(memberId))
    .filter(member => member && member.role === 'user')
})

// Méthodes
const closeModal = () => {
  emit('close')
}

const showMemberProfile = (member) => {
  selectedMember.value = member
}

const closeMemberProfile = () => {
  selectedMember.value = null
}

const getRoleDisplayName = (role) => {
  switch (role) {
    case 'admin': return 'Administrateur'
    case 'moderator': return 'Modérateur'
    case 'user': return 'Membre'
    case 'owner': return 'Owner'
    default: return 'Membre'
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.members-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: rgba(17, 24, 39, 0.98);
  border-left: 1px solid rgba(236, 72, 153, 0.3);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(236, 72, 153, 0.1);
  border-bottom: 1px solid rgba(236, 72, 153, 0.2);
}

.panel-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.panel-close-btn {
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
}

.panel-close-btn:hover {
  background: rgba(236, 72, 153, 0.3);
  border-color: rgba(236, 72, 153, 0.5);
  color: rgba(236, 72, 153, 1);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Statistiques du serveur */
.server-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  min-width: 80px;
}

.stat-label {
  color: rgba(236, 72, 153, 0.7);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: white;
  font-size: 20px;
  font-weight: 700;
}

/* Sections des membres */
.members-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-header.owner {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

.section-header.admin {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.section-header.moderator {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.section-header.member {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.section-title {
  flex: 1;
}

.member-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
}

/* Liste des membres */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  position: relative;
}

.member-item.clickable {
  cursor: pointer;
}

.member-item.clickable:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(-2px);
}

.member-item.owner {
  border-left: 2px solid #facc15;
}

.member-item.admin {
  border-left: 2px solid #ef4444;
}

.member-item.moderator {
  border-left: 2px solid #3b82f6;
}

.member-item.regular {
  border-left: 2px solid #10b981;
}

.member-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
}

.owner-crown {
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  background: rgba(250, 204, 21, 0.2);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

.owner-crown svg {
  width: 12px;
  height: 12px;
  color: #facc15;
}

.status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid rgba(17, 24, 39, 0.9);
  animation: pulse 2s ease-in-out infinite;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  color: white;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 2px;
}

.member-role {
  color: rgba(236, 72, 153, 0.7);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 30px 20px;
}

.empty-icon {
  color: rgba(236, 72, 153, 0.5);
  margin-bottom: 12px;
}

.empty-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.empty-description {
  color: rgba(236, 72, 153, 0.7);
  font-size: 12px;
}

/* Modal du profil du membre */
.member-profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(8px);
}

.profile-content {
  width: 400px;
  max-height: 80vh;
  background: rgba(17, 24, 39, 0.98);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(236, 72, 153, 0.1);
  border-bottom: 1px solid rgba(236, 72, 153, 0.2);
}

.profile-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
}

.profile-avatar .status-indicator {
  width: 12px;
  height: 12px;
  bottom: -3px;
  right: -3px;
}

.profile-info {
  flex: 1;
}

.profile-name {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.profile-role {
  color: rgba(236, 72, 153, 0.8);
  font-size: 14px;
  font-weight: 500;
}

.profile-close-btn {
  width: 32px;
  height: 32px;
  background: rgba(236, 72, 153, 0.2);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(236, 72, 153, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-close-btn:hover {
  background: rgba(236, 72, 153, 0.3);
  border-color: rgba(236, 72, 153, 0.5);
  color: rgba(236, 72, 153, 1);
}

.profile-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.profile-section {
  margin-bottom: 24px;
}

.profile-section .section-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  color: rgba(236, 72, 153, 0.7);
  font-size: 13px;
  font-weight: 500;
}

.info-value {
  color: white;
  font-size: 13px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: rgba(236, 72, 153, 0.8);
  color: white;
}

.action-btn.primary:hover {
  background: rgba(236, 72, 153, 1);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
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
