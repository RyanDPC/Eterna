<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="glass-effect border border-border-primary rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
      <!-- En-tête -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-white mb-2">
          {{ isLogin ? tLocal('auth.login') : tLocal('auth.register') }}
        </h1>
        <p class="text-sm text-gray-400">
          {{ isLogin ? 'Connectez-vous à votre compte Eterna' : 'Créez votre compte Eterna' }}
        </p>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nom d'utilisateur + Tag sur la même ligne (inscription uniquement) -->
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-300 mb-1">
            {{ tLocal('auth.username') }}
          </label>
          <div class="flex gap-2">
            <div class="flex-1">
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                maxlength="20"
                class="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                :placeholder="tLocal('auth.username')"
              />
            </div>
            <div class="flex items-center gap-1">
              <span class="text-gray-400 text-lg font-medium">#</span>
              <input
                id="tag"
                v-model="form.tag"
                type="text"
                required
                maxlength="4"
                minlength="4"
                @input="convertTagToUppercase"
                class="w-20 px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm text-center uppercase"
                placeholder="EUX"
              />
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Username: 3-20 caractères, Tag: exactement 4 caractères
          </div>
        </div>

        <!-- Email et Mot de passe côte à côte (inscription uniquement) -->
        <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
              {{ tLocal('auth.email') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
              {{ tLocal('auth.password') }}
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 pr-10 bg-background-primary border border-border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Email et Mot de passe séparés (connexion uniquement) -->
        <div v-if="isLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
              Adresse email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
              Mot de passe
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 pr-10 bg-background-primary border border-border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Confirmation mot de passe (inscription uniquement) -->
        <div v-if="!isLogin">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
            placeholder="••••••••"
          />
          <div v-if="passwordMismatch" class="text-red-400 text-xs mt-1">
            Les mots de passe ne correspondent pas
          </div>
        </div>

        <!-- Aperçu du nom complet (inscription uniquement) -->
        <div v-if="!isLogin && form.username && form.tag" class="bg-background-primary rounded-lg p-3 border border-border-primary">
          <h3 class="text-xs font-medium text-gray-300 mb-2">Votre nom d'utilisateur sera :</h3>
          <div class="text-center">
            <span class="text-lg font-bold text-pink-400">{{ form.username }}#{{ form.tag }}</span>
          </div>
        </div>

        <!-- Règles de mot de passe simplifiées (inscription uniquement) -->
        <div v-if="!isLogin" class="text-xs text-gray-400">
          <div class="mb-2">Règles du mot de passe :</div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="flex items-center gap-2" :class="passwordRules.length ? 'text-green-400' : 'text-red-400'">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="passwordRules.length" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <span>8+ caractères</span>
            </div>
            <div class="flex items-center gap-2" :class="passwordRules.uppercase ? 'text-green-400' : 'text-red-400'">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="passwordRules.uppercase" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <span>1 majuscule</span>
            </div>
            <div class="flex items-center gap-2" :class="passwordRules.lowercase ? 'text-green-400' : 'text-red-400'">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="passwordRules.lowercase" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <span>1 minuscule</span>
            </div>
            <div class="flex items-center gap-2" :class="passwordRules.number ? 'text-green-400' : 'text-red-400'">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="passwordRules.number" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <span>1 chiffre</span>
            </div>
            <div class="flex items-center gap-2" :class="passwordRules.special ? 'text-green-400' : 'text-red-400'">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="passwordRules.special" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <span>1 spécial</span>
            </div>
          </div>
        </div>

        <!-- Bouton de soumission -->
        <button
          type="submit"
          :disabled="!isFormValid || isLoading"
          class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-sm"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLogin ? 'Connexion...' : 'Inscription...' }}
          </span>
          <span v-else>{{ isLogin ? 'Se connecter' : 'S\'inscrire' }}</span>
        </button>

        <!-- Messages d'erreur -->
        <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs">
          {{ errorMessage }}
        </div>
      </form>

      <!-- Basculer entre login/register -->
      <div class="text-center mt-4">
        <p class="text-sm text-gray-400">
          {{ isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?' }}
          <button
            @click="toggleMode"
            class="text-pink-400 hover:text-pink-300 font-medium transition-colors"
          >
            {{ isLogin ? 'S\'inscrire' : 'Se connecter' }}
          </button>
        </p>
      </div>

      <!-- Fermer -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '../i18n'
import { useAppStore } from '../stores/appStore'

// Props et emits
const emit = defineEmits(['close', 'login', 'register'])

// Internationalisation
const { t } = useI18n()
const appStore = useAppStore()

// Fonction de traduction locale qui utilise la langue du store
const tLocal = (key) => {
  const lang = appStore.settings.language || 'fr'
  return t(key, lang)
}

// État local
const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// Formulaire
const form = ref({
  username: '',
  tag: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Règles de validation du mot de passe
const passwordRules = computed(() => {
  const password = form.value.password
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  }
})

// Validation du nom d'utilisateur
const isUsernameValid = computed(() => {
  const username = form.value.username
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9]+$/.test(username)
})

// Validation du tag - exactement 4 caractères, accepte minuscules et majuscules
const isTagValid = computed(() => {
  const tag = form.value.tag
  return tag.length === 4 && /^[a-zA-Z0-9]+$/.test(tag)
})

// Validation du formulaire
const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.value.email && form.value.password
  } else {
    // Vérification étape par étape pour l'inscription
    const hasUsername = form.value.username && isUsernameValid.value
    const hasTag = form.value.tag && isTagValid.value
    const hasEmail = form.value.email
    const hasPassword = form.value.password
    const hasConfirmPassword = form.value.confirmPassword
    const passwordRulesValid = Object.values(passwordRules.value).every(rule => rule)
    const passwordsMatch = form.value.password === form.value.confirmPassword
    
    return hasUsername && hasTag && hasEmail && hasPassword && hasConfirmPassword && passwordRulesValid && passwordsMatch
  }
})

// Vérification de la correspondance des mots de passe
const passwordMismatch = computed(() => {
  if (isLogin.value) return false
  return form.value.confirmPassword && form.value.password !== form.value.confirmPassword
})

// Basculer entre login et register
const toggleMode = () => {
  isLogin.value = !isLogin.value
  form.value = { username: '', tag: '', email: '', password: '', confirmPassword: '' }
  errorMessage.value = ''
}

// Soumission du formulaire
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    if (isLogin.value) {
      // Connexion
      emit('login', {
        email: form.value.email,
        password: form.value.password
      })
    } else {
      // Inscription
      emit('register', {
        username: form.value.username,
        tag: form.value.tag,
        email: form.value.email,
        password: form.value.password
      })
    }
  } catch (error) {
    errorMessage.value = error.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

// Réinitialiser les erreurs quand le mode change
watch(isLogin, () => {
  errorMessage.value = ''
})

// Convertir le tag en majuscules lors de l'input
const convertTagToUppercase = () => {
  form.value.tag = form.value.tag.toUpperCase()
}
</script>
