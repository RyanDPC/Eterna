import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

export const useAppStore = defineStore('app', () => {
  // Helper pour obtenir le store auth
  const getAuthStore = () => useAuthStore()
  
  // État
  const theme = ref('dark')
  const currentServer = ref(null)
  const currentChannel = ref(null)
  const servers = ref([])
  const channels = ref([])
  const messages = ref([])
  const modals = ref({
    settings: false,
    createServer: false
  })
  
  // État du statut vocal
  const voiceStatus = ref({
    isConnected: false,
    currentVoiceChannel: null,
    isMuted: false,
    isDeafened: false,
    isSpeaking: false
  })

  // Informations de mise à jour
  const updateInfo = ref(null)

  // Participants connectés au canal vocal actuel
  const voiceParticipants = ref(new Map())

  // Ajouter un participant au canal vocal
  const addVoiceParticipant = (userId, userData) => {
    if (voiceStatus.value.isConnected && voiceStatus.value.currentVoiceChannel) {
      voiceParticipants.value.set(userId, {
        ...userData,
        isMuted: false,
        isDeafened: false,
        isSpeaking: false,
        joinedAt: new Date()
      })
      console.log(`Participant vocal ajouté: ${userData.username || userId}`)
    }
  }

  // Retirer un participant du canal vocal
  const removeVoiceParticipant = (userId) => {
    if (voiceParticipants.value.has(userId)) {
      const participant = voiceParticipants.value.get(userId)
      voiceParticipants.value.delete(userId)
      console.log(`Participant vocal retiré: ${participant.username || userId}`)
    }
  }

  // Mettre à jour le statut d'un participant
  const updateVoiceParticipantStatus = (userId, updates) => {
    if (voiceParticipants.value.has(userId)) {
      const participant = voiceParticipants.value.get(userId)
      Object.assign(participant, updates)
      voiceParticipants.value.set(userId, participant)
    }
  }

  // Obtenir la liste des participants
  const getVoiceParticipants = () => {
    return Array.from(voiceParticipants.value.values())
  }

  // Getters
  const isDarkMode = computed(() => theme.value === 'dark')
  const currentServerChannels = computed(() => {
    if (!currentServer.value) return []
    return channels.value.filter(channel => channel.serverId === currentServer.value.id)
  })

  const currentChannelMessages = computed(() => {
    if (!currentChannel.value) return []
    return messages.value.filter(message => message.channelId === currentChannel.value.id)
  })

  // Actions
  // 🎨 THÈME DE BASE UNIQUE - Plus de gestion des thèmes sombre/clair
  // Les fonctions toggleTheme et updateTheme ont été supprimées car obsolètes
  
  // Gestion des mises à jour
  const setUpdateAvailable = (info) => {
    updateInfo.value = info
  }

  const clearUpdateInfo = () => {
    updateInfo.value = null
  }

  const setCurrentServer = (server) => {
    currentServer.value = server
    // Sélectionner automatiquement le premier canal
    if (server && server.channels && server.channels.length > 0) {
      setCurrentChannel(server.channels[0])
    }
  }

  const setCurrentChannel = (channel) => {
    currentChannel.value = channel
  }

  // Gestion des serveurs
  const createServer = async (serverData) => {
    // Trouver l'utilisateur qui crée le serveur
    const creator = getAuthStore().users.find(u => u.id === serverData.ownerId)
    
    // Promouvoir le créateur en owner s'il ne l'est pas déjà
    if (creator && creator.role !== 'owner') {
      console.log(`👑 Promotion automatique de ${creator.username} en owner (créateur de serveur)`)
      creator.role = 'owner'
      creator.permissions = ['voice:control:own', 'server:manage', 'user:manage']
    }
    
    // Vérifier la limite de 5 serveurs par utilisateur
    const userServers = servers.value.filter(server => server.ownerId === serverData.ownerId)
    if (userServers.length >= 5) {
      throw new Error('Vous avez atteint la limite de 5 serveurs maximum')
    }

    const serverId = Date.now().toString()
    
    // Générer un lien d'invitation unique
    const inviteLink = generateInviteLink()
    
    // Créer le serveur avec canaux de base
    const newServer = {
      id: serverId,
      ...serverData,
      inviteLink,
      createdAt: new Date().toISOString(),
      channels: [
        {
          id: serverId + '_general',
          name: 'général',
          type: 'text',
          serverId: serverId,
          isLinked: false,
          linkedVoiceId: null
        }
      ],
      members: [serverData.ownerId]
    }

    servers.value.push(newServer)
    
    // Ajouter les canaux du serveur
    newServer.channels.forEach(channel => {
      channels.value.push(channel)
    })

    // Sauvegarder en localStorage ET en fichier
    saveToStorage()
    saveToFile()
    
    return newServer
  }

  // Gestion des canaux vocaux et CTL
  const createVoiceChannel = async (serverId, voiceChannelData) => {
    const server = servers.value.find(s => s.id === serverId)
    if (!server) {
      throw new Error('Serveur non trouvé')
    }

    const voiceChannelId = Date.now().toString() + '_voice'
    const textChannelId = Date.now().toString() + '_text'

    // Créer le canal vocal
    const voiceChannel = {
      id: voiceChannelId,
      name: voiceChannelData.name,
      type: 'voice',
      serverId: serverId
    }

    // Créer le CTL lié
    const linkedTextChannel = {
      id: textChannelId,
      name: `${voiceChannelData.name} — discussion`,
      type: 'text',
      serverId: serverId,
      isLinked: true,
      linkedVoiceId: voiceChannelId
    }

    // Ajouter les canaux au serveur
    server.channels.push(voiceChannel, linkedTextChannel)
    
    // Ajouter aux listes globales
    channels.value.push(voiceChannel, linkedTextChannel)

    // Sauvegarder
    saveToStorage()
    saveToFile()
    
    return { voiceChannel, linkedTextChannel }
  }

  const deleteVoiceChannel = async (voiceChannelId) => {
    // Trouver le canal vocal et son CTL
    const voiceChannel = channels.value.find(c => c.id === voiceChannelId && c.type === 'voice')
    const linkedTextChannel = channels.value.find(c => c.linkedVoiceId === voiceChannelId && c.isLinked)

    if (voiceChannel) {
      // Supprimer du serveur
      const server = servers.value.find(s => s.id === voiceChannel.serverId)
      if (server) {
        server.channels = server.channels.filter(c => c.id !== voiceChannelId && c.id !== linkedTextChannel?.id)
      }

      // Supprimer des listes globales
      channels.value = channels.value.filter(c => c.id !== voiceChannelId && c.id !== linkedTextChannel?.id)

      // Sauvegarder
      saveToStorage()
      saveToFile()
    }
  }

  const renameVoiceChannel = async (voiceChannelId, newName) => {
    const voiceChannel = channels.value.find(c => c.id === voiceChannelId && c.type === 'voice')
    const linkedTextChannel = channels.value.find(c => c.linkedVoiceId === voiceChannelId && c.isLinked)

    if (voiceChannel) {
      voiceChannel.name = newName
      if (linkedTextChannel) {
        linkedTextChannel.name = `${newName} — discussion`
      }

      // Sauvegarder
      saveToStorage()
      saveToFile()
    }
  }

  // Gestion du statut vocal
  const connectToVoiceChannel = (voiceChannel) => {
    voiceStatus.value.isConnected = true
    voiceStatus.value.currentVoiceChannel = voiceChannel
    voiceStatus.value.isMuted = false
    voiceStatus.value.isDeafened = false
    voiceStatus.value.isSpeaking = false
  }

  const disconnectFromVoiceChannel = (userId = null) => {
    // Vérifier que l'utilisateur se déconnecte lui-même ou a les permissions d'admin
    if (!userId || userId === getAuthStore().currentUser?.id || getAuthStore().currentUser?.role === 'admin') {
      voiceStatus.value.isConnected = false
      voiceStatus.value.currentVoiceChannel = null
      voiceStatus.value.isMuted = false
      voiceStatus.value.isDeafened = false
      voiceStatus.value.isSpeaking = false
      console.log(`Déconnexion du canal vocal par l'utilisateur ${userId || 'lui-même'}`)
    } else {
      console.warn(`Tentative non autorisée de déconnexion par l'utilisateur ${getAuthStore().currentUser?.id} sur l'utilisateur ${userId}`)
    }
  }

  const toggleMute = (userId = null) => {
    // Vérifier que l'utilisateur contrôle son propre statut ou a les permissions d'admin
    if (!userId || userId === getAuthStore().currentUser?.id || getAuthStore().currentUser?.role === 'admin') {
      voiceStatus.value.isMuted = !voiceStatus.value.isMuted
      console.log(`Micro ${voiceStatus.value.isMuted ? 'coupé' : 'activé'} par l'utilisateur ${userId || 'lui-même'}`)
    } else {
      console.warn(`Tentative non autorisée de contrôle du micro par l'utilisateur ${getAuthStore().currentUser?.id} sur l'utilisateur ${userId}`)
    }
  }

  const toggleDeafen = (userId = null) => {
    // Vérifier que l'utilisateur contrôle son propre statut ou a les permissions d'admin
    if (!userId || userId === getAuthStore().currentUser?.id || getAuthStore().currentUser?.role === 'admin') {
      voiceStatus.value.isDeafened = !voiceStatus.value.isDeafened
      console.log(`Son ${voiceStatus.value.isDeafened ? 'coupé' : 'activé'} par l'utilisateur ${userId || 'lui-même'}`)
    } else {
      console.warn(`Tentative non autorisée de contrôle du son par l'utilisateur ${getAuthStore().currentUser?.id} sur l'utilisateur ${userId}`)
    }
  }

  const setSpeaking = (speaking) => {
    voiceStatus.value.isSpeaking = speaking
  }

  // Fonctions sécurisées pour les administrateurs
  const adminMuteUser = (targetUserId) => {
    if (getAuthStore().currentUser?.role === 'admin') {
      // Logique pour mute un utilisateur spécifique
      console.log(`Administrateur ${getAuthStore().currentUser.id} mute l'utilisateur ${targetUserId}`)
      return true
    } else {
      console.warn(`Tentative non autorisée de mute administrateur par l'utilisateur ${getAuthStore().currentUser.id}`)
      return false
    }
  }

  const adminDeafenUser = (targetUserId) => {
    if (getAuthStore().currentUser?.role === 'admin') {
      // Logique pour deafen un utilisateur spécifique
      console.log(`Administrateur ${getAuthStore().currentUser.id} deafen l'utilisateur ${targetUserId}`)
      return true
    } else {
      console.warn(`Tentative non autorisée de deafen administrateur par l'utilisateur ${getAuthStore().currentUser.id}`)
      return false
    }
  }

  const adminDisconnectUser = (targetUserId) => {
    if (getAuthStore().currentUser?.role === 'admin') {
      // Logique pour déconnecter un utilisateur spécifique
      console.log(`Administrateur ${getAuthStore().currentUser.id} déconnecte l'utilisateur ${targetUserId}`)
      return true
    } else {
      console.warn(`Tentative non autorisée de déconnexion administrateur par l'utilisateur ${getAuthStore().currentUser.id}`)
      return false
    }
  }

  // Vérifier les permissions d'administration
  const hasAdminPermissions = () => {
    return getAuthStore().currentUser?.role === 'admin'
  }

  // Vérifier si l'utilisateur peut contrôler un autre utilisateur
  const canControlUser = (targetUserId) => {
    return getAuthStore().currentUser?.id === targetUserId || getAuthStore().currentUser?.role === 'admin'
  }

  const getLinkedTextChannel = (voiceChannelId) => {
    return channels.value.find(channel => 
      channel.linkedVoiceId === voiceChannelId && channel.isLinked
    )
  }

  // Gestion des serveurs
  const updateServer = async (serverId, updates) => {
    const server = servers.value.find(s => s.id === serverId)
    if (server) {
      Object.assign(server, updates)
      saveToStorage()
      saveToFile()
    }
  }

  const deleteServer = async (serverId) => {
    const serverIndex = servers.value.findIndex(s => s.id === serverId)
    if (serverIndex !== -1) {
      const server = servers.value[serverIndex]
      
      // Supprimer tous les canaux du serveur
      channels.value = channels.value.filter(c => c.serverId !== serverId)
      
      // Supprimer le serveur
      servers.value.splice(serverIndex, 1)
      
      // Si c'était le serveur actuel, le désélectionner
      if (currentServer.value?.id === serverId) {
        currentServer.value = null
        currentChannel.value = null
      }
      
      saveToStorage()
      saveToFile()
    }
  }

  // Générer un lien d'invitation unique
  const generateInviteLink = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Rejoindre un serveur par ID (serveurs publics uniquement)
  const joinServer = async (serverId, userId) => {
    // Validation des paramètres
    if (!serverId || !userId) {
      throw new Error('ID du serveur et ID de l\'utilisateur requis')
    }

    const server = servers.value.find(s => s.id === serverId)
    if (!server) {
      throw new Error('Serveur non trouvé')
    }

    // Vérifier que le serveur est public
    if (server.type !== 'public') {
      throw new Error('Ce serveur n\'est pas public. Utilisez un lien d\'invitation pour les serveurs privés.')
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    if (server.members.includes(userId)) {
      throw new Error('Vous êtes déjà membre de ce serveur')
    }

    // Vérifier la limite de membres (optionnel)
    if (server.members.length >= 100) {
      throw new Error('Ce serveur a atteint sa limite de membres')
    }

    // Ajouter l'utilisateur au serveur
    server.members.push(userId)
    
    // Sauvegarder les changements
    saveToStorage()
    saveToFile()
    
    console.log(`Utilisateur ${userId} a rejoint le serveur ${server.name}`)
    
    return server
  }

  // Rejoindre un serveur par lien d'invitation
  const joinServerByInvite = async (inviteCode, userId) => {
    // Validation des paramètres
    if (!inviteCode || !userId) {
      throw new Error('Code d\'invitation et ID de l\'utilisateur requis')
    }

    const server = servers.value.find(s => s.inviteLink === inviteCode)
    if (!server) {
      throw new Error('Lien d\'invitation invalide ou expiré')
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    if (server.members.includes(userId)) {
      throw new Error('Vous êtes déjà membre de ce serveur')
    }

    // Vérifier la limite de membres
    if (server.members.length >= 100) {
      throw new Error('Ce serveur a atteint sa limite de membres')
    }

    // Ajouter l'utilisateur au serveur
    server.members.push(userId)
    
    // Sauvegarder les changements
    saveToStorage()
    saveToFile()
    
    console.log(`Utilisateur ${userId} a rejoint le serveur ${server.name} via invitation`)
    
    return server
  }

  // Régénérer le lien d'invitation d'un serveur
  const regenerateInviteLink = async (serverId) => {
    const server = servers.value.find(s => s.id === serverId)
    if (!server) {
      throw new Error('Serveur non trouvé')
    }

    // Générer un nouveau lien
    server.inviteLink = generateInviteLink()
    
    // Sauvegarder les changements
    saveToStorage()
    saveToFile()
    
    console.log(`Nouveau lien d'invitation généré pour ${server.name}: ${server.inviteLink}`)
    
    return server.inviteLink
  }

  const leaveServer = async (serverId, userId) => {
    console.log(`🔄 leaveServer appelé: serverId=${serverId}, userId=${userId}`)
    
    const server = servers.value.find(s => s.id === serverId)
    if (server) {
      console.log(`📋 Serveur trouvé: ${server.name}, membres avant:`, server.members)
      
      server.members = server.members.filter(id => id !== userId)
      console.log(`📋 Membres après suppression:`, server.members)
      
      // Si l'utilisateur quitte le serveur actuel, le désélectionner
      if (currentServer.value?.id === serverId) {
        currentServer.value = null
        currentChannel.value = null
        console.log('🔄 Serveur actuel désélectionné')
      }
      
      console.log('💾 Sauvegarde en cours...')
      saveToStorage()
      saveToFile()
      console.log('✅ Sauvegarde terminée')
    } else {
      console.error(`❌ Serveur non trouvé: ${serverId}`)
    }
  }

  // Gestion des canaux
  const createChannel = async (serverId, channelData) => {
    const channel = {
      id: Date.now().toString(),
      serverId,
      ...channelData
    }
    
    channels.value.push(channel)
    
    // Ajouter au serveur
    const server = servers.value.find(s => s.id === serverId)
    if (server) {
      server.channels.push(channel)
    }
    
    saveToStorage()
    saveToFile()
    
    return channel
  }

  const deleteChannel = async (channelId) => {
    const channelIndex = channels.value.findIndex(c => c.id === channelId)
    if (channelIndex !== -1) {
      const channel = channels.value[channelIndex]
      
      // Supprimer du serveur
      const server = servers.value.find(s => s.id === channel.serverId)
      if (server) {
        server.channels = server.channels.filter(c => c.id !== channelId)
      }
      
      // Supprimer de la liste globale
      channels.value.splice(channelIndex, 1)
      
      // Si c'était le canal actuel, le désélectionner
      if (currentChannel.value?.id === channelId) {
        currentChannel.value = null
      }
      
      saveToStorage()
      saveToFile()
    }
  }

  // Gestion des messages
  const addMessage = async (messageData) => {
    const message = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...messageData
    }
    
    messages.value.push(message)
    saveToStorage()
    saveToFile()
    
    return message
  }

  const deleteMessage = async (messageId) => {
    const messageIndex = messages.value.findIndex(m => m.id === messageId)
    if (messageIndex !== -1) {
      messages.value.splice(messageIndex, 1)
      saveToStorage()
      saveToFile()
    }
  }

  // Gestion des modals
  const openModal = (modalName) => {
    modals.value[modalName] = true
  }

  const closeModal = (modalName) => {
    modals.value[modalName] = false
  }

  // Gestion des paramètres
  const settings = ref({
    soundEnabled: true,
    notificationsEnabled: true,
    mentionsEnabled: true,
    messageAnimations: true,
    linkPreviews: true,
    animatedEmojis: true,
    autoDeviceDetection: true,
    timestampFormat: '24h',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    onlineStatus: 'everyone',
    privateMessages: 'everyone',
    // Nouveaux paramètres d'apparence
    theme: 'base', // 🎨 THÈME DE BASE UNIQUE
    accentColor: '#5865f2',
    fontSize: '16',
    zoomLevel: '100',
    transparency: '0',
    reducedMotion: false,
    compactMode: false,
    backdropBlur: true,
    animatedAvatars: true,
    emojiPreview: true,
    // Paramètres audio existants
    pushNotifications: true,
    notificationSounds: true,
    inputVolume: 50,
    outputVolume: 50,
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    audioQuality: 'medium',
    inputDevice: 'default',
    outputDevice: 'default'
  })

  const updateSetting = (key, value) => {
    settings.value[key] = value
    saveToStorage()
    saveToFile()
  }

  const resetSettings = () => {
    settings.value = {
      soundEnabled: true,
      notificationsEnabled: true,
      mentionsEnabled: true,
      messageAnimations: true,
      linkPreviews: true,
      animatedEmojis: true,
      autoDeviceDetection: true,
      timestampFormat: '24h',
      language: 'fr',
      dateFormat: 'DD/MM/YYYY',
      onlineStatus: 'everyone',
      privateMessages: 'everyone',
      // Nouveaux paramètres d'apparence
      theme: 'base',
      accentColor: '#5865f2',
      fontSize: '16',
      zoomLevel: '100',
      transparency: '0',
      reducedMotion: false,
      compactMode: false,
      backdropBlur: true,
      animatedAvatars: true,
      emojiPreview: true,
      // Paramètres audio existants
      pushNotifications: true,
      notificationSounds: true,
      inputVolume: 50,
      outputVolume: 50,
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true,
      audioQuality: 'medium',
      sampleRate: '44100',
      inputDevice: 'default',
      outputDevice: 'default',
      // Nouveaux paramètres vidéo
      videoDevice: 'default',
      videoQuality: 'medium',
      videoFPS: '30'
    }
    saveToStorage()
    saveToFile()
  }
  
  // 🚨 FONCTION DE RESET SPÉCIFIQUE POUR LE ZOOM
  const resetZoom = () => {
    settings.value.zoomLevel = '100'
    saveToStorage()
    saveToFile()
    console.log('🎯 Zoom reset à 100%')
  }

  // Persistance améliorée
  const saveToStorage = () => {
    try {
      // Sauvegarde localStorage avec une clé unique pour éviter les incohérences
      const data = {
        servers: servers.value,
        channels: channels.value,
        messages: messages.value,
        currentServer: currentServer.value,
        currentChannel: currentChannel.value,
        theme: theme.value,
        settings: settings.value,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('eterna-app-data', JSON.stringify(data))
      console.log('💾 Données sauvegardées dans localStorage')
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde localStorage:', error)
    }
  }

  const saveToFile = async () => {
    try {
      // Utiliser l'API Electron pour sauvegarder dans un fichier
      if (window.electronAPI && window.electronAPI.saveData) {
        const data = {
          servers: servers.value,
          channels: channels.value,
          messages: messages.value,
          currentServer: currentServer.value,
          currentChannel: currentChannel.value,
          theme: theme.value,
          settings: settings.value,
          timestamp: new Date().toISOString()
        }
        
        await window.electronAPI.saveData('eterna-data.json', JSON.stringify(data, null, 2))
        console.log('Données sauvegardées dans le fichier')
      } else {
        console.log('API Electron non disponible, sauvegarde fichier ignorée')
        console.log('window.electronAPI:', window.electronAPI)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde fichier:', error)
    }
  }

  const loadFromStorage = () => {
    try {
      // Charger depuis localStorage avec la clé unique
      const savedData = localStorage.getItem('eterna-app-data')
      
      if (savedData) {
        const data = JSON.parse(savedData)
        
        if (data.servers) servers.value = data.servers
        if (data.channels) channels.value = data.channels
        if (data.messages) messages.value = data.messages
        if (data.currentServer) currentServer.value = data.currentServer
        if (data.currentChannel) currentChannel.value = data.currentChannel
        if (data.theme) theme.value = data.theme
        if (data.settings) settings.value = data.settings
        
        console.log('📂 Données chargées depuis localStorage')
      } else {
        console.log('📂 Aucune donnée trouvée dans localStorage')
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement localStorage:', error)
    }
  }

  const loadFromFile = async () => {
    try {
      // Charger depuis le fichier Electron
      if (window.electronAPI && window.electronAPI.loadData) {
        console.log('Tentative de chargement depuis le fichier...')
        const data = await window.electronAPI.loadData('eterna-data.json')
        if (data) {
          const parsedData = JSON.parse(data)
          
          if (parsedData.servers) servers.value = parsedData.servers
          if (parsedData.channels) channels.value = parsedData.channels
          if (parsedData.messages) messages.value = parsedData.messages
          if (parsedData.currentServer) currentServer.value = parsedData.currentServer
          if (parsedData.currentChannel) currentChannel.value = parsedData.currentChannel
          if (parsedData.theme) theme.value = parsedData.theme
          if (parsedData.settings) settings.value = parsedData.settings
          
          console.log('Données chargées depuis le fichier')
          return true
        }
      } else {
        console.log('API Electron non disponible pour le chargement fichier')
        console.log('window.electronAPI:', window.electronAPI)
      }
      return false
    } catch (error) {
      console.error('Erreur lors du chargement fichier:', error)
      return false
    }
  }

  const clearStorage = () => {
    try {
      // Nettoyer localStorage
      localStorage.removeItem('eterna-servers')
      localStorage.removeItem('eterna-channels')
      localStorage.removeItem('eterna-messages')
      localStorage.removeItem('eterna-current-server')
      localStorage.removeItem('eterna-current-channel')
      localStorage.removeItem('eterna-theme')
      localStorage.removeItem('eterna-settings')
      
      // Nettoyer la mémoire
      servers.value = []
      channels.value = []
      messages.value = []
      currentServer.value = null
      currentChannel.value = null
      theme.value = 'dark'
      resetSettings()
      
      // Nettoyer le fichier
      if (window.electronAPI && window.electronAPI.deleteData) {
        window.electronAPI.deleteData('eterna-data.json')
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error)
    }
  }

  // Initialisation améliorée
  const initialize = async (currentUserId = null) => {
    console.log('Initialisation du store...')
    
    // Vérifier si nous sommes en mode Electron (production)
    const isElectron = window.electronAPI && window.electronAPI.isElectron
    
    if (isElectron) {
      console.log('Mode Electron détecté, tentative de chargement depuis le fichier...')
      // Essayer de charger depuis le fichier d'abord
      const fileLoaded = await loadFromFile()
      
      // Si le fichier n'a pas fonctionné, charger depuis localStorage
      if (!fileLoaded) {
        console.log('Chargement depuis localStorage...')
        loadFromStorage()
      }
    } else {
      console.log('Mode développement détecté, utilisation du localStorage uniquement')
      loadFromStorage()
    }
    
    // Nettoyer et corriger les données existantes
    cleanupAndFixData()
    
    // Créer des données de test si aucun serveur n'existe
    if (servers.value.length === 0) {
      console.log('Création des données de test...')
      createTestData()
    }
    
    console.log('Store initialisé avec', servers.value.length, 'serveurs')
  }

  // Nettoyer et corriger les données
  const cleanupAndFixData = () => {
    console.log('Nettoyage et correction des données...')
    
    // Limiter le nombre de serveurs mais préserver les importants
    const maxServers = 10 // Augmenter la limite de 5 à 10
    
    if (servers.value.length > maxServers) {
      console.log(`Trop de serveurs (${servers.value.length}), suppression des plus anciens...`)
      
      // Trier les serveurs par date de création (plus récents en premier)
      const sortedServers = [...servers.value].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      
      // Préserver les serveurs importants (ceux avec des membres)
      const importantServers = sortedServers.filter(server => 
        server.members && server.members.length > 0
      )
      
      // Garder les serveurs importants + les plus récents
      const serversToKeep = importantServers.length >= maxServers 
        ? importantServers.slice(0, maxServers)
        : [...importantServers, ...sortedServers.slice(importantServers.length, maxServers)]
      
      const serversToDelete = servers.value.filter(server => 
        !serversToKeep.find(keepServer => keepServer.id === server.id)
      )
      
      if (serversToDelete.length > 0) {
        console.log(`Serveurs supprimés:`, serversToDelete.map(s => s.name))
        servers.value = serversToKeep
      }
    }
    
    // Corriger les serveurs qui n'ont pas de propriétés requises
    servers.value.forEach(server => {
      if (!server.ownerId) {
        server.ownerId = 'default-user'
        console.log(`Serveur ${server.name}: ownerId ajouté`)
      }
      
      if (!server.members || !Array.isArray(server.members) || server.members.length === 0) {
        // Si pas de members, utiliser l'utilisateur actuel ou default-user
        const currentUser = getAuthStore().currentUser
        const userId = currentUser?.id || 'default-user'
        server.members = [userId]
        console.log(`Serveur ${server.name}: members corrigés avec ${userId}`)
      }
      
      // S'assurer que l'utilisateur actuel est membre seulement des serveurs qui n'ont vraiment aucun membre
      // (pas de ceux qu'il a volontairement quittés)
      const currentUser = getAuthStore().currentUser
      if (currentUser && (!server.members || !Array.isArray(server.members) || server.members.length === 0)) {
        // Seulement si le serveur n'a vraiment aucun membre
        server.members = [currentUser.id]
        console.log(`Serveur ${server.name}: utilisateur actuel ajouté aux membres (serveur vide)`)
      }
      
      if (!server.createdAt) {
        server.createdAt = new Date().toISOString()
        console.log(`Serveur ${server.name}: createdAt ajouté`)
      }
    })
    
    // Sauvegarder les corrections
    saveToStorage()
    saveToFile()
  }

  // Créer des données de test
  const createTestData = () => {
    // Créer un serveur de test
    const testServer = {
      id: 'test-server',
      name: 'test2',
      description: 'Serveur de test',
      isPublic: true,
      members: ['owner-user'], // Ajouter l'owner par défaut
      channels: [
        {
          id: 'general',
          name: 'général',
          type: 'text',
          messages: [
            {
              id: '1',
              userId: 'owner-user',
              content: 'test',
              timestamp: new Date().toISOString()
            }
          ]
        },
        {
          id: 'gaming',
          name: 'Gaming',
          type: 'voice',
          linkedTextChannel: 'general'
        }
      ],
      createdAt: new Date().toISOString()
    }

    // Créer des utilisateurs de test
    const testUsers = [
      {
        id: 'owner-user',
        username: 'chino',
        tag: 'ETER',
        email: 'owner@eterna.com',
        password: 'password123',
        role: 'owner', // Rôle owner par défaut
        permissions: ['voice:control:own', 'server:manage', 'user:manage'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-user',
        username: 'testuser',
        tag: '1234',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        permissions: ['voice:control:own'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin-user',
        username: 'admin',
        tag: '0000',
        email: 'admin@eterna.com',
        password: 'admin123',
        role: 'admin',
        permissions: ['voice:control:own', 'voice:control:others', 'server:manage', 'user:manage'],
        createdAt: new Date().toISOString()
      }
    ]

    // Ajouter les utilisateurs s'ils n'existent pas déjà
    testUsers.forEach(user => {
      if (!getAuthStore().users.find(u => u.id === user.id)) {
        getAuthStore().users.push(user)
      }
    })

    // Ajouter le serveur s'il n'existe pas déjà
    if (!servers.value.find(s => s.id === testServer.id)) {
      servers.value.push(testServer)
    }

    // PROMOTION : Promouvoir le premier utilisateur en owner s'il n'y en a pas
    const existingOwner = getAuthStore().users.find(u => u.role === 'owner')
    if (!existingOwner && getAuthStore().users.length > 0) {
      const firstUser = getAuthStore().users[0]
      console.log(`👑 Promotion de l'utilisateur ${firstUser.username || firstUser.id} en owner`)
      firstUser.role = 'owner'
      firstUser.permissions = ['voice:control:own', 'server:manage', 'user:manage']
      
      // Mettre à jour le serveur test pour inclure cet owner
      const testServer = servers.value.find(s => s.name === 'test2')
      if (testServer && !testServer.members.includes(firstUser.id)) {
        testServer.members = [firstUser.id]
        console.log(`🔧 Serveur test2 mis à jour avec l'owner: ${firstUser.id}`)
      }
    }

    // CORRECTION IMMÉDIATE : Ajouter des rôles à TOUS les utilisateurs existants
    getAuthStore().users.forEach(user => {
      if (!user.role) {
        console.log(`🔧 Ajout du rôle 'user' à l'utilisateur ${user.username || user.id}`)
        user.role = 'user'
        user.permissions = user.permissions || ['voice:control:own']
        user.createdAt = user.createdAt || new Date().toISOString()
      }
    })

    // PROMOTION IMMÉDIATE : Promouvoir l'utilisateur actuel en owner s'il n'y en a pas
    const currentOwner = getAuthStore().users.find(u => u.role === 'owner')
    if (!currentOwner) {
      // Trouver l'utilisateur 'chino' ou le premier utilisateur
      const chinoUser = getAuthStore().users.find(u => u.username === 'chino')
      const userToPromote = chinoUser || getAuthStore().users[0]
      
      if (userToPromote) {
        console.log(`👑 PROMOTION IMMÉDIATE de l'utilisateur ${userToPromote.username || userToPromote.id} en owner`)
        userToPromote.role = 'owner'
        userToPromote.permissions = ['voice:control:own', 'server:manage', 'user:manage']
        
        // Mettre à jour TOUS les serveurs pour inclure cet owner
        servers.value.forEach(server => {
          if (server.members && server.members.includes(userToPromote.id)) {
            console.log(`🔧 Serveur ${server.name} mis à jour avec l'owner: ${userToPromote.id}`)
          }
        })
      }
    }

    // Sauvegarder les données
    saveToStorage()
    saveToFile()
  }

  // FONCTION DE CORRECTION IMMÉDIATE - À appeler manuellement si nécessaire
  const forceFixUserRoles = () => {
    console.log('🔧 FORCE FIX - Correction immédiate des rôles utilisateurs')
    
    getAuthStore().users.forEach(user => {
      if (!user.role) {
        console.log(`🔧 Ajout du rôle 'user' à l'utilisateur ${user.username || user.id}`)
        user.role = 'user'
        user.permissions = user.permissions || ['voice:control:own']
        user.createdAt = user.createdAt || new Date().toISOString()
      }
    })

    // Promouvoir 'chino' en owner
    const chinoUser = getAuthStore().users.find(u => u.username === 'chino')
    if (chinoUser) {
      console.log(`👑 PROMOTION FORCÉE de chino en owner`)
      chinoUser.role = 'owner'
      chinoUser.permissions = ['voice:control:own', 'server:manage', 'user:manage']
    }

    // Préserver tous les serveurs avec des membres
    const importantServers = servers.value.filter(server => 
      server.members && server.members.length > 0
    )
    
    if (importantServers.length > 0) {
      console.log(`🔧 Préservation de ${importantServers.length} serveurs importants`)
      servers.value = importantServers
    }

    saveToStorage()
    saveToFile()
    console.log('🔧 FORCE FIX - Rôles corrigés et serveurs préservés')
  }

  // CRÉER UN SERVEUR DE TEST STABLE
  const createStableTestServer = () => {
    console.log('🏗️ Création d\'un serveur de test stable')
    
    const chinoUser = getAuthStore().users.find(u => u.username === 'chino')
    if (!chinoUser) {
      console.log('❌ Utilisateur chino non trouvé')
      return
    }

    // Créer un serveur stable avec chino comme owner
    const stableServer = {
      id: 'stable-test-server',
      name: 'Mon Serveur',
      description: 'Serveur de test stable',
      type: 'private',
      ownerId: chinoUser.id,
      members: [chinoUser.id], // chino est membre
      channels: [
        {
          id: 'general-stable',
          name: 'général',
          type: 'text',
          messages: [
            {
              id: '1',
              userId: chinoUser.id,
              content: 'Bienvenue sur mon serveur !',
              timestamp: new Date().toISOString()
            }
          ]
        },
        {
          id: 'voice-stable',
          name: 'Vocal',
          type: 'voice',
          linkedTextChannel: 'general-stable'
        }
      ],
      createdAt: new Date().toISOString()
    }

    // Vérifier si le serveur existe déjà
    const existingServer = servers.value.find(s => s.id === stableServer.id)
    if (!existingServer) {
      servers.value.push(stableServer)
      console.log('✅ Serveur stable créé avec succès')
    } else {
      console.log('ℹ️ Serveur stable existe déjà')
    }

    saveToStorage()
    saveToFile()
  }

  // AJOUTER L'UTILISATEUR ACTUEL À TOUS LES SERVEURS
  const addUserToAllServers = () => {
  console.log('🔧 Ajout de l\'utilisateur actuel à tous les serveurs')
  
  const chinoUser = getAuthStore().users.find(u => u.username === 'chino')
  if (!chinoUser) {
    console.log('❌ Utilisateur chino non trouvé')
    return
  }

  let serversUpdated = 0
  
  servers.value.forEach(server => {
    if (!server.members) {
      server.members = []
    }
    
    if (!server.members.includes(chinoUser.id)) {
      server.members.push(chinoUser.id)
      serversUpdated++
      console.log(`✅ Ajouté au serveur: ${server.name}`)
    }
  })

  if (serversUpdated > 0) {
    console.log(`🔧 ${serversUpdated} serveurs mis à jour`)
    saveToStorage()
    saveToFile()
  } else {
    console.log('ℹ️ Tous les serveurs sont déjà à jour')
  }
}

// 🗑️ NETTOYAGE COMPLET DE LA BASE DE DONNÉES
const clearAllData = () => {
  console.log('🗑️ NETTOYAGE COMPLET - Suppression de tous les serveurs et données')
  
  // Vider tous les tableaux
  servers.value = []
  channels.value = []
  messages.value = []
  voiceParticipants.value = []
  
  // Réinitialiser les sélections
  currentServer.value = null
  currentChannel.value = null
  
  // Sauvegarder (base vide) - utiliser la fonction du store
  if (typeof saveToStorage === 'function') {
    saveToStorage()
    saveToFile()
  } else {
    // Sauvegarde directe si saveData n'est pas accessible
    try {
      localStorage.setItem('eterna-app-data', JSON.stringify({
        servers: [],
        channels: [],
        messages: [],
        voiceParticipants: [],
        settings: settings.value || {}
      }))
      console.log('🗑️ Sauvegarde directe effectuée')
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
    }
  }
  
  console.log('🗑️ Base de données complètement vidée')
  console.log('🗑️ Serveurs restants:', servers.value.length)
  console.log('🗑️ Canaux restants:', channels.value.length)
  console.log('🗑️ Messages restants:', messages.value.length)
}

// 🔄 CRÉATION D'UN SERVEUR PROPRE ET STABLE
const createCleanServer = () => {
  console.log('🏗️ Création d\'un serveur propre et stable')
  
  // Utiliser l'utilisateur actuel au lieu de chercher 'chino'
  const currentUser = getAuthStore().users[0] // Premier utilisateur disponible
  if (!currentUser) {
    console.log('❌ Aucun utilisateur trouvé')
    return
  }

  // Promouvoir l'utilisateur actuel en owner s'il ne l'est pas déjà
  if (currentUser.role !== 'owner') {
    console.log(`👑 Promotion de ${currentUser.username} en owner`)
    currentUser.role = 'owner'
    currentUser.permissions = ['voice:control:own', 'server:manage', 'user:manage']
  }

  // Créer un serveur propre
  const cleanServer = {
    id: 'clean-server-' + Date.now(),
    name: 'Mon Serveur',
    description: 'Serveur propre et stable',
    type: 'private',
    ownerId: currentUser.id,
    members: [currentUser.id],
    channels: [
      {
        id: 'general-clean',
        name: 'général',
        type: 'text',
        messages: [
          {
            id: '1',
            userId: currentUser.id,
            content: 'Bienvenue sur mon serveur propre !',
            timestamp: new Date().toISOString()
          }
        ]
      },
      {
        id: 'voice-clean',
        name: 'Vocal',
        type: 'voice',
        linkedTextChannel: 'general-clean'
      }
    ],
    createdAt: new Date().toISOString()
  }

  // Ajouter le serveur
  servers.value.push(cleanServer)
  
  // Sélectionner ce serveur
  currentServer.value = cleanServer
  currentChannel.value = cleanServer.channels[0]
  
  console.log('✅ Serveur propre créé et sélectionné')
  
  // Sauvegarde directe
  try {
    localStorage.setItem('eterna-app-data', JSON.stringify({
      servers: servers.value,
      channels: channels.value,
      messages: messages.value,
      voiceParticipants: voiceParticipants.value,
      settings: settings.value || {}
    }))
    console.log('✅ Sauvegarde directe effectuée')
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error)
  }
}

// 🔧 CORRIGER LE RÔLE DE L'UTILISATEUR ACTUEL
const fixCurrentUserRole = () => {
  console.log('🔧 Correction du rôle de l\'utilisateur actuel')
  
  // Trouver l'utilisateur actuel (premier utilisateur)
  const currentUser = getAuthStore().users[0]
  if (!currentUser) {
    console.log('❌ Aucun utilisateur trouvé')
    return
  }
  
  // Vérifier s'il a créé des serveurs
  const ownedServers = servers.value.filter(server => server.ownerId === currentUser.id)
  
  if (ownedServers.length > 0) {
    // S'il a créé des serveurs, le promouvoir owner
    if (currentUser.role !== 'owner') {
      console.log(`👑 Promotion de ${currentUser.username} en owner (créateur de ${ownedServers.length} serveur(s))`)
      currentUser.role = 'owner'
      currentUser.permissions = ['voice:control:own', 'server:manage', 'user:manage']
    }
  } else {
    // Sinon, lui donner le rôle user par défaut
    if (!currentUser.role) {
      console.log(`🔧 Attribution du rôle 'user' à ${currentUser.username}`)
      currentUser.role = 'user'
      currentUser.permissions = ['voice:control:own']
    }
  }
  
  // Sauvegarder les changements
  try {
    localStorage.setItem('eterna-app-data', JSON.stringify({
      servers: servers.value,
      channels: channels.value,
      messages: messages.value,
      voiceParticipants: voiceParticipants.value,
      users: getAuthStore().users,
      settings: settings.value || {}
    }))
    console.log('✅ Rôle utilisateur corrigé et sauvegardé')
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error)
  }
}

  return {
    // État
    theme,
    currentServer,
    currentChannel,
    servers,
    channels,
    messages,
    modals,
    voiceStatus,
    updateInfo,
    
    // Gestion des canaux vocaux et CTL
    createVoiceChannel,
    deleteVoiceChannel,
    renameVoiceChannel,
    getLinkedTextChannel,
    
    // Gestion du statut vocal
    connectToVoiceChannel,
    disconnectFromVoiceChannel,
    toggleMute,
    toggleDeafen,
    setSpeaking,

    // Fonctions sécurisées pour les administrateurs
    adminMuteUser,
    adminDeafenUser,
    adminDisconnectUser,

    // Vérifier les permissions d'administration
    hasAdminPermissions,
    // Vérifier si l'utilisateur peut contrôler un autre utilisateur
    canControlUser,

    // Getters
    isDarkMode,
    currentServerChannels,
    currentChannelMessages,

    // Actions
    // 🎨 THÈME DE BASE UNIQUE - Plus de gestion des thèmes sombre/clair
    // Les fonctions toggleTheme et updateTheme ont été supprimées car obsolètes
    
    // Gestion des mises à jour
    setUpdateAvailable,
    clearUpdateInfo,
    setCurrentServer,
    setCurrentChannel,
    
    // Serveurs
    createServer,
    updateServer,
    deleteServer,
    joinServer,
    joinServerByInvite,
    regenerateInviteLink,
    leaveServer,
    
    // Canaux
    createChannel,
    deleteChannel,
    
    // Messages
    addMessage,
    deleteMessage,
    
    // Modals
    openModal,
    closeModal,
    
    // Paramètres
    settings,
    updateSetting,
    resetSettings,
    resetZoom,
    
    // Persistance
    saveToStorage,
    saveToFile,
    loadFromStorage,
    loadFromFile,
    clearStorage,
    initialize,
    createTestData,
    cleanupAndFixData,
    addVoiceParticipant,
    removeVoiceParticipant,
    updateVoiceParticipantStatus,
    getVoiceParticipants,
    forceFixUserRoles,
    createStableTestServer,
    addUserToAllServers,
    clearAllData,
    createCleanServer,
    fixCurrentUserRole
  }
})
