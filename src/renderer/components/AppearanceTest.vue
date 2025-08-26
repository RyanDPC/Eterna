<template>
  <div class="appearance-test" :style="testStyle">
    <div class="test-header">
      <h2>🧪 Test des paramètres d'apparence</h2>
      <p>Ce composant change automatiquement selon vos paramètres !</p>
    </div>
    
    <div class="test-grid">
      <!-- Test de la couleur d'accent -->
      <div class="test-card accent-test">
        <h3>Couleur d'accent</h3>
        <div class="color-display" :style="{ backgroundColor: appStore.settings.accentColor }">
          {{ appStore.settings.accentColor }}
        </div>
      </div>
      
      <!-- Test de la transparence -->
      <div class="test-card transparency-test">
        <h3>Transparence</h3>
        <div class="transparency-display" :style="{ opacity: (100 - appStore.settings.transparency) / 100 }">
          {{ appStore.settings.transparency }}%
        </div>
      </div>
      
      <!-- Test du zoom -->
      <div class="test-card zoom-test">
        <h3>Zoom</h3>
        <div class="zoom-display" :style="{ transform: `scale(${appStore.settings.zoomLevel / 100})` }">
          {{ appStore.settings.zoomLevel }}%
        </div>
      </div>
      
      <!-- Test de la taille de police -->
      <div class="test-card font-test">
        <h3>Taille de police</h3>
        <div class="font-display" :style="{ fontSize: `${appStore.settings.fontSize}px` }">
          {{ appStore.settings.fontSize }}px
        </div>
      </div>
      
      <!-- Test du mode compact -->
      <div class="test-card compact-test">
        <h3>Mode compact</h3>
        <div class="compact-display" :class="{ 'compact': appStore.settings.compactMode }">
          <div class="test-item">Item 1</div>
          <div class="test-item">Item 2</div>
          <div class="test-item">Item 3</div>
        </div>
      </div>
      
      <!-- Test du flou d'arrière-plan -->
      <div class="test-card blur-test">
        <h3>Flou d'arrière-plan</h3>
        <div class="blur-display" :class="{ 'blurred': appStore.settings.backdropBlur }">
          {{ appStore.settings.backdropBlur ? 'Activé' : 'Désactivé' }}
        </div>
      </div>
    </div>
    
    <div class="test-info">
      <p><strong>💡 Conseil :</strong> Changez les paramètres dans l'onglet Apparence pour voir les effets en temps réel !</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

// Style dynamique basé sur les paramètres
const testStyle = computed(() => {
  const settings = appStore.settings
  
  return {
    fontSize: `${settings.fontSize || 16}px`,
    '--accent-color': settings.accentColor || '#5865f2',
    transform: `scale(${(settings.zoomLevel || 100) / 100})`,
    transformOrigin: 'top left'
  }
})
</script>

<style scoped>
.appearance-test {
  background: #2f3136;
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
  border: 2px solid #40444b;
  transition: all 0.3s ease;
}

.test-header {
  text-align: center;
  margin-bottom: 32px;
}

.test-header h2 {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(90deg, #fff, var(--accent-color));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.test-header p {
  color: #b9bbbe;
  font-size: 16px;
  margin: 0;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.test-card {
  background: #36393f;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #40444b;
  transition: all 0.3s ease;
}

.test-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: var(--accent-color);
}

.test-card h3 {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-align: center;
}

/* Test de couleur d'accent */
.color-display {
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-family: monospace;
  font-size: 18px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border: 3px solid #40444b;
  transition: all 0.3s ease;
}

.color-display:hover {
  transform: scale(1.05);
  border-color: var(--accent-color);
}

/* Test de transparence */
.transparency-display {
  height: 80px;
  background: var(--accent-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border: 3px solid #40444b;
  transition: all 0.3s ease;
}

/* Test de zoom */
.zoom-display {
  height: 80px;
  background: #57f287;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border: 3px solid #40444b;
  transform-origin: center;
  transition: all 0.3s ease;
}

/* Test de taille de police */
.font-display {
  height: 80px;
  background: #faa61a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  border: 3px solid #40444b;
  transition: all 0.3s ease;
}

/* Test de mode compact */
.compact-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compact-display.compact {
  gap: 6px;
}

.test-item {
  background: var(--accent-color);
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.compact-display.compact .test-item {
  padding: 8px 12px;
  font-size: 12px;
}

/* Test de flou d'arrière-plan */
.blur-display {
  height: 80px;
  background: rgba(88, 101, 242, 0.9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border: 3px solid #40444b;
  position: relative;
  transition: all 0.3s ease;
}

.blur-display.blurred::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 8px;
}

.blur-display.blurred {
  color: white;
  position: relative;
  z-index: 1;
}

.test-info {
  text-align: center;
  background: rgba(88, 101, 242, 0.1);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(88, 101, 242, 0.3);
}

.test-info p {
  color: #b9bbbe;
  font-size: 14px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .test-grid {
    grid-template-columns: 1fr;
  }
  
  .appearance-test {
    padding: 16px;
  }
}
</style>



