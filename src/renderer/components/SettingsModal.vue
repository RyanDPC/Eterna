<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content settings-modal-discord" @click.stop>
      <!-- Header compact -->
      <div class="modal-header-discord">
        <h3 class="modal-title-discord">{{ tLocal('settings.title') }}</h3>
        <button @click="closeModal" class="modal-close-btn-discord">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Contenu principal -->
      <div class="modal-body-discord">
        <!-- Sidebar compacte -->
        <div class="settings-sidebar-discord">
          <nav class="sidebar-nav-discord">
            <div class="nav-section-discord">
              <span class="nav-section-title-discord">COMPTE UTILISATEUR</span>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'account' }" @click="activeSection = 'account'">
                <span class="nav-icon-discord">👤</span>
                <span class="nav-label-discord">{{ tLocal('settings.myAccount') }}</span>
              </div>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'profile' }" @click="activeSection = 'profile'">
                <span class="nav-icon-discord">🖼️</span>
                <span class="nav-label-discord">{{ tLocal('settings.profile') }}</span>
              </div>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'security' }" @click="activeSection = 'security'">
                <span class="nav-icon-discord">🛡️</span>
                <span class="nav-label-discord">{{ tLocal('settings.security') }}</span>
              </div>
            </div>
            
            <div class="nav-section-discord">
              <span class="nav-section-title-discord">PARAMÈTRES DE L'APPLI</span>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'appearance' }" @click="activeSection = 'appearance'">
                <span class="nav-icon-discord">🎨</span>
                <span class="nav-label-discord">{{ tLocal('settings.appearance') }}</span>
              </div>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'notifications' }" @click="activeSection = 'notifications'">
                <span class="nav-icon-discord">🔔</span>
                <span class="nav-label-discord">{{ tLocal('settings.notifications') }}</span>
              </div>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'voice' }" @click="activeSection = 'voice'">
                <span class="nav-icon-discord">🎤</span>
                <span class="nav-label-discord">{{ tLocal('settings.voice') }}</span>
              </div>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'language' }" @click="activeSection = 'language'">
                <span class="nav-icon-discord">🌐</span>
                <span class="nav-label-discord">{{ tLocal('settings.language') }}</span>
              </div>
              <div class="nav-item-discord" :class="{ 'active': activeSection === 'logout' }" @click="handleLogout">
                <span class="nav-icon-discord">🚪</span>
                <span class="nav-label-discord">{{ tLocal('settings.logout') }}</span>
              </div>
            </div>
          </nav>
        </div>
        
        <!-- Contenu des paramètres -->
        <div class="settings-content-discord">
          <!-- Mon compte -->
          <div v-if="activeSection === 'account'" class="settings-panel-discord">
            <h2 class="panel-title-discord">{{ tLocal('settings.myAccount') }}</h2>
            
            <div class="setting-group-discord">
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Nom d'utilisateur</span>
                  <span class="setting-description-discord">Votre nom d'utilisateur public</span>
                </div>
                <div class="setting-control-discord">
                  <span class="setting-value-discord">{{ authStore.currentUser?.username }}</span>
                  <button class="btn-edit-discord">Modifier</button>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Email</span>
                  <span class="setting-description-discord">Adresse email de votre compte</span>
                </div>
                <div class="setting-control-discord">
                  <span class="setting-value-discord">{{ authStore.currentUser?.email }}</span>
                  <button class="btn-edit-discord">Modifier</button>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Membre depuis</span>
                  <span class="setting-description-discord">Date de création de votre compte</span>
                </div>
                <div class="setting-control-discord">
                  <span class="setting-value-discord">{{ formatDate(authStore.currentUser?.createdAt) }}</span>
                </div>
              </div>
            </div>
            
                         <!-- Paramètres vidéo -->
             <div class="setting-group-discord">
               <div class="setting-header-discord">
                 <h3 class="group-title-discord">📹 Paramètres vidéo</h3>
                 <button @click="refreshVideoDevices" class="btn-refresh-discord" title="Rafraîchir les périphériques">
                   🔄
                 </button>
               </div>
              
              <!-- Caméra -->
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Caméra</span>
                  <span class="setting-description-discord">Sélectionner votre caméra</span>
                </div>
                <div class="setting-control-discord">
                                     <div class="device-selection-discord">
                     <select 
                       v-model="appStore.settings.videoDevice"
                       @change="handleVideoDeviceChange"
                       class="select-discord"
                     >
                       <option value="" disabled>Sélectionner une caméra</option>
                       <option v-for="device in availableVideoDevices" :key="device.deviceId" :value="device.deviceId">
                         {{ device.label }}
                       </option>
                     </select>
                     <div v-if="appStore.settings.videoDevice" class="selected-device-discord">
                       ✅ {{ getDeviceLabel(appStore.settings.videoDevice, availableVideoDevices) }}
                     </div>
                   </div>
                </div>
              </div>
              
              <!-- Qualité vidéo -->
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Qualité vidéo</span>
                  <span class="setting-description-discord">Définir la résolution vidéo</span>
                </div>
                <div class="setting-control-discord">
                  <select 
                    v-model="appStore.settings.videoQuality"
                    @change="appStore.updateSetting('videoQuality', $event.target.value)"
                    class="select-discord"
                  >
                    <option value="low">Faible (480p)</option>
                    <option value="medium">Moyenne (720p)</option>
                    <option value="high">Élevée (1080p)</option>
                    <option value="ultra">Ultra (4K)</option>
                  </select>
                </div>
              </div>
              
              <!-- FPS vidéo -->
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Images par seconde</span>
                  <span class="setting-description-discord">Fluidité de la vidéo</span>
                </div>
                <div class="setting-control-discord">
                  <select 
                    v-model="appStore.settings.videoFPS"
                    @change="appStore.updateSetting('videoFPS', $event.target.value)"
                    class="select-discord"
                  >
                    <option value="15">15 FPS</option>
                    <option value="24">24 FPS</option>
                    <option value="30">30 FPS</option>
                    <option value="60">60 FPS</option>
                  </select>
                </div>
              </div>
              
              <!-- Test caméra -->
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Test caméra</span>
                  <span class="setting-description-discord">Vérifiez votre caméra</span>
                </div>
                <div class="setting-control-discord">
                  <div class="video-test-controls-discord">
                    <button @click="startVideoTest" class="btn-test-discord">📹 Démarrer</button>
                    <button v-if="isVideoTesting" @click="stopVideoTest" class="btn-stop-discord">⏹️ Arrêter</button>
                  </div>
                  <div v-if="isVideoTesting" class="video-preview-discord">
                    <video ref="videoPreview" autoplay muted class="video-element-discord"></video>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions rapides -->
            <div class="setting-group-discord">
              <h3 class="group-title-discord">🚀 Actions rapides</h3>
              
              <div class="quick-actions-discord">
                <button @click="resetAudioSettings" class="btn-reset-discord">🔄 Reset Audio</button>
                <button @click="resetVideoSettings" class="btn-reset-discord">🔄 Reset Vidéo</button>
                <button @click="testAllDevices" class="btn-test-all-discord">🧪 Test Complet</button>
                <button @click="exportSettings" class="btn-export-discord">💾 Exporter</button>
              </div>
            </div>
          </div>
          
          <!-- Voix & Vidéo -->
          <div v-if="activeSection === 'voice'" class="settings-panel-discord">
            <h2 class="panel-title-discord">🎤 Voix & Vidéo</h2>
            
            <!-- Statut de connexion -->
            <div class="connection-status-discord">
              <div class="status-indicator-discord" :class="{ 'connected': appStore.voiceStatus.isConnected }">
                <span class="status-dot-discord"></span>
                <span class="status-text-discord">
                  {{ appStore.voiceStatus.isConnected ? 'Connecté au vocal' : 'Non connecté' }}
                </span>
              </div>
              <div v-if="appStore.voiceStatus.currentVoiceChannel" class="current-channel-discord">
                📍 Canal: {{ appStore.voiceStatus.currentVoiceChannel.name }}
              </div>
            </div>
            
                         <!-- Périphérique d'entrée -->
             <div class="setting-group-discord">
               <div class="setting-header-discord">
                 <h3 class="group-title-discord">Périphérique d'entrée</h3>
                 <button @click="refreshAudioDevices" class="btn-refresh-discord" title="Rafraîchir les périphériques">
                   🔄
                 </button>
               </div>
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Microphone</span>
                  <span class="setting-description-discord">Sélectionner votre périphérique d'enregistrement</span>
                </div>
                <div class="setting-control-discord">
                                     <div class="device-selection-discord">
                     <select 
                       v-model="appStore.settings.inputDevice"
                       @change="handleInputDeviceChange"
                       class="select-discord"
                     >
                       <option value="" disabled>Sélectionner un périphérique</option>
                       <option v-for="device in availableInputDevices" :key="device.deviceId" :value="device.deviceId">
                         {{ device.label }}
                       </option>
                     </select>
                     <div v-if="appStore.settings.inputDevice" class="selected-device-discord">
                       ✅ {{ getDeviceLabel(appStore.settings.inputDevice, availableInputDevices) }}
                     </div>
                   </div>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Volume d'entrée</span>
                  <span class="setting-description-discord">Ajuster le niveau de votre microphone</span>
                </div>
                <div class="setting-control-discord">
                  <div class="volume-control-discord">
                    <input 
                      type="range" 
                      v-model="appStore.settings.inputVolume" 
                      min="0" 
                      max="100" 
                      @input="handleInputVolumeChange"
                      class="slider-discord"
                    />
                    <span class="volume-display-discord">{{ appStore.settings.inputVolume }}%</span>
                  </div>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Test du micro</span>
                  <span class="setting-description-discord">Vérifiez votre configuration audio</span>
                </div>
                <div class="setting-control-discord">
                  <div class="test-controls-discord">
                    <button 
                      @click="startMicrophoneTest" 
                      :disabled="isRecordingTest"
                      class="btn-test-discord"
                      :class="{ 'recording': isRecordingTest }"
                    >
                      {{ isRecordingTest ? '🔴 Enregistrement...' : '▶️ Démarrer le test' }}
                    </button>
                    <button 
                      v-if="testAudioUrl"
                      @click="playTestAudio" 
                      class="btn-play-discord"
                    >
                      🔊 Écouter
                    </button>
                    <button 
                      v-if="isRecordingTest"
                      @click="stopMicrophoneTest" 
                      class="btn-stop-discord"
                    >
                      ⏹️ Arrêter
                    </button>
                  </div>
                  
                  <!-- Indicateur de niveau en temps réel -->
                  <div class="level-meter-discord">
                    <div class="level-label-discord">Niveau: {{ Math.round(inputLevel) }}%</div>
                    <div class="level-bars-discord">
                      <div 
                        v-for="i in 10" 
                        :key="i"
                        class="level-bar-discord"
                        :class="{ 
                          'active': inputLevel >= i * 10,
                          'warning': inputLevel >= 80,
                          'danger': inputLevel >= 95
                        }"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- Qualité audio -->
                  <div class="audio-quality-discord">
                    <span class="quality-label-discord">Qualité: {{ getAudioQualityLabel() }}</span>
                    <div class="quality-indicator-discord" :class="getAudioQualityClass()">
                      {{ getAudioQualityIcon() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
                         <!-- Périphérique de sortie -->
             <div class="setting-group-discord">
               <div class="setting-header-discord">
                 <h3 class="group-title-discord">Périphérique de sortie</h3>
                 <button @click="refreshAudioDevices" class="btn-refresh-discord" title="Rafraîchir les périphériques">
                   🔄
                 </button>
               </div>
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Haut-parleurs</span>
                  <span class="setting-description-discord">Sélectionner votre périphérique de sortie</span>
                </div>
                <div class="setting-control-discord">
                                     <div class="device-selection-discord">
                     <select 
                       v-model="appStore.settings.outputDevice"
                       @change="handleOutputDeviceChange"
                       class="select-discord"
                     >
                       <option value="" disabled>Sélectionner un périphérique</option>
                       <option v-for="device in availableOutputDevices" :key="device.deviceId" :value="device.deviceId">
                         {{ device.label }}
                       </option>
                     </select>
                     <div v-if="appStore.settings.outputDevice" class="selected-device-discord">
                       ✅ {{ getDeviceLabel(appStore.settings.outputDevice, availableOutputDevices) }}
                     </div>
                   </div>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Volume de sortie</span>
                  <span class="setting-description-discord">Ajuster le volume audio global</span>
                </div>
                <div class="setting-control-discord">
                  <div class="volume-control-discord">
                    <input 
                      type="range" 
                      v-model="appStore.settings.outputVolume" 
                      min="0" 
                      max="100" 
                      @input="handleOutputVolumeChange"
                      class="slider-discord"
                    />
                    <span class="volume-display-discord">{{ appStore.settings.outputVolume }}%</span>
                  </div>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Test audio</span>
                  <span class="setting-description-discord">Vérifiez votre sortie audio</span>
                </div>
                <div class="setting-control-discord">
                  <div class="test-audio-controls-discord">
                    <button @click="playTestTone" class="btn-test-discord">🔊 Tester</button>
                    <button @click="playTestTone('high')" class="btn-test-discord">🎵 Aigu</button>
                    <button @click="playTestTone('low')" class="btn-test-discord">🥁 Grave</button>
                  </div>
                  
                  <!-- Test de latence -->
                  <div class="latency-test-discord">
                    <button @click="testLatency" class="btn-latency-discord">⏱️ Test Latence</button>
                    <span v-if="latencyResult" class="latency-result-discord">
                      Latence: {{ latencyResult }}ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Paramètres avancés -->
            <div class="setting-group-discord">
              <h3 class="group-title-discord">⚙️ Paramètres avancés</h3>
              
              <!-- Qualité audio -->
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Qualité audio</span>
                  <span class="setting-description-discord">Définir la qualité de l'audio</span>
                </div>
                <div class="setting-control-discord">
                  <select 
                    v-model="appStore.settings.audioQuality"
                    @change="appStore.updateSetting('audioQuality', $event.target.value)"
                    class="select-discord"
                  >
                    <option value="low">Faible (64kbps)</option>
                    <option value="medium">Moyenne (128kbps)</option>
                    <option value="high">Élevée (256kbps)</option>
                    <option value="ultra">Ultra (320kbps)</option>
                  </select>
                </div>
              </div>
              
              <!-- Fréquence d'échantillonnage -->
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Fréquence d'échantillonnage</span>
                  <span class="setting-description-discord">Qualité de la numérisation audio</span>
                </div>
                <div class="setting-control-discord">
                  <select 
                    v-model="appStore.settings.sampleRate"
                    @change="appStore.updateSetting('sampleRate', $event.target.value)"
                    class="select-discord"
                  >
                    <option value="8000">8 kHz (Téléphone)</option>
                    <option value="16000">16 kHz (Voix)</option>
                    <option value="22050">22.05 kHz (Radio)</option>
                    <option value="44100">44.1 kHz (CD)</option>
                    <option value="48000">48 kHz (Professionnel)</option>
                  </select>
                </div>
              </div>
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Suppression de bruit</span>
                  <span class="setting-description-discord">Réduire le bruit de fond</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.noiseSuppression"
                      @change="appStore.updateSetting('noiseSuppression', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Écho cancellation</span>
                  <span class="setting-description-discord">Éliminer la réverbération</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.echoCancellation"
                      @change="appStore.updateSetting('echoCancellation', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Gain automatique</span>
                  <span class="setting-description-discord">Ajustement automatique du volume</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.autoGainControl"
                      @change="appStore.updateSetting('autoGainControl', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Langue -->
          <div v-if="activeSection === 'language'" class="settings-panel-discord">
            <h2 class="panel-title-discord">Langue & Localisation</h2>
            
            <div class="setting-group-discord">
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Langue de l'interface</span>
                  <span class="setting-description-discord">Choisir la langue d'affichage</span>
                </div>
                <div class="setting-control-discord">
                  <select 
                    v-model="appStore.settings.language"
                    @change="handleLanguageChange($event.target.value)"
                    class="select-discord"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Format de date</span>
                  <span class="setting-description-discord">Affichage des dates</span>
                </div>
                <div class="setting-control-discord">
                  <select 
                    v-model="appStore.settings.dateFormat"
                    @change="appStore.updateSetting('dateFormat', $event.target.value)"
                    class="select-discord"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Apparence -->
          <div v-if="activeSection === 'appearance'" class="settings-panel-discord">
            <h2 class="panel-title-discord">{{ tLocal('settings.appearance') }}</h2>
            
            <!-- Thème principal -->
            <div class="setting-group-discord">
              <h3 class="setting-group-title-discord">Thème</h3>
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">{{ tLocal('settings.theme') }}</span>
                  <span class="setting-description-discord">Sélectionnez le thème de votre choix pour Eterna</span>
                </div>
                <div class="setting-control-discord">
                  <div class="theme-grid-discord">
                    <div 
                      @click="appStore.updateSetting('theme', 'dark')"
                      :class="['theme-card-discord', { 'active': appStore.settings.theme === 'dark' }]"
                    >
                      <div class="theme-preview-discord dark-preview">
                        <div class="preview-header-discord"></div>
                        <div class="preview-content-discord">
                          <div class="preview-sidebar-discord"></div>
                          <div class="preview-main-discord"></div>
                        </div>
                      </div>
                      <span class="theme-name-discord">{{ tLocal('settings.darkMode') }}</span>
                    </div>
                    
                    <div 
                      @click="appStore.updateSetting('theme', 'light')"
                      :class="['theme-card-discord', { 'active': appStore.settings.theme === 'light' }]"
                    >
                      <div class="theme-preview-discord light-preview">
                        <div class="preview-header-discord"></div>
                        <div class="preview-content-discord">
                          <div class="preview-sidebar-discord"></div>
                          <div class="preview-main-discord"></div>
                        </div>
                      </div>
                      <span class="theme-name-discord">{{ tLocal('settings.lightMode') }}</span>
                    </div>
                    
                    <div 
                      @click="appStore.updateSetting('theme', 'auto')"
                      :class="['theme-card-discord', { 'active': appStore.settings.theme === 'auto' }]"
                    >
                      <div class="theme-preview-discord auto-preview">
                        <div class="preview-header-discord"></div>
                        <div class="preview-content-discord">
                          <div class="preview-sidebar-discord"></div>
                          <div class="preview-main-discord"></div>
                        </div>
                      </div>
                      <span class="theme-name-discord">{{ tLocal('settings.autoTheme') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Couleur d'accent -->
            <div class="setting-group-discord">
              <h3 class="setting-group-title-discord">Couleur d'accent</h3>
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Couleur principale</span>
                  <span class="setting-description-discord">Personnalisez la couleur principale de l'interface</span>
                </div>
                <div class="setting-control-discord">
                  <div class="color-grid-discord">
                    <div 
                      v-for="color in accentColors" 
                      :key="color.name"
                      @click="appStore.updateSetting('accentColor', color.value)"
                      :class="['color-option-discord', { 'active': appStore.settings.accentColor === color.value }]"
                      :style="{ backgroundColor: color.value }"
                      :title="color.name"
                    >
                      <svg v-if="appStore.settings.accentColor === color.value" class="color-check-discord" fill="white" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interface utilisateur -->
            <div class="setting-group-discord">
              <h3 class="setting-group-title-discord">Interface utilisateur</h3>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Taille de la police</span>
                  <span class="setting-description-discord">Ajustez la taille du texte dans l'application</span>
                </div>
                <div class="setting-control-discord">
                  <div class="size-options-discord">
                    <button 
                      v-for="size in fontSizes"
                      :key="size.value"
                      @click="appStore.updateSetting('fontSize', size.value)"
                      :class="['size-btn-discord', { 'active': appStore.settings.fontSize === size.value }]"
                    >
                      {{ size.label }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Zoom de l'interface</span>
                  <span class="setting-description-discord">Modifiez la taille générale de l'interface</span>
                </div>
                <div class="setting-control-discord">
                  <div class="zoom-control-discord">
                    <input 
                      type="range" 
                      min="75" 
                      max="150" 
                      step="25"
                      v-model="appStore.settings.zoomLevel"
                      @input="appStore.updateSetting('zoomLevel', $event.target.value)"
                      class="zoom-slider-discord"
                    />
                    <span class="zoom-value-discord">{{ appStore.settings.zoomLevel }}%</span>
                  </div>
                </div>
              </div>

              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Animations réduites</span>
                  <span class="setting-description-discord">Réduire les animations pour améliorer les performances</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.reducedMotion"
                      @change="appStore.updateSetting('reducedMotion', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Mode compact</span>
                  <span class="setting-description-discord">Afficher plus d'informations en réduisant l'espacement</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.compactMode"
                      @change="appStore.updateSetting('compactMode', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Personnalisation avancée -->
            <div class="setting-group-discord">
              <h3 class="setting-group-title-discord">Personnalisation avancée</h3>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Transparence</span>
                  <span class="setting-description-discord">Ajustez la transparence des éléments de l'interface</span>
                </div>
                <div class="setting-control-discord">
                  <div class="transparency-control-discord">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      v-model="appStore.settings.transparency"
                      @input="appStore.updateSetting('transparency', $event.target.value)"
                      class="transparency-slider-discord"
                    />
                    <span class="transparency-value-discord">{{ appStore.settings.transparency }}%</span>
                  </div>
                </div>
              </div>

              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Flou d'arrière-plan</span>
                  <span class="setting-description-discord">Appliquer un effet de flou aux arrière-plans</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.backdropBlur"
                      @change="appStore.updateSetting('backdropBlur', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Afficher les avatars animés</span>
                  <span class="setting-description-discord">Activer l'animation des avatars GIF</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.animatedAvatars"
                      @change="appStore.updateSetting('animatedAvatars', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Aperçu des emoji</span>
                  <span class="setting-description-discord">Afficher un aperçu agrandi au survol des emoji</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.emojiPreview"
                      @change="appStore.updateSetting('emojiPreview', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Aperçu en temps réel -->
            <div class="setting-group-discord">
              <h3 class="setting-group-title-discord">Aperçu</h3>
              <div class="appearance-preview-discord">
                <div class="preview-container-discord" :style="previewStyle">
                  <div class="preview-chat-discord">
                    <div class="preview-message-discord">
                      <div class="preview-avatar-discord"></div>
                      <div class="preview-message-content-discord">
                        <span class="preview-username-discord">{{ authStore.currentUser?.username }}</span>
                        <span class="preview-text-discord">Voici un aperçu de votre personnalisation !</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 🎨 DÉMONSTRATION COMPLÈTE EN TEMPS RÉEL -->
            <div class="setting-group-discord">
              <h3 class="setting-group-title-discord">Démonstration complète</h3>
              <div class="demo-placeholder">
                <p>🎨 Les changements s'appliquent automatiquement à toute l'interface !</p>
                <p>✅ Modifiez les paramètres ci-dessus pour voir les effets en temps réel.</p>
              </div>
            </div>
          </div>
          
          <!-- Notifications -->
          <div v-if="activeSection === 'notifications'" class="settings-panel-discord">
            <h2 class="panel-title-discord">Notifications</h2>
            
            <div class="setting-group-discord">
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Notifications push</span>
                  <span class="setting-description-discord">Recevoir des notifications sur votre appareil</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.pushNotifications"
                      @change="appStore.updateSetting('pushNotifications', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>
              
              <div class="setting-item-discord">
                <div class="setting-info-discord">
                  <span class="setting-label-discord">Sons de notification</span>
                  <span class="setting-description-discord">Jouer des sons pour les notifications</span>
                </div>
                <div class="setting-control-discord">
                  <label class="toggle-discord">
                    <input 
                      type="checkbox" 
                      v-model="appStore.settings.notificationSounds"
                      @change="appStore.updateSetting('notificationSounds', $event.target.checked)"
                    />
                    <span class="toggle-slider-discord"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section par défaut -->
          <div v-if="!activeSection" class="settings-panel-discord">
            <h2 class="panel-title-discord">Bienvenue dans les paramètres</h2>
            <p class="panel-description-discord">Sélectionnez une catégorie dans le menu de gauche pour commencer la configuration</p>
            
            <div class="welcome-grid-discord">
              <div class="welcome-card-discord" @click="activeSection = 'account'">
                <div class="welcome-icon-discord">👤</div>
                <h3>Mon Compte</h3>
                <p>Gérez vos informations personnelles</p>
              </div>
              <div class="welcome-card-discord" @click="activeSection = 'voice'">
                <div class="welcome-icon-discord">🎤</div>
                <h3>Voix & Vidéo</h3>
                <p>Configurez votre audio</p>
              </div>
              <div class="welcome-card-discord" @click="activeSection = 'appearance'">
                <div class="welcome-icon-discord">🎨</div>
                <h3>Apparence</h3>
                <p>Personnalisez l'interface</p>
              </div>
            </div>
            
            <!-- 🧪 COMPOSANT DE TEST D'APPEARANCE EN PAGE D'ACCUEIL -->
            <div class="welcome-test-section">
              <h3>🧪 Test rapide de l'apparence</h3>
              <p>Les paramètres d'apparence s'appliquent automatiquement à toute l'interface ! 🎨</p>
              <div class="test-info-card">
                <p><strong>✅ Thème :</strong> {{ appStore.settings.theme || 'dark' }}</p>
                <p><strong>🎯 Couleur d'accent :</strong> {{ appStore.settings.accentColor || '#5865f2' }}</p>
                <p><strong>📏 Taille police :</strong> {{ appStore.settings.fontSize || '16' }}px</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'
import { useI18n } from '../i18n'
import { translations } from '../i18n'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Stores
const authStore = useAuthStore()
const appStore = useAppStore()

// Internationalisation
const { t, currentLanguage, setLanguage } = useI18n()

// Référence réactive pour forcer la mise à jour
const forceUpdate = ref(0)

// Fonction de traduction locale qui utilise la langue du store (réactive)
const tLocal = (key) => {
  // Utiliser forceUpdate.value pour créer une dépendance réactive
  forceUpdate.value
  
  const lang = appStore.settings.language || 'fr'
  const keys = key.split('.')
  let value = translations[lang]
  
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k]
    } else {
      // Fallback vers le français si la traduction n'existe pas
      value = translations.fr
      for (const fallbackKey of keys) {
        if (value && value[fallbackKey] !== undefined) {
          value = value[fallbackKey]
        } else {
          return key // Retourner la clé si aucune traduction n'est trouvée
        }
      }
      break
    }
  }
  
  return value || key
}

// Fonction pour changer la langue
const handleLanguageChange = (language) => {
  appStore.updateSetting('language', language)
  // Forcer la mise à jour en incrémentant le compteur
  forceUpdate.value++
}

// État local
const activeSection = ref('')

// État pour les tests audio
const isRecordingTest = ref(false)
const testAudioUrl = ref(null)
const inputLevel = ref(0)
const mediaRecorder = ref(null)
const audioChunks = ref([])
const audioContext = ref(null)
const analyser = ref(null)
const microphone = ref(null)

// Périphériques audio et vidéo disponibles
const availableInputDevices = ref([])
const availableOutputDevices = ref([])
const availableVideoDevices = ref([])

// État pour les tests vidéo
const isVideoTesting = ref(false)
const videoPreview = ref(null)

// État pour les tests de latence
const latencyResult = ref(null)

// Méthodes
const closeModal = () => {
  emit('close')
  activeSection.value = ''
}

const handleLogout = () => {
  authStore.logout()
  closeModal()
}

const resetSettings = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
    appStore.resetSettings()
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Fonctions pour la gestion audio
const refreshAudioDevices = async () => {
  try {
    // Demander d'abord la permission d'accès aux médias
    await navigator.mediaDevices.getUserMedia({ audio: true })
    
    const devices = await navigator.mediaDevices.enumerateDevices()
    
    // Périphériques d'entrée
    availableInputDevices.value = devices
      .filter(device => device.kind === 'audioinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${device.deviceId.slice(0, 8)}...`
      }))
    
    // Périphériques de sortie
    availableOutputDevices.value = devices
      .filter(device => device.kind === 'audiooutput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Haut-parleurs ${device.deviceId.slice(0, 8)}...`
      }))
    
         // Ajouter une option par défaut si aucun périphérique n'est trouvé
     if (availableInputDevices.value.length === 0) {
       availableInputDevices.value.push({
         deviceId: 'default',
         label: 'Microphone par défaut'
       })
     }
     
     if (availableOutputDevices.value.length === 0) {
       availableOutputDevices.value.push({
         deviceId: 'default',
         label: 'Haut-parleurs par défaut'
       })
     }
     
           // Définir automatiquement le premier périphérique trouvé comme valeur par défaut
      if (availableInputDevices.value.length > 0 && (!appStore.settings.inputDevice || appStore.settings.inputDevice === '')) {
        appStore.updateSetting('inputDevice', availableInputDevices.value[0].deviceId)
      }
      
      if (availableOutputDevices.value.length > 0 && (!appStore.settings.outputDevice || appStore.settings.outputDevice === '')) {
        appStore.updateSetting('outputDevice', availableOutputDevices.value[0].deviceId)
      }
    
    console.log('🎤 Périphériques audio trouvés:', {
      input: availableInputDevices.value.length,
      output: availableOutputDevices.value.length
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des périphériques audio:', error)
    // Ajouter des options par défaut en cas d'erreur
    availableInputDevices.value = [{
      deviceId: 'default',
      label: 'Microphone par défaut'
    }]
    availableOutputDevices.value = [{
      deviceId: 'default',
      label: 'Haut-parleurs par défaut'
    }]
  }
}

