<template>
  <div class="private-chat-overlay" @click="$emit('close')">
    <div class="private-chat-modal" @click.stop>
      <!-- Header du chat -->
      <div class="chat-header">
        <div class="chat-user-info">
          <div class="user-avatar">
            <img :src="friend.avatar || '/default-avatar.png'" :alt="friend.username" />
            <div :class="['status-indicator', friend.status === 'online' ? 'online' : 'offline']"></div>
          </div>
          <div class="user-details">
            <span class="username">{{ friend.username }}</span>
            <span class="user-status">{{ friend.status === 'online' ? 'En ligne' : 'Hors ligne' }}</span>
          </div>
        </div>
        <div class="chat-actions">
          <button @click="startVoiceCall" class="btn-voice" title="Appel vocal">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button @click="startVideoCall" class="btn-video" title="Appel vidéo">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button @click="$emit('close')" class="btn-close" title="Fermer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="no-messages">
          <div class="no-messages-icon">💬</div>
          <p>Aucun message pour le moment</p>
          <span>Commencez la conversation avec {{ friend.username }} !</span>
        </div>
        
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message', { 'own': message.senderId === currentUserId }]"
        >
          <div class="message-avatar">
            <img :src="getUserAvatar(message.senderId)" :alt="getUserName(message.senderId)" />
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-author">{{ getUserName(message.senderId) }}</span>
              <span class="message-time">{{ formatMessageTime(message.timestamp) }}</span>
            </div>
            <div class="message-text">{{ message.content }}</div>
          </div>
        </div>
      </div>

      <!-- Zone de saisie -->
      <div class="chat-input-area">
        <div class="input-wrapper">
          <textarea
            v-model="newMessage"
            @keydown.enter.prevent="sendMessage"
            placeholder="Écrivez votre message..."
            class="message-input"
            rows="1"
            ref="messageInput"
          ></textarea>
          <button @click="sendMessage" class="btn-send" :disabled="!newMessage.trim()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useFriendsStore } from '../stores/friendsStore'

// Props
const props = defineProps({
  friend: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close'])

// Stores
const authStore = useAuthStore()
const friendsStore = useFriendsStore()

// Réfs
const messagesContainer = ref(null)
const messageInput = ref(null)
const newMessage = ref('')
const messages = ref([])

// Computed
const currentUserId = computed(() => authStore.currentUser?.id)

// Méthodes
const getUserAvatar = (userId) => {
  if (userId === currentUserId.value) {
    return authStore.currentUser?.avatar || '/default-avatar.png'
  }
  return props.friend.avatar || '/default-avatar.png'
}

const getUserName = (userId) => {
  if (userId === currentUserId.value) {
    return authStore.currentUser?.username || 'Vous'
  }
  return props.friend.username
}

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  try {
    const message = {
      id: Date.now().toString(),
      content: newMessage.value.trim(),
      senderId: currentUserId.value,
      receiverId: props.friend.id,
      timestamp: new Date().toISOString()
    }
    
    // Ajouter le message localement
    messages.value.push(message)
    
    // Envoyer le message via le store
    await friendsStore.sendPrivateMessage(message)
    
    // Vider l'input
    newMessage.value = ''
    
    // Scroll vers le bas
    await nextTick()
    scrollToBottom()
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const startVoiceCall = () => {
  // Émettre un événement pour démarrer l'appel vocal
  emit('startVoiceCall', props.friend)
}

const startVideoCall = () => {
  // Émettre un événement pour démarrer l'appel vidéo
  emit('startVideoCall', props.friend)
}

// Charger les messages existants
const loadMessages = async () => {
  try {
    const chatMessages = await friendsStore.getPrivateMessages(props.friend.id)
    messages.value = chatMessages
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
  }
}

// Auto-resize du textarea
const autoResize = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
  }
}

// Surveiller les changements de message pour auto-resize
watch(newMessage, autoResize)

// Initialisation
onMounted(() => {
  loadMessages()
  // Focus sur l'input
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
})
</script>

<style scoped>
.private-chat-overlay {
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

.private-chat-modal {
  background: #36393f;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #202225;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.chat-header {
  background: #2f3136;
  padding: 16px 20px;
  border-bottom: 1px solid #202225;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
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

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.user-status {
  color: #8e9297;
  font-size: 12px;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.chat-actions button {
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

.chat-actions button:hover {
  background: #40444b;
  color: #fff;
}

.btn-voice:hover {
  color: #57f287;
}

.btn-video:hover {
  color: #5865f2;
}

.btn-close:hover {
  color: #ed4245;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.no-messages {
  text-align: center;
  padding: 60px 20px;
  color: #8e9297;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-messages-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.no-messages p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.no-messages span {
  font-size: 14px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message.own {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message.own .message-content {
  text-align: right;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message.own .message-header {
  justify-content: flex-end;
}

.message-author {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.message-time {
  color: #8e9297;
  font-size: 11px;
}

.message-text {
  color: #dcddde;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.chat-input-area {
  padding: 16px 20px;
  border-top: 1px solid #202225;
  background: #2f3136;
  border-radius: 0 0 8px 8px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  background: #40444b;
  border: 1px solid #202225;
  border-radius: 4px;
  color: #dcddde;
  padding: 12px;
  font-size: 14px;
  resize: none;
  max-height: 120px;
  min-height: 44px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.message-input:focus {
  outline: none;
  border-color: #5865f2;
}

.message-input::placeholder {
  color: #8e9297;
}

.btn-send {
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
}

.btn-send:hover:not(:disabled) {
  background: #4752c4;
}

.btn-send:disabled {
  background: #4f545c;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>



