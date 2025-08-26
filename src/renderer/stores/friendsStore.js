import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFriendsStore = defineStore('friends', () => {
  // État
  const friends = ref([])
  const pendingRequests = ref([])
  const privateMessages = ref({}) // { friendId: [messages] }
  const activeCalls = ref({}) // { friendId: callData }
  const onlineStatus = ref({}) // { userId: status }

  // Getters
  const onlineFriends = computed(() => 
    friends.value.filter(friend => friend.status === 'online')
  )

  const offlineFriends = computed(() => 
    friends.value.filter(friend => friend.status === 'offline')
  )

  const getFriendById = computed(() => (id) => 
    friends.value.find(friend => friend.id === id)
  )

  const getPendingRequestById = computed(() => (id) => 
    pendingRequests.value.find(request => request.id === id)
  )

  // Actions pour la gestion des amis
  const loadFriends = async () => {
    try {
      // Simuler le chargement des amis depuis une API
      const mockFriends = [
        {
          id: '1',
          username: 'Alex',
          avatar: null,
          status: 'online',
          lastSeen: new Date().toISOString()
        },
        {
          id: '2',
          username: 'Sarah',
          avatar: null,
          status: 'offline',
          lastSeen: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          username: 'Mike',
          avatar: null,
          status: 'online',
          lastSeen: new Date().toISOString()
        }
      ]
      
      friends.value = mockFriends
      console.log('Amis chargés:', friends.value)
    } catch (error) {
      console.error('Erreur lors du chargement des amis:', error)
    }
  }

  const loadPendingRequests = async () => {
    try {
      // Simuler le chargement des demandes en attente
      const mockRequests = [
        {
          id: 'req1',
          username: 'Emma',
          avatar: null,
          timestamp: new Date().toISOString()
        }
      ]
      
      pendingRequests.value = mockRequests
      console.log('Demandes en attente chargées:', pendingRequests.value)
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error)
    }
  }

  const sendFriendRequest = async (usernameOrEmail) => {
    try {
      // Simuler l'envoi d'une demande d'ami
      console.log('Demande d\'ami envoyée à:', usernameOrEmail)
      
      // Ici, vous feriez un appel API réel
      // const response = await api.post('/friends/request', { usernameOrEmail })
      
      return { success: true, message: 'Demande d\'ami envoyée avec succès' }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error)
      throw error
    }
  }

  const acceptFriendRequest = async (requestId) => {
    try {
      const request = pendingRequests.value.find(req => req.id === requestId)
      if (!request) {
        throw new Error('Demande non trouvée')
      }

      // Ajouter l'ami à la liste
      const newFriend = {
        id: requestId,
        username: request.username,
        avatar: request.avatar,
        status: 'online',
        lastSeen: new Date().toISOString()
      }
      
      friends.value.push(newFriend)
      
      // Supprimer la demande
      pendingRequests.value = pendingRequests.value.filter(req => req.id !== requestId)
      
      console.log('Demande d\'ami acceptée:', newFriend)
      return { success: true, message: 'Ami ajouté avec succès' }
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error)
      throw error
    }
  }

  const rejectFriendRequest = async (requestId) => {
    try {
      // Supprimer la demande
      pendingRequests.value = pendingRequests.value.filter(req => req.id !== requestId)
      
      console.log('Demande d\'ami refusée:', requestId)
      return { success: true, message: 'Demande refusée' }
    } catch (error) {
      console.error('Erreur lors du refus de la demande:', error)
      throw error
    }
  }

  const removeFriend = async (friendId) => {
    try {
      // Supprimer l'ami de la liste
      friends.value = friends.value.filter(friend => friend.id !== friendId)
      
      // Supprimer les messages privés
      if (privateMessages.value[friendId]) {
        delete privateMessages.value[friendId]
      }
      
      console.log('Ami supprimé:', friendId)
      return { success: true, message: 'Ami supprimé avec succès' }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ami:', error)
      throw error
    }
  }

  // Actions pour les messages privés
  const getPrivateMessages = async (friendId) => {
    try {
      // Retourner les messages existants ou un tableau vide
      return privateMessages.value[friendId] || []
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error)
      return []
    }
  }

  const sendPrivateMessage = async (message) => {
    try {
      const { receiverId } = message
      
      // Initialiser le tableau de messages si nécessaire
      if (!privateMessages.value[receiverId]) {
        privateMessages.value[receiverId] = []
      }
      
      // Ajouter le message
      privateMessages.value[receiverId].push(message)
      
      // Ici, vous feriez un appel API réel pour sauvegarder le message
      // await api.post('/messages/private', message)
      
      console.log('Message privé envoyé:', message)
      return { success: true, message: 'Message envoyé avec succès' }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      throw error
    }
  }

  // Actions pour les appels
  const initiateCall = async (friendId, callType = 'voice') => {
    try {
      const callData = {
        id: Date.now().toString(),
        friendId,
        type: callType,
        status: 'connecting',
        startTime: new Date().toISOString(),
        isMuted: false,
        isDeafened: false
      }
      
      activeCalls.value[friendId] = callData
      
      // Ici, vous feriez un appel API réel pour initier l'appel
      // await api.post('/calls/initiate', { friendId, callType })
      
      console.log('Appel initié:', callData)
      return callData
    } catch (error) {
      console.error('Erreur lors de l\'initiation de l\'appel:', error)
      throw error
    }
  }

  const acceptCall = async (friendId, callType) => {
    try {
      const callData = {
        id: Date.now().toString(),
        friendId,
        type: callType,
        status: 'connected',
        startTime: new Date().toISOString(),
        isMuted: false,
        isDeafened: false
      }
      
      activeCalls.value[friendId] = callData
      
      // Ici, vous feriez un appel API réel pour accepter l'appel
      // await api.post('/calls/accept', { friendId, callType })
      
      console.log('Appel accepté:', callData)
      return callData
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de l\'appel:', error)
      throw error
    }
  }

  const rejectCall = async (friendId) => {
    try {
      // Ici, vous feriez un appel API réel pour refuser l'appel
      // await api.post('/calls/reject', { friendId })
      
      console.log('Appel refusé:', friendId)
      return { success: true, message: 'Appel refusé' }
    } catch (error) {
      console.error('Erreur lors du refus de l\'appel:', error)
      throw error
    }
  }

  const cancelCall = async (friendId) => {
    try {
      // Ici, vous feriez un appel API réel pour annuler l'appel
      // await api.post('/calls/cancel', { friendId })
      
      // Supprimer l'appel actif
      if (activeCalls.value[friendId]) {
        delete activeCalls.value[friendId]
      }
      
      console.log('Appel annulé:', friendId)
      return { success: true, message: 'Appel annulé' }
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'appel:', error)
      throw error
    }
  }

  const endCall = async (friendId) => {
    try {
      // Ici, vous feriez un appel API réel pour terminer l'appel
      // await api.post('/calls/end', { friendId })
      
      // Supprimer l'appel actif
      if (activeCalls.value[friendId]) {
        delete activeCalls.value[friendId]
      }
      
      console.log('Appel terminé:', friendId)
      return { success: true, message: 'Appel terminé' }
    } catch (error) {
      console.error('Erreur lors de la fin de l\'appel:', error)
      throw error
    }
  }

  // Actions pour les contrôles audio
  const toggleMicrophone = (isMuted) => {
    try {
      // Ici, vous implémenteriez la logique pour couper/activer le micro
      console.log('Microphone:', isMuted ? 'coupé' : 'activé')
      
      // Mettre à jour l'état de tous les appels actifs
      Object.values(activeCalls.value).forEach(call => {
        call.isMuted = isMuted
      })
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors du changement d\'état du microphone:', error)
      throw error
    }
  }

  const toggleSpeaker = (isDeafened) => {
    try {
      // Ici, vous implémenteriez la logique pour couper/activer le haut-parleur
      console.log('Haut-parleur:', isDeafened ? 'coupé' : 'activé')
      
      // Mettre à jour l'état de tous les appels actifs
      Object.values(activeCalls.value).forEach(call => {
        call.isDeafened = isDeafened
      })
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors du changement d\'état du haut-parleur:', error)
      throw error
    }
  }

  // Actions pour la gestion du statut en ligne
  const updateOnlineStatus = (userId, status) => {
    onlineStatus.value[userId] = status
    
    // Mettre à jour le statut de l'ami correspondant
    const friend = friends.value.find(f => f.id === userId)
    if (friend) {
      friend.status = status
      friend.lastSeen = new Date().toISOString()
    }
  }

  const setUserOnline = (userId) => {
    updateOnlineStatus(userId, 'online')
  }

  const setUserOffline = (userId) => {
    updateOnlineStatus(userId, 'offline')
  }

  // Actions utilitaires
  const clearAllData = () => {
    friends.value = []
    pendingRequests.value = []
    privateMessages.value = {}
    activeCalls.value = {}
    onlineStatus.value = {}
  }

  const getActiveCall = (friendId) => {
    return activeCalls.value[friendId] || null
  }

  const hasActiveCall = (friendId) => {
    return !!activeCalls.value[friendId]
  }

  return {
    // État
    friends,
    pendingRequests,
    privateMessages,
    activeCalls,
    onlineStatus,
    
    // Getters
    onlineFriends,
    offlineFriends,
    getFriendById,
    getPendingRequestById,
    
    // Actions pour les amis
    loadFriends,
    loadPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    
    // Actions pour les messages
    getPrivateMessages,
    sendPrivateMessage,
    
    // Actions pour les appels
    initiateCall,
    acceptCall,
    rejectCall,
    cancelCall,
    endCall,
    
    // Actions pour les contrôles audio
    toggleMicrophone,
    toggleSpeaker,
    
    // Actions pour le statut en ligne
    updateOnlineStatus,
    setUserOnline,
    setUserOffline,
    
    // Actions utilitaires
    clearAllData,
    getActiveCall,
    hasActiveCall
  }
})



