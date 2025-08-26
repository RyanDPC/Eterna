<template>
  <div class="test-api">
    <h3>Test API Electron</h3>
    <div class="status">
      <p>API disponible: {{ apiAvailable ? 'Oui' : 'Non' }}</p>
      <p>Fonctions disponibles: {{ availableFunctions.join(', ') }}</p>
    </div>
    <div class="actions">
      <button @click="testSave" class="btn">Test Sauvegarde</button>
      <button @click="testLoad" class="btn">Test Chargement</button>
      <button @click="testDelete" class="btn">Test Suppression</button>
    </div>
    <div class="results">
      <h4>Résultats des tests:</h4>
      <pre>{{ testResults }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const apiAvailable = ref(false)
const availableFunctions = ref([])
const testResults = ref('')

onMounted(() => {
  checkAPI()
})

const checkAPI = () => {
  if (window.electronAPI) {
    apiAvailable.value = true
    availableFunctions.value = Object.keys(window.electronAPI)
    console.log('API Electron disponible:', window.electronAPI)
  } else {
    apiAvailable.value = false
    availableFunctions.value = []
    console.log('API Electron non disponible')
  }
}

const testSave = async () => {
  try {
    if (window.electronAPI?.saveData) {
      const testData = { test: 'data', timestamp: new Date().toISOString() }
      const result = await window.electronAPI.saveData('test.json', JSON.stringify(testData))
      testResults.value += `\nSauvegarde: ${result ? 'Succès' : 'Échec'}`
    } else {
      testResults.value += '\nSauvegarde: API non disponible'
    }
  } catch (error) {
    testResults.value += `\nSauvegarde: Erreur - ${error.message}`
  }
}

const testLoad = async () => {
  try {
    if (window.electronAPI?.loadData) {
      const data = await window.electronAPI.loadData('test.json')
      testResults.value += `\nChargement: ${data ? 'Succès' : 'Échec'}`
      if (data) {
        testResults.value += `\nDonnées: ${data}`
      }
    } else {
      testResults.value += '\nChargement: API non disponible'
    }
  } catch (error) {
    testResults.value += `\nChargement: Erreur - ${error.message}`
  }
}

const testDelete = async () => {
  try {
    if (window.electronAPI?.deleteData) {
      const result = await window.electronAPI.deleteData('test.json')
      testResults.value += `\nSuppression: ${result ? 'Succès' : 'Échec'}`
    } else {
      testResults.value += '\nSuppression: API non disponible'
    }
  } catch (error) {
    testResults.value += `\nSuppression: Erreur - ${error.message}`
  }
}
</script>

<style scoped>
.test-api {
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px;
}

.status {
  margin: 10px 0;
}

.actions {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #2563eb;
}

.results {
  margin-top: 15px;
}

.results pre {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-size: 12px;
}
</style>




