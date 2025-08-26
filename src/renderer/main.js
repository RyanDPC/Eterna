import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Créer l'application Vue
const app = createApp(App)

// Créer et installer Pinia
const pinia = createPinia()
app.use(pinia)

// Initialiser les stores
import { useAppStore } from './stores/appStore'
import { useAuthStore } from './stores/authStore'

// Initialiser le store app
const appStore = useAppStore()
appStore.initialize()

// Initialiser le store auth
const authStore = useAuthStore()
authStore.initialize()

// Monter l'application
app.mount('#app')
