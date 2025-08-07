// js/mode-switcher.js
class ModeSwitcher {
  constructor() {
    this.currentMode = 'online';
    this.setupModeSwitching();
  }

  setupModeSwitching() {
    // Ouvir mudanças de conexão
    window.addEventListener('connection-changed', (e) => {
      this.switchMode(e.detail.online, e.detail.quality);
    });

    // Modo inicial
    this.switchMode(connectionManager.isOnline, connectionManager.connectionQuality);
  }

  switchMode(isOnline, quality = 'unknown') {
    const onlineMode = document.getElementById('online-mode');
    const offlineMode = document.getElementById('offline-mode');
    
    if (!onlineMode || !offlineMode) return;

    if (isOnline && quality !== 'offline') {
      // Modo online
      this.currentMode = 'online';
      onlineMode.classList.remove('hidden');
      offlineMode.classList.add('hidden');
      
      // Carregar recursos online
      this.loadOnlineResources();
      
      // Mostrar notificação
      this.showModeNotification('online');
      
    } else {
      // Modo offline
      this.currentMode = 'offline';
      onlineMode.classList.add('hidden');
      offlineMode.classList.remove('hidden');
      
      // Carregar recursos offline
      this.loadOfflineResources();
      
      // Mostrar notificação
      this.showModeNotification('offline');
    }
  }

  loadOnlineResources() {
    // Habilitar elementos que requerem internet
    this.enableOnlineElements();
    
    // Carregar dados externos
    this.loadExternalData();
    
    // Habilitar funcionalidades avançadas
    this.enableAdvancedFeatures();
  }

  loadOfflineResources() {
    // Desabilitar elementos que requerem internet
    this.disableOnlineElements();
    
    // Carregar dados do cache
    this.loadCachedData();
    
    // Habilitar funcionalidades básicas
    this.enableBasicFeatures();
  }

  enableOnlineElements() {
    // Habilitar botões e elementos online
    document.querySelectorAll('[data-requires-online]').forEach(element => {
      element.disabled = false;
      element.style.opacity = '1';
    });
  }

  disableOnlineElements() {
    // Desabilitar botões e elementos online
    document.querySelectorAll('[data-requires-online]').forEach(element => {
      element.disabled = true;
      element.style.opacity = '0.5';
    });
  }

  async loadExternalData() {
    // Implementar carregamento de dados externos
    // Ex: API, bancos de dados online
  }

  loadCachedData() {
    // Carregar dados do localStorage ou IndexedDB
    this.loadCachedProtocols();
    this.loadCachedMedicines();
    this.loadCachedBiblicalTexts();
  }

  loadCachedProtocols() {
    const cachedProtocols = localStorage.getItem('offline-protocols');
    if (cachedProtocols) {
      try {
        const protocols = JSON.parse(cachedProtocols);
        this.updateEmergencyProtocols(protocols);
      } catch (error) {
        console.error('Erro ao carregar protocolos cacheados:', error);
      }
    }
  }

  loadCachedMedicines() {
    const cachedMedicines = localStorage.getItem('offline-medicines');
    if (cachedMedicines) {
      try {
        const medicines = JSON.parse(cachedMedicines);
        this.updateMedicinesList(medicines);
      } catch (error) {
        console.error('Erro ao carregar medicamentos cacheados:', error);
      }
    }
  }

  loadCachedBiblicalTexts() {
    const cachedTexts = localStorage.getItem('offline-biblical-texts');
    if (cachedTexts) {
      try {
        const texts = JSON.parse(cachedTexts);
        this.updateBiblicalTexts(texts);
      } catch (error) {
        console.error('Erro ao carregar textos bíblicos cacheados:', error);
      }
    }
  }

  enableAdvancedFeatures() {
    // Habilitar IA, busca avançada, etc.
    console.log('Recursos avançados habilitados');
  }

  enableBasicFeatures() {
    // Habilitar funcionalidades básicas offline
    console.log('Recursos básicos habilitados');
  }

  updateEmergencyProtocols(protocols) {
    // Atualizar UI com protocolos emergenciais
    const protocolsContainer = document.getElementById('emergency-protocols');
    if (protocolsContainer && protocols) {
      // Implementar atualização da UI
    }
  }

  updateMedicinesList(medicines) {
    // Atualizar UI com lista de medicamentos
    const medicinesContainer = document.getElementById('medicines-list');
    if (medicinesContainer && medicines) {
      // Implementar atualização da UI
    }
  }

  updateBiblicalTexts(texts) {
    // Atualizar UI com textos bíblicos
    const textsContainer = document.getElementById('biblical-texts');
    if (textsContainer && texts) {
      // Implementar atualização da UI
    }
  }

  showModeNotification(mode) {
    const notification = document.createElement('div');
    notification.className = `mode-notification ${mode}`;
    
    const messages = {
      online: {
        icon: 'fas fa-wifi',
        text: 'Modo Online ativado',
        subtext: 'Todos os recursos disponíveis'
      },
      offline: {
        icon: 'fas fa-wifi-slash',
        text: 'Modo Offline ativado',
        subtext: 'Funcionalidades básicas disponíveis'
      }
    };

    const message = messages[mode];
    
    notification.innerHTML = `
      <div class="mode-notification-content">
        <i class="${message.icon}"></i>
        <div class="mode-notification-text">
          <strong>${message.text}</strong>
          <small>${message.subtext}</small>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }
}

// Criar instância global
const modeSwitcher = new ModeSwitcher();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModeSwitcher;
}
