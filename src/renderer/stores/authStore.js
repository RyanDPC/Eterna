import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // État
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  const users = ref([])

  // Getters
  const getUserDisplayName = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.username}#${currentUser.value.tag}`
  })

  const getUserById = computed(() => {
    return (id) => users.value.find(user => user.id === id)
  })

  const getUserByUsername = computed(() => {
    return (username, tag) => users.value.find(user => 
      user.username === username && user.tag === tag
    )
  })

  // Vérifier les permissions
  const hasPermission = (permission) => {
    if (!currentUser.value) return false
    return currentUser.value.permissions.includes(permission) || currentUser.value.role === 'admin'
  }

  const hasRole = (role) => {
    if (!currentUser.value) return false
    return currentUser.value.role === role
  }

  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin'
  })

  const canControlVoice = (targetUserId) => {
    if (!currentUser.value) return false
    // Un utilisateur peut contrôler son propre statut vocal
    if (currentUser.value.id === targetUserId) return true
    // Un admin peut contrôler n'importe qui
    if (currentUser.value.role === 'admin') return true
    // Un modérateur peut contrôler les utilisateurs normaux
    if (currentUser.value.role === 'moderator' && hasPermission('voice:control:others')) return true
    return false
  }

  // Actions
  const register = async (userData) => {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = getUserByUsername.value(userData.username, userData.tag)
      if (existingUser) {
        throw new Error('Ce nom d\'utilisateur et tag sont déjà pris')
      }

      // Vérifier si l'email existe déjà
      const existingEmail = users.value.find(user => user.email === userData.email)
      if (existingEmail) {
        throw new Error('Cette adresse email est déjà utilisée')
      }

      // Créer le nouvel utilisateur
      const newUser = {
        id: Date.now(),
        username: userData.username,
        tag: userData.tag,
        email: userData.email,
        password: userData.password, // En production, hash le mot de passe
        createdAt: new Date(),
        lastLogin: new Date(),
        status: 'online',
        avatar: null,
        bio: '',
        friends: [],
        servers: [],
        role: 'user', // Rôle par défaut
        permissions: ['voice:control:own'] // Permissions par défaut
      }

      // Ajouter à la liste des utilisateurs
      users.value.push(newUser)

      // Connecter l'utilisateur
      await login({ email: userData.email, password: userData.password })

      // Sauvegarder en localStorage
      saveUsersToStorage()

      return newUser
    } catch (error) {
      throw error
    }
  }

  const login = async (credentials) => {
    try {
      // Trouver l'utilisateur par email
      const user = users.value.find(u => u.email === credentials.email)
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect')
      }

      // Vérifier le mot de passe (en production, comparer les hash)
      if (user.password !== credentials.password) {
        throw new Error('Email ou mot de passe incorrect')
      }

      // Mettre à jour la dernière connexion
      user.lastLogin = new Date()
      user.status = 'online'

      // Connecter l'utilisateur
      currentUser.value = user
      isAuthenticated.value = true

      // Sauvegarder en localStorage
      saveUsersToStorage()
      localStorage.setItem('eterna_current_user', JSON.stringify(user))

      return user
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    if (currentUser.value) {
      // Mettre à jour le statut
      const user = users.value.find(u => u.id === currentUser.value.id)
      if (user) {
        user.status = 'offline'
      }
    }

    // Déconnecter
    currentUser.value = null
    isAuthenticated.value = false

    // Nettoyer localStorage
    localStorage.removeItem('eterna_current_user')
  }

  const updateProfile = (updates) => {
    if (!currentUser.value) return

    // Mettre à jour l'utilisateur actuel
    Object.assign(currentUser.value, updates)

    // Mettre à jour dans la liste des utilisateurs
    const userIndex = users.value.findIndex(u => u.id === currentUser.value.id)
    if (userIndex !== -1) {
      users.value[userIndex] = { ...currentUser.value }
    }

    // Sauvegarder
    saveUsersToStorage()
    localStorage.setItem('eterna_current_user', JSON.stringify(currentUser.value))
  }

  const changePassword = async (oldPassword, newPassword) => {
    if (!currentUser.value) {
      throw new Error('Utilisateur non connecté')
    }

    if (currentUser.value.password !== oldPassword) {
      throw new Error('Ancien mot de passe incorrect')
    }

    // Mettre à jour le mot de passe
    currentUser.value.password = newPassword

    // Mettre à jour dans la liste
    const userIndex = users.value.findIndex(u => u.id === currentUser.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].password = newPassword
    }

    // Sauvegarder
    saveUsersToStorage()
    localStorage.setItem('eterna_current_user', JSON.stringify(currentUser.value))
  }

  const addFriend = (friendUsername, friendTag) => {
    if (!currentUser.value) return

    const friend = getUserByUsername.value(friendUsername, friendTag)
    if (!friend) {
      throw new Error('Utilisateur non trouvé')
    }

    if (friend.id === currentUser.value.id) {
      throw new Error('Vous ne pouvez pas vous ajouter vous-même')
    }

    if (currentUser.value.friends.includes(friend.id)) {
      throw new Error('Cet utilisateur est déjà dans vos amis')
    }

    // Ajouter l'ami
    currentUser.value.friends.push(friend.id)
    
    // Mettre à jour dans la liste
    const userIndex = users.value.findIndex(u => u.id === currentUser.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].friends = [...currentUser.value.friends]
    }

    // Sauvegarder
    saveUsersToStorage()
    localStorage.setItem('eterna_current_user', JSON.stringify(currentUser.value))
  }

  const removeFriend = (friendId) => {
    if (!currentUser.value) return

    const friendIndex = currentUser.value.friends.indexOf(friendId)
    if (friendIndex === -1) return

    // Retirer l'ami
    currentUser.value.friends.splice(friendIndex, 1)

    // Mettre à jour dans la liste
    const userIndex = users.value.findIndex(u => u.id === currentUser.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].friends = [...currentUser.value.friends]
    }

    // Sauvegarder
    saveUsersToStorage()
    localStorage.setItem('eterna_current_user', JSON.stringify(currentUser.value))
  }

  // Persistance
  const saveUsersToStorage = () => {
    localStorage.setItem('eterna_users', JSON.stringify(users.value))
  }

  const loadUsersFromStorage = () => {
    try {
      const savedUsers = localStorage.getItem('eterna_users')
      if (savedUsers) {
        users.value = JSON.parse(savedUsers)
      }

      // Charger l'utilisateur connecté
      const savedCurrentUser = localStorage.getItem('eterna_current_user')
      if (savedCurrentUser) {
        currentUser.value = JSON.parse(savedCurrentUser)
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    }
  }

  const clearStorage = () => {
    localStorage.removeItem('eterna_users')
    localStorage.removeItem('eterna_current_user')
    users.value = []
    currentUser.value = null
    isAuthenticated.value = false
  }

  // Initialisation
  const initialize = () => {
    loadUsersFromStorage()
  }

  return {
    // État
    currentUser,
    isAuthenticated,
    users,
    
    // Getters
    getUserDisplayName,
    getUserById,
    getUserByUsername,
    isAdmin,
    
    // Actions
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    addFriend,
    removeFriend,
    
    // Permissions et rôles
    hasPermission,
    hasRole,
    canControlVoice,
    
    // Persistance
    saveUsersToStorage,
    loadUsersFromStorage,
    clearStorage,
    initialize
  }
})