const refreshVideoDevices = async () => {
  try {
    // Demander d'abord la permission d'accès aux médias
    await navigator.mediaDevices.getUserMedia({ video: true })
    
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableVideoDevices.value = devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Caméra ${device.deviceId.slice(0, 8)}...`
      }))
    
         // Ajouter une option par défaut si aucune caméra n'est trouvée
     if (availableVideoDevices.value.length === 0) {
       availableVideoDevices.value.push({
         deviceId: 'default',
         label: 'Caméra par défaut'
       })
     }
     
           // Définir automatiquement la première caméra trouvée comme valeur par défaut
      if (availableVideoDevices.value.length > 0 && (!appStore.settings.videoDevice || appStore.settings.videoDevice === '')) {
        appStore.updateSetting('videoDevice', availableVideoDevices.value[0].deviceId)
      }
    
    console.log('📹 Périphériques vidéo trouvés:', availableVideoDevices.value.length)
    
  } catch (error) {
    console.error('Erreur lors de la récupération des périphériques vidéo:', error)
    // Ajouter une option par défaut en cas d'erreur
    availableVideoDevices.value = [{
      deviceId: 'default',
      label: 'Caméra par défaut'
    }]
  }
}

const handleInputDeviceChange = (deviceId) => {
  appStore.updateSetting('inputDevice', deviceId)
  startAudioLevelMonitoring()
}

const handleOutputDeviceChange = (deviceId) => {
  appStore.updateSetting('outputDevice', deviceId)
}

const handleVideoDeviceChange = (deviceId) => {
  appStore.updateSetting('videoDevice', deviceId)
  if (isVideoTesting.value) {
    stopVideoTest()
    startVideoTest()
  }
}

const handleInputVolumeChange = (volume) => {
  appStore.updateSetting('inputVolume', parseInt(volume))
}

const handleOutputVolumeChange = (volume) => {
  appStore.updateSetting('outputVolume', parseInt(volume))
}

const startAudioLevelMonitoring = async () => {
  try {
    if (microphone.value) {
      microphone.value.getTracks().forEach(track => track.stop())
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: appStore.settings.inputDevice,
        echoCancellation: appStore.settings.echoCancellation,
        noiseSuppression: appStore.settings.noiseSuppression,
        autoGainControl: appStore.settings.autoGainControl
      }
    })
    
    microphone.value = stream
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    const source = audioContext.value.createMediaStreamSource(stream)
    source.connect(analyser.value)
    
    analyser.value.fftSize = 256
    const bufferLength = analyser.value.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const updateLevel = () => {
      if (analyser.value && !isRecordingTest.value) {
        analyser.value.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / bufferLength
        inputLevel.value = Math.round((average / 255) * 100)
        requestAnimationFrame(updateLevel)
      }
    }
    
    updateLevel()
  } catch (error) {
    console.error('Erreur lors du démarrage de la surveillance audio:', error)
  }
}

const startMicrophoneTest = async () => {
  try {
    isRecordingTest.value = true
    audioChunks.value = []
    
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: appStore.settings.inputDevice,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    })
    
    mediaRecorder.value = new MediaRecorder(stream)
    
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }
    
    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
      testAudioUrl.value = URL.createObjectURL(audioBlob)
      stream.getTracks().forEach(track => track.stop())
    }
    
    mediaRecorder.value.start()
    
    // Arrêter automatiquement après 5 secondes
    setTimeout(() => {
      if (isRecordingTest.value) {
        stopMicrophoneTest()
      }
    }, 5000)
    
  } catch (error) {
    console.error('Erreur lors du test du microphone:', error)
    isRecordingTest.value = false
  }
}

const stopMicrophoneTest = () => {
  if (mediaRecorder.value && isRecordingTest.value) {
    mediaRecorder.value.stop()
    isRecordingTest.value = false
  }
}

const playTestAudio = () => {
  if (testAudioUrl.value) {
    const audio = new Audio(testAudioUrl.value)
    // Vérifier que le volume est valide
    const volume = appStore.settings.outputVolume || 50
    audio.volume = Math.max(0, Math.min(1, volume / 100))
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error)
    })
  }
}

// Fonction pour jouer différents tons de test (remplace l'ancienne version)

// Fonctions pour la qualité audio
const getAudioQualityLabel = () => {
  const quality = appStore.settings.audioQuality || 'medium'
  const labels = {
    low: 'Faible',
    medium: 'Moyenne', 
    high: 'Élevée',
    ultra: 'Ultra'
  }
  return labels[quality] || 'Moyenne'
}

const getAudioQualityClass = () => {
  const quality = appStore.settings.audioQuality || 'medium'
  return `quality-${quality}`
}

const getAudioQualityIcon = () => {
  const quality = appStore.settings.audioQuality || 'medium'
  const icons = {
    low: '🔴',
    medium: '🟡',
    high: '🟢', 
    ultra: '💎'
  }
  return icons[quality] || '🟡'
}

// Fonctions pour les tests vidéo
const startVideoTest = async () => {
  try {
    isVideoTesting.value = true
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: appStore.settings.videoDevice,
        width: { ideal: getVideoWidth() },
        height: { ideal: getVideoHeight() },
        frameRate: { ideal: parseInt(appStore.settings.videoFPS) || 30 }
      }
    })
    
    if (videoPreview.value) {
      videoPreview.value.srcObject = stream
    }
  } catch (error) {
    console.error('Erreur lors du test vidéo:', error)
    isVideoTesting.value = false
  }
}

const stopVideoTest = () => {
  isVideoTesting.value = false
  if (videoPreview.value && videoPreview.value.srcObject) {
    const tracks = videoPreview.value.srcObject.getTracks()
    tracks.forEach(track => track.stop())
    videoPreview.value.srcObject = null
  }
}

const getVideoWidth = () => {
  const quality = appStore.settings.videoQuality || 'medium'
  const widths = {
    low: 854,    // 480p
    medium: 1280, // 720p
    high: 1920,   // 1080p
    ultra: 3840   // 4K
  }
  return widths[quality] || 1280
}

const getVideoHeight = () => {
  const quality = appStore.settings.videoQuality || 'medium'
  const heights = {
    low: 480,     // 480p
    medium: 720,  // 720p
    high: 1080,   // 1080p
    ultra: 2160   // 4K
  }
  return heights[quality] || 720
}

// Fonction pour le test de latence
const testLatency = () => {
  const startTime = performance.now()
  
  // Créer un son de test
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.1)
  
  // Mesurer la latence
  setTimeout(() => {
    const endTime = performance.now()
    const latency = Math.round(endTime - startTime)
    latencyResult.value = latency
    
    // Effacer le résultat après 5 secondes
    setTimeout(() => {
      latencyResult.value = null
    }, 5000)
  }, 100)
}

// Fonction pour jouer différents tons de test
const playTestTone = (type = 'normal') => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Fréquences selon le type
    const frequencies = {
      normal: 440,  // La note A4
      high: 2000,  // Aigu
      low: 100     // Grave
    }
    
    oscillator.frequency.setValueAtTime(frequencies[type] || 440, audioContext.currentTime)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 1)
    
  } catch (error) {
    console.error('Erreur lors de la lecture du son de test:', error)
  }
}

// Fonction pour réinitialiser les paramètres audio
const resetAudioSettings = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres audio ?')) {
    appStore.updateSetting('inputVolume', 50)
    appStore.updateSetting('outputVolume', 50)
    appStore.updateSetting('noiseSuppression', true)
    appStore.updateSetting('echoCancellation', true)
    appStore.updateSetting('autoGainControl', true)
    appStore.updateSetting('audioQuality', 'medium')
    appStore.updateSetting('sampleRate', '44100')
  }
}

 // Fonction pour réinitialiser les paramètres vidéo
 const resetVideoSettings = () => {
   if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres vidéo ?')) {
     appStore.updateSetting('videoQuality', 'medium')
     appStore.updateSetting('videoFPS', '30')
   }
 }
 
 // Fonction pour obtenir le label d'un périphérique par son ID
const getDeviceLabel = (deviceId, devices) => {
  if (!deviceId || deviceId === '') return 'Aucun périphérique sélectionné'
  const device = devices.find(d => d.deviceId === deviceId)
  return device ? device.label : 'Périphérique inconnu'
}

// Fonction pour tester tous les appareils
const testAllDevices = async () => {
  try {
    console.log('🧪 Test complet des appareils...')
    
    // Test audio
    await refreshAudioDevices()
    await refreshVideoDevices()
    
    // Test de latence
    testLatency()
    
    // Test de son
    playTestTone()
    
    console.log('✅ Test complet terminé')
  } catch (error) {
    console.error('❌ Erreur lors du test complet:', error)
  }
}

// Fonction pour exporter les paramètres
const exportSettings = () => {
  const settings = {
    audio: {
      inputDevice: appStore.settings.inputDevice,
      outputDevice: appStore.settings.outputDevice,
      inputVolume: appStore.settings.inputVolume,
      outputVolume: appStore.settings.outputVolume,
      audioQuality: appStore.settings.audioQuality,
      sampleRate: appStore.settings.sampleRate,
      noiseSuppression: appStore.settings.noiseSuppression,
      echoCancellation: appStore.settings.echoCancellation,
      autoGainControl: appStore.settings.autoGainControl
    },
    video: {
      videoDevice: appStore.settings.videoDevice,
      videoQuality: appStore.settings.videoQuality,
      videoFPS: appStore.settings.videoFPS
    },
    exportDate: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(settings, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `eterna-settings-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  console.log('💾 Paramètres exportés avec succès')
}

// Données pour la personnalisation de l'apparence
const accentColors = [
  { name: 'Bleu Discord', value: '#5865f2' },
  { name: 'Vert', value: '#57f287' },
  { name: 'Rouge', value: '#ed4245' },
  { name: 'Orange', value: '#faa61a' },
  { name: 'Rose', value: '#eb459e' },
  { name: 'Violet', value: '#9c59b6' },
  { name: 'Cyan', value: '#00d4aa' },
  { name: 'Jaune', value: '#fee75c' },
  { name: 'Bleu ciel', value: '#3498db' },
  { name: 'Indigo', value: '#6c5ce7' }
]

const fontSizes = [
  { label: 'Très petit', value: '12' },
  { label: 'Petit', value: '14' },
  { label: 'Normal', value: '16' },
  { label: 'Grand', value: '18' },
  { label: 'Très grand', value: '20' }
]

// Style dynamique pour l'aperçu
const previewStyle = computed(() => {
  const settings = appStore.settings
  return {
    fontSize: `${settings.fontSize || 16}px`,
    opacity: `${(100 - (settings.transparency || 0)) / 100}`,
    backdropFilter: settings.backdropBlur ? 'blur(10px)' : 'none',
    '--accent-color': settings.accentColor || '#5865f2',
    transform: `scale(${(settings.zoomLevel || 100) / 100})`,
    fontFamily: settings.compactMode ? 'monospace' : 'inherit'
  }
})

// Initialiser les périphériques audio et vidéo au montage
onMounted(() => {
  refreshAudioDevices()
  refreshVideoDevices()
  if (activeSection.value === 'voice') {
    startAudioLevelMonitoring()
  }
})

// Surveiller les changements de section active
watch(activeSection, (newSection) => {
  if (newSection === 'voice') {
    startAudioLevelMonitoring()
  } else if (microphone.value) {
    microphone.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
/* Modal des paramètres style Discord compact */
.modal-overlay {
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
  animation: fadeIn 0.3s ease-out;
}

.settings-modal-discord {
  background: #36393f;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid #202225;
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header-discord {
  background: #2f3136;
  padding: 16px 20px;
  border-bottom: 1px solid #202225;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title-discord {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.modal-close-btn-discord {
  background: transparent;
  border: none;
  color: #b9bbbe;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close-btn-discord:hover {
  background: #4f545c;
  color: #fff;
}

.modal-body-discord {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar compacte */
.settings-sidebar-discord {
  width: 220px;
  background: #2f3136;
  border-right: 1px solid #202225;
  overflow-y: auto;
  padding: 16px 0;
}

.sidebar-nav-discord {
  display: flex;
  flex-direction: column;
}

.nav-section-discord {
  margin-bottom: 24px;
}

.nav-section-title-discord {
  color: #8e9297;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
  padding: 0 16px;
  text-transform: uppercase;
}

.nav-item-discord {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  color: #b9bbbe;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  margin: 2px 8px;
  font-size: 14px;
}

.nav-item-discord:hover {
  background: #40444b;
  color: #fff;
}

.nav-item-discord.active {
  background: #5865f2;
  color: #fff;
}

.nav-icon-discord {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.nav-label-discord {
  font-weight: 500;
}

/* Contenu des paramètres */
.settings-content-discord {
  flex: 1;
  background: #36393f;
  overflow-y: auto;
  padding: 20px;
}

.settings-panel-discord {
  max-width: 600px;
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-title-discord {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #40444b;
}

.panel-description-discord {
  color: #b9bbbe;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
}

/* Groupes de paramètres */
.setting-group-discord {
  margin-bottom: 32px;
}

.setting-header-discord {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-refresh-discord {
  background: #40444b;
  color: #b9bbbe;
  border: 1px solid #202225;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-refresh-discord:hover {
  background: #5865f2;
  color: #fff;
  border-color: #5865f2;
}

.group-title-discord {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #40444b;
}

/* Éléments de paramètres */
.setting-item-discord {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #2f3136;
  gap: 20px;
}

.setting-item-discord:last-child {
  border-bottom: none;
}

.setting-info-discord {
  flex: 1;
  margin-right: 20px;
}

.setting-label-discord {
  display: block;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.setting-description-discord {
  display: block;
  color: #b9bbbe;
  font-size: 12px;
  line-height: 1.4;
}

.setting-control-discord {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 200px;
  flex-shrink: 0;
}

.setting-value-discord {
  color: #b9bbbe;
  font-size: 13px;
  font-weight: 500;
}

/* Boutons */
.btn-edit-discord {
  background: #5865f2;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit-discord:hover {
  background: #4752c4;
}

/* Sélecteurs */
.select-discord {
  background: #40444b;
  border: 1px solid #202225;
  border-radius: 4px;
  color: #dcddde;
  padding: 8px 12px;
  font-size: 13px;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-discord:focus {
  outline: none;
  border-color: #5865f2;
}

.select-discord:hover {
  border-color: #4f545c;
}

.select-discord option {
  background: #40444b;
  color: #dcddde;
  padding: 8px 12px;
}

/* Contrôles de volume */
.volume-control-discord {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.slider-discord {
  flex: 1;
  height: 4px;
  background: #40444b;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.slider-discord::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #5865f2;
  border-radius: 50%;
  cursor: pointer;
}

.volume-display-discord {
  color: #b9bbbe;
  font-size: 12px;
  font-weight: 500;
  min-width: 35px;
  text-align: center;
}

/* Boutons de test */
.test-controls-discord {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.btn-test-discord {
  background: #57f287;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-test-discord:hover {
  background: #3ba55c;
}

.btn-test-discord.recording {
  background: #ed4245;
}

.btn-play-discord {
  background: #5865f2;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-play-discord:hover {
  background: #4752c4;
}

/* Indicateur de niveau */
.level-meter-discord {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-bars-discord {
  display: flex;
  gap: 2px;
  flex: 1;
}

.level-bar-discord {
  width: 6px;
  height: 16px;
  background: #40444b;
  border-radius: 1px;
  transition: all 0.2s ease;
}

.level-bar-discord.active {
  background: #57f287;
}

/* Toggle switch */
.toggle-discord {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 18px;
  transition: all 0.2s ease;
}

.toggle-discord input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider-discord {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #40444b;
  transition: 0.2s;
  border-radius: 18px;
  border: 1px solid #202225;
}

.toggle-slider-discord:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 1px;
  background: #dcddde;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .toggle-slider-discord {
  background: #5865f2;
  border-color: #5865f2;
}

input:checked + .toggle-slider-discord:before {
  transform: translateX(18px);
}

/* Boutons de thème */
.theme-toggle-discord {
  display: flex;
  gap: 8px;
}

.theme-btn-discord {
  width: 36px;
  height: 36px;
  background: #40444b;
  border: 1px solid #202225;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b9bbbe;
}

.theme-btn-discord:hover {
  background: #4f545c;
  color: #fff;
}

.theme-btn-discord.active {
  background: #5865f2;
  border-color: #5865f2;
  color: #fff;
}

/* Section d'accueil */
.welcome-grid-discord {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.welcome-card-discord {
  background: #40444b;
  border: 1px solid #202225;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.welcome-card-discord:hover {
  background: #4f545c;
  border-color: #5865f2;
}

.welcome-icon-discord {
  font-size: 32px;
  margin-bottom: 12px;
}

.welcome-card-discord h3 {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.welcome-card-discord p {
  color: #b9bbbe;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

/* Section de test d'apparence en page d'accueil */
.welcome-test-section {
  margin-top: 32px;
  text-align: center;
}

.welcome-test-section h3 {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.welcome-test-section p {
  color: #b9bbbe;
  font-size: 14px;
  margin: 0 0 20px 0;
}

/* Test info card */
.test-info-card {
  background: #36393f;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #40444b;
}

.test-info-card p {
  color: #dcddde;
  font-size: 13px;
  margin: 8px 0;
}

/* Demo placeholder */
.demo-placeholder {
  background: #36393f;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border: 1px solid #40444b;
}

.demo-placeholder p {
  color: #b9bbbe;
  font-size: 14px;
  margin: 8px 0;
}

/* Nouveaux styles pour l'apparence */
.setting-group-title-discord {
  color: #b9bbbe;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 0;
  padding-top: 20px;
  border-top: 1px solid #40444b;
}

.setting-group-title-discord:first-child {
  border-top: none;
  padding-top: 0;
}

/* Grille de thèmes */
.theme-grid-discord {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.theme-card-discord {
  cursor: pointer;
  border: 2px solid #40444b;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s ease;
  text-align: center;
}

.theme-card-discord:hover {
  border-color: #5865f2;
}

.theme-card-discord.active {
  border-color: #5865f2;
  background: #5865f2;
  color: white;
}

.theme-preview-discord {
  width: 100%;
  height: 60px;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
}

.dark-preview {
  background: #36393f;
}

.light-preview {
  background: #ffffff;
}

.auto-preview {
  background: linear-gradient(45deg, #36393f 50%, #ffffff 50%);
}

.preview-header-discord {
  height: 12px;
  background: #2f3136;
}

.light-preview .preview-header-discord {
  background: #f2f3f5;
}

.preview-content-discord {
  display: flex;
  height: calc(100% - 12px);
}

.preview-sidebar-discord {
  width: 30%;
  background: #40444b;
}

.light-preview .preview-sidebar-discord {
  background: #e3e5e8;
}

.preview-main-discord {
  flex: 1;
  background: #36393f;
}

.light-preview .preview-main-discord {
  background: #ffffff;
}

.theme-name-discord {
  font-size: 12px;
  font-weight: 500;
}

/* Grille de couleurs */
.color-grid-discord {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.color-option-discord {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-option-discord:hover {
  transform: scale(1.1);
}

.color-option-discord.active {
  border-color: #dcddde;
  transform: scale(1.1);
}

.color-check-discord {
  width: 16px;
  height: 16px;
}

/* Options de taille */
.size-options-discord {
  display: flex;
  gap: 8px;
}

.size-btn-discord {
  padding: 8px 16px;
  background: #40444b;
  border: 1px solid #40444b;
  border-radius: 4px;
  color: #dcddde;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
}

.size-btn-discord:hover {
  background: #5865f2;
  border-color: #5865f2;
}

.size-btn-discord.active {
  background: #5865f2;
  border-color: #5865f2;
}

/* Contrôles de zoom */
.zoom-control-discord,
.transparency-control-discord {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-slider-discord,
.transparency-slider-discord {
  flex: 1;
  height: 4px;
  background: #40444b;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.zoom-slider-discord::-webkit-slider-thumb,
.transparency-slider-discord::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #5865f2;
  border-radius: 50%;
  cursor: pointer;
}

.zoom-value-discord,
.transparency-value-discord {
  color: #b9bbbe;
  font-size: 13px;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

/* Aperçu de l'apparence */
.appearance-preview-discord {
  background: #40444b;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.preview-container-discord {
  background: #36393f;
  border-radius: 4px;
  padding: 12px;
  border: 1px solid #40444b;
}

.preview-chat-discord {
  min-height: 80px;
}

.preview-message-discord {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.preview-avatar-discord {
  width: 32px;
  height: 32px;
  background: var(--accent-color, #5865f2);
  border-radius: 50%;
  flex-shrink: 0;
}

.preview-message-content-discord {
  flex: 1;
}

.preview-username-discord {
  display: block;
  color: var(--accent-color, #5865f2);
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.preview-text-discord {
  color: #dcddde;
  font-size: 14px;
  line-height: 1.4;
}

/* Nouveaux styles pour les paramètres Voix et Vidéo */
.connection-status-discord {
  background: #40444b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #202225;
}

.status-indicator-discord {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-dot-discord {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ed4245;
  transition: all 0.3s ease;
}

.status-dot-discord.connected {
  background: #57f287;
}

.status-text-discord {
  color: #dcddde;
  font-weight: 500;
}

.current-channel-discord {
  color: #b9bbbe;
  font-size: 13px;
}

.level-label-discord {
  color: #b9bbbe;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

.level-bar-discord.warning {
  background: #faa61a !important;
}

.level-bar-discord.danger {
  background: #ed4245 !important;
}

.audio-quality-discord {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.quality-label-discord {
  color: #b9bbbe;
  font-size: 12px;
}

.quality-indicator-discord {
  font-size: 16px;
}

.test-audio-controls-discord {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.latency-test-discord {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-latency-discord {
  background: #5865f2;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-latency-discord:hover {
  background: #4752c4;
}

.latency-result-discord {
  color: #57f287;
  font-size: 12px;
  font-weight: 500;
}

.video-test-controls-discord {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.btn-stop-discord {
  background: #ed4245;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-stop-discord:hover {
  background: #c53030;
}

.video-preview-discord {
  margin-top: 8px;
}

.video-element-discord {
  width: 200px;
  height: 150px;
  border-radius: 4px;
  background: #202225;
}

.quick-actions-discord {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.btn-reset-discord,
.btn-test-all-discord,
.btn-export-discord {
  background: #40444b;
  color: #dcddde;
  padding: 10px 16px;
  border: 1px solid #202225;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-reset-discord:hover,
.btn-test-all-discord:hover,
 .btn-export-discord:hover {
   background: #4f545c;
   border-color: #5865f2;
 }
 
 /* Sélection de périphériques */
.device-selection-discord {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  align-items: stretch;
}
 
 .selected-device-discord {
  color: #57f287;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  background: rgba(87, 242, 135, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(87, 242, 135, 0.3);
  text-align: center;
  margin-top: 4px;
  word-break: break-word;
}

/* Responsive */
@media (max-width: 768px) {
  .theme-grid-discord {
    grid-template-columns: 1fr;
  }
  
  .color-grid-discord {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .size-options-discord {
    flex-wrap: wrap;
  }
  
  .quick-actions-discord {
    grid-template-columns: 1fr;
  }
}
</style>
