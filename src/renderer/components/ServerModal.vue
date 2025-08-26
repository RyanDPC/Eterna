<template>
  <Teleport to="body">
    <div class="modal-root">
      <div class="modal-overlay" @click="$emit('close')"></div>
      <div class="modal-dialog">
        <!-- En-tête du modal -->
        <div class="modal-header">
          <div class="modal-icon">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
                   <h1 class="modal-title">Créer un serveur</h1>
         <p class="modal-subtitle">Donnez vie à votre nouveau serveur</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleSubmit" class="modal-form">
          <!-- Nom du serveur -->
          <div class="form-group">
            <label for="serverName" class="form-label">Nom du serveur</label>
            <input
              id="serverName"
              v-model="form.name"
              type="text"
              maxlength="32"
                             placeholder="Mon serveur..."
              class="form-input"
              required
            />
            <div class="char-counter">{{ form.name.length }}/32 caractères</div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="serverDescription" class="form-label">
              Description <span class="optional">(optionnel)</span>
            </label>
            <textarea
              id="serverDescription"
              v-model="form.description"
              rows="6"
              maxlength="200"
                             placeholder="Décrivez votre serveur..."
              class="form-textarea"
            ></textarea>
            <div class="char-counter">{{ form.description.length }}/200 caractères</div>
          </div>

          <!-- Type de serveur -->
          <div class="form-group">
            <label class="form-label">Type de serveur</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  v-model="form.type"
                  type="radio"
                  value="public"
                  class="radio-input"
                />
                <div class="radio-content">
                  <div class="radio-title">Public</div>
                  <div class="radio-description">Visible par tous</div>
                </div>
              </label>
              
              <label class="radio-option">
                <input
                  v-model="form.type"
                  type="radio"
                  value="private"
                  class="radio-input"
                />
                <div class="radio-content">
                  <div class="radio-title">Privé</div>
                  <div class="radio-description">Sur invitation</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="modal-actions">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              Annuler
            </button>
                         <button
               type="submit"
               :disabled="!isFormValid"
               class="btn btn-primary"
             >
               Créer le serveur
             </button>
          </div>
        </form>

        <!-- Bouton fermer -->
        <button
          @click="$emit('close')"
          class="modal-close"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props et emits
const props = defineProps({
  server: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'create'])

// État local
const isLoading = ref(false)

// Formulaire
const form = ref({
  name: '',
  description: '',
  type: 'public'
})

// Vérifier si on est en mode édition
const isEditing = computed(() => !!props.server)

// Validation du formulaire
const isFormValid = computed(() => {
  return form.value.name.trim().length >= 3 && form.value.name.trim().length <= 32
})

// Initialiser le formulaire
onMounted(() => {
  if (props.server) {
    form.value = {
      name: props.server.name,
      description: props.server.description || '',
      type: props.server.type || 'public'
    }
  }
})

// Soumission du formulaire
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  
  try {
    await emit('create', {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      type: form.value.type
    })
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  } finally {
    isLoading.value = false
  }
}
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
  max-width: 600px;
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
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
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
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  font-size: 1.5rem;
  color: #a0aec0;
  margin: 0;
}

/* Formulaire */
.modal-form {
  padding: 40px;
}

.form-group {
  margin-bottom: 32px;
}

.form-label {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.optional {
  color: #718096;
  font-weight: 400;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 20px 24px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 16px;
  color: white;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
}

.form-textarea {
  resize: none;
  min-height: 120px;
}

.char-counter {
  text-align: right;
  color: #718096;
  font-size: 1rem;
  margin-top: 8px;
}

/* Groupe de boutons radio */
.radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.radio-option {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-option:hover {
  border-color: #ec4899;
  background: #374151;
}

.radio-input {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  accent-color: #ec4899;
}

.radio-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.radio-description {
  font-size: 1rem;
  color: #a0aec0;
}

/* Boutons d'action */
.modal-actions {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.btn {
  flex: 1;
  padding: 20px 32px;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  
  .modal-form {
    padding: 30px 20px;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .radio-group {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
