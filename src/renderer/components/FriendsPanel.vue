<template>
  <div class="friends-panel">
    <!-- Header des amis -->
    <div class="friends-header">
      <h3 class="friends-title">{{ tLocal('friends.title') }}</h3>
      <button @click="showAddFriend = true" class="btn-add-friend">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ tLocal('friends.addFriend') }}
      </button>
    </div>

    <!-- Onglets -->
    <div class="friends-tabs">
      <button 
        @click="activeTab = 'online'"
        :class="['tab-btn', { 'active': activeTab === 'online' }]"
      >
        {{ tLocal('friends.online') }} ({{ onlineFriends.length }})
      </button>
      <button 
        @click="activeTab = 'all'"
        :class="['tab-btn', { 'active': activeTab === 'all' }]"
      >
        {{ tLocal('friends.all') }} ({{ allFriends.length }})
      </button>
      <button 
        @click="activeTab = 'pending'"
        :class="['tab-btn', { 'active': activeTab === 'pending' }]"
      >
        {{ tLocal('friends.pending') }} ({{ pendingRequests.length }})
      </button>
    </div>

    <!-- Liste des amis -->
    <div class="friends-list">
      <!-- Amis en ligne -->
      <div v-if="activeTab === 'online'" class="friends-section">
        <div v-if="onlineFriends.length === 0" class="no-friends">
          <p>{{ tLocal('friends.noFriendsOnline') }}</p>
        </div>
        <div 
          v-for="friend in onlineFriends" 
          :key="friend.id"
          class="friend-item"
          @click="selectFriend(friend)"
        >
          <div class="friend-avatar">
            <img :src="friend.avatar || '/default-avatar.png'" :alt="friend.username" />
            <div class="status-indicator online"></div>
          </div>
          <div class="friend-info">
            <span class="friend-name">{{ friend.username }}</span>
            <span class="friend-status">{{ friend.status || tLocal('friends.online') }}</span>
          </div>
          <div class="friend-actions">
            <button @click.stop="startPrivateCall(friend)" class="btn-call" :title="tLocal('friends.call')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Tous les amis -->
      <div v-if="activeTab === 'all'" class="friends-section">
        <div v-if="allFriends.length === 0" class="no-friends">
          <p>{{ tLocal('friends.noFriends') }}</p>
        </div>
        <div 
          v-for="friend in allFriends" 
          :key="friend.id"
          class="friend-item"
          @click="selectFriend(friend)"
        >
          <div class="friend-avatar">
            <img :src="friend.avatar || '/default-avatar.png'" :alt="friend.username" />
            <div :class="['status-indicator', friend.status === 'online' ? 'online' : 'offline']"></div>
          </div>
          <div class="friend-info">
            <span class="friend-name">{{ friend.username }}</span>
            <span class="friend-status">{{ friend.status === 'online' ? tLocal('friends.online') : tLocal('friends.offline') }}</span>
          </div>
          <div class="friend-actions">
            <button @click.stop="removeFriend(friend)" class="btn-remove" :title="tLocal('friends.remove')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Demandes d'amis en attente -->
      <div v-if="activeTab === 'pending'" class="friends-section">
        <div v-if="pendingRequests.length === 0" class="no-friends">
          <p>{{ tLocal('friends.noPendingRequests') }}</p>
        </div>
        <div 
          v-for="request in pendingRequests" 
          :key="request.id"
          class="friend-item pending"
        >
          <div class="friend-avatar">
            <img :src="request.avatar || '/default-avatar.png'" :alt="request.username" />
            <div class="status-indicator pending"></div>
          </div>
          <div class="friend-info">
            <span class="friend-name">{{ request.username }}</span>
            <span class="friend-status">{{ tLocal('friends.friendRequest') }}</span>
          </div>
          <div class="friend-actions">
            <button @click="acceptFriendRequest(request)" class="btn-accept" :title="tLocal('friends.accept')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button @click="rejectFriendRequest(request)" class="btn-reject" :title="tLocal('friends.reject')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout d'ami -->
    <div v-if="showAddFriend" class="modal-overlay" @click="showAddFriend = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ tLocal('friends.addFriend') }}</h3>
          <button @click="showAddFriend = false" class="modal-close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ tLocal('friends.username') }}</label>
            <input 
              v-model="newFriendUsername" 
              type="text" 
              :placeholder="tLocal('friends.username')"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>{{ tLocal('friends.tag') }}</label>
            <input 
              v-model="newFriendTag" 
              type="text" 
              :placeholder="tLocal('friends.tag')"
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddFriend = false" class="btn-secondary">
            {{ tLocal('friends.cancel') }}
          </button>
          <button @click="addFriend" class="btn-primary" :disabled="!newFriendUsername.trim()">
            {{ tLocal('friends.addFriend') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Chat privé -->
    <PrivateChat 
      v-if="selectedFriend && showPrivateChat"
      :friend="selectedFriend"
      @close="closePrivateChat"
    />

    <!-- Appel privé -->
    <PrivateCall 
      v-if="selectedFriend && showPrivateCall"
      :friend="selectedFriend"
      :call-type="callType"
      @close="closePrivateCall"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'
import { useFriendsStore } from '../stores/friendsStore'
import { useI18n } from '../i18n'
import PrivateChat from './PrivateChat.vue'
import PrivateCall from './PrivateCall.vue'

// Stores
const authStore = useAuthStore()
const appStore = useAppStore()
const friendsStore = useFriendsStore()

// Internationalisation
const { t } = useI18n()

// Fonction de traduction locale qui utilise la langue du store
const tLocal = (key) => {
  const lang = appStore.settings.language || 'fr'
  return t(key, lang)
}

// État local
const activeTab = ref('online')
const showAddFriend = ref(false)
const newFriendUsername = ref('')
const newFriendTag = ref('')
const selectedFriend = ref(null)
const callingFriend = ref(null)
const showPrivateChat = ref(false)
const showPrivateCall = ref(false)
const callType = ref('audio') // 'audio' or 'video'

// Computed
const onlineFriends = computed(() => 
  friendsStore.friends.filter(friend => friend.status === 'online')
)

const allFriends = computed(() => friendsStore.friends)

const pendingRequests = computed(() => friendsStore.pendingRequests)

// Méthodes
const selectFriend = (friend) => {
  selectedFriend.value = friend
  showPrivateChat.value = true
  showPrivateCall.value = false
}

const startPrivateCall = (friend) => {
  selectedFriend.value = friend
  showPrivateChat.value = false
  showPrivateCall.value = true
  callType.value = 'audio' // Default to audio
}

const addFriend = async () => {
  if (!newFriendUsername.value.trim()) return
  
  try {
    await friendsStore.sendFriendRequest(newFriendUsername.value.trim(), newFriendTag.value.trim())
    newFriendUsername.value = ''
    newFriendTag.value = ''
    showAddFriend.value = false
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande d\'ami:', error)
  }
}

const acceptFriendRequest = async (request) => {
  try {
    await friendsStore.acceptFriendRequest(request.id)
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande:', error)
  }
}

const rejectFriendRequest = async (request) => {
  try {
    await friendsStore.rejectFriendRequest(request.id)
  } catch (error) {
    console.error('Erreur lors du refus de la demande:', error)
  }
}

const removeFriend = async (friend) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${friend.username} de vos amis ?`)) {
    try {
      await friendsStore.removeFriend(friend.id)
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ami:', error)
    }
  }
}

const closePrivateChat = () => {
  showPrivateChat.value = false
  selectedFriend.value = null
}

const closePrivateCall = () => {
  showPrivateCall.value = false
  selectedFriend.value = null
}

// Initialisation
onMounted(() => {
  friendsStore.loadFriends()
  friendsStore.loadPendingRequests()
})
</script>

<style scoped>
.friends-panel {
  background: #2f3136;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.friends-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-add-friend {
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-add-friend:hover {
  background: #4752c4;
}

.friends-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 20px;
  background: #202225;
  border-radius: 4px;
  padding: 2px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #b9bbbe;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  flex: 1;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  background: #5865f2;
  color: #fff;
}

.friends-list {
  flex: 1;
  overflow-y: auto;
}

.friends-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.no-friends {
  text-align: center;
  padding: 40px 20px;
  color: #8e9297;
}

.no-friends p {
  margin: 0;
  font-size: 14px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.friend-item:hover {
  background: #40444b;
}

.friend-item.pending {
  opacity: 0.8;
}

.friend-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #2f3136;
}

.status-indicator.online {
  background: #57f287;
}

.status-indicator.offline {
  background: #747f8d;
}

.status-indicator.pending {
  background: #f2c94c; /* Yellow for pending */
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  display: block;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-status {
  display: block;
  color: #8e9297;
  font-size: 12px;
}

.friend-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.friend-actions button {
  background: transparent;
  border: none;
  color: #b9bbbe;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.friend-actions button:hover {
  background: #40444b;
  color: #fff;
}

.btn-call:hover {
  color: #57f287;
}

.btn-remove:hover {
  color: #ed4245;
}

.btn-accept:hover {
  color: #57f287;
}

.btn-reject:hover {
  color: #ed4245;
}

/* Modal */
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
  background: #36393f;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  border: 1px solid #202225;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.modal-header {
  background: #2f3136;
  padding: 16px 20px;
  border-bottom: 1px solid #202225;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.modal-header h3 {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: #b9bbbe;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #4f545c;
  color: #fff;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  background: #40444b;
  border: 1px solid #202225;
  border-radius: 4px;
  color: #dcddde;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #5865f2;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #202225;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-primary {
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #4752c4;
}

.btn-secondary {
  background: #4f545c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #5d6269;
}
</style>
