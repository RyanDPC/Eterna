<template>
  <div class="appearance-demo" :style="demoStyle">
    <div class="demo-header">
      <h3>🎨 Démonstration en temps réel</h3>
      <p>Voyez vos changements d'apparence s'appliquer instantanément !</p>
    </div>
    
    <div class="demo-content">
      <!-- Aperçu des couleurs -->
      <div class="demo-section">
        <h4>Couleur d'accent</h4>
        <div class="color-preview" :style="{ backgroundColor: appStore.settings.accentColor }">
          <span class="color-hex">{{ appStore.settings.accentColor }}</span>
        </div>
      </div>
      
      <!-- Aperçu de la transparence -->
      <div class="demo-section">
        <h4>Transparence: {{ appStore.settings.transparency }}%</h4>
        <div class="transparency-preview" :style="{ opacity: (100 - appStore.settings.transparency) / 100 }">
          <span>Contenu avec transparence</span>
        </div>
      </div>
      
      <!-- Aperçu du zoom -->
      <div class="demo-section">
        <h4>Zoom: {{ appStore.settings.zoomLevel }}%</h4>
        <div class="zoom-preview" :style="{ transform: `scale(${appStore.settings.zoomLevel / 100})` }">
          <span>Texte redimensionné</span>
        </div>
      </div>
      
      <!-- Aperçu de la taille de police -->
      <div class="demo-section">
        <h4>Taille de police: {{ appStore.settings.fontSize }}px</h4>
        <div class="font-preview" :style="{ fontSize: `${appStore.settings.fontSize}px` }">
          <span>Ce texte change de taille</span>
        </div>
      </div>
      
      <!-- Aperçu du mode compact -->
      <div class="demo-section">
        <h4>Mode compact: {{ appStore.settings.compactMode ? 'Activé' : 'Désactivé' }}</h4>
        <div class="compact-preview" :class="{ 'compact': appStore.settings.compactMode }">
          <div class="demo-item">Élément 1</div>
          <div class="demo-item">Élément 2</div>
          <div class="demo-item">Élément 3</div>
        </div>
      </div>
      
      <!-- Aperçu du flou d'arrière-plan -->
      <div class="demo-section">
        <h4>Flou d'arrière-plan: {{ appStore.settings.backdropBlur ? 'Activé' : 'Désactivé' }}</h4>
        <div class="blur-preview" :class="{ 'blurred': appStore.settings.backdropBlur }">
          <span>Arrière-plan avec flou</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

// Style dynamique pour la démonstration
const demoStyle = computed(() => {
  const settings = appStore.settings
  
  return {
    fontSize: `${settings.fontSize || 16}px`,
    '--accent-color': settings.accentColor || '#5865f2',
    '--accent-color-hover': settings.accentColor ? `${settings.accentColor}dd` : '#5865f2dd',
    '--accent-color-light': settings.accentColor ? `${settings.accentColor}33` : '#5865f233'
  }
})
</script>

<style scoped>
.appearance-demo {
  background: #40444b;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #40444b;
  transition: all 0.3s ease;
}

.demo-header {
  text-align: center;
  margin-bottom: 24px;
}

.demo-header h3 {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.demo-header p {
  color: #b9bbbe;
  font-size: 14px;
  margin: 0;
}

.demo-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.demo-section {
  background: #36393f;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #40444b;
}

.demo-section h4 {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

/* Aperçu des couleurs */
.color-preview {
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #40444b;
}

.color-hex {
  color: white;
  font-weight: 600;
  font-family: monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Aperçu de la transparence */
.transparency-preview {
  height: 60px;
  background: var(--accent-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

/* Aperçu du zoom */
.zoom-preview {
  height: 60px;
  background: #5865f2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  transform-origin: center;
}

/* Aperçu de la taille de police */
.font-preview {
  height: 60px;
  background: #57f287;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

/* Aperçu du mode compact */
.compact-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compact-preview.compact {
  gap: 4px;
}

.demo-item {
  background: #5865f2;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.compact-preview.compact .demo-item {
  padding: 4px 8px;
  font-size: 11px;
}

/* Aperçu du flou d'arrière-plan */
.blur-preview {
  height: 60px;
  background: rgba(88, 101, 242, 0.8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
}

.blur-preview.blurred::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

.blur-preview.blurred span {
  position: relative;
  z-index: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-content {
    grid-template-columns: 1fr;
  }
}
</style>



