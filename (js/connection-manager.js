// js/connection-manager.js
class ConnectionManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.connectionQuality = 'unknown';
    this.setupEventListeners();
    this.startPeriodicCheck();
  }

  setupEventListeners() {
    // Eventos do navegador
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyConnectionChange();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyConnectionChange();
    });
  }

  startPeriodicCheck() {
    // Verifica a qualidade da conexão a cada 30 segundos
    setInterval(() => {
      this.checkConnectionQuality();
    }, 30000);
  }

  async checkConnectionQuality() {
    if (!this.isOnline) {
      this.connectionQuality = 'offline';
      return;
    }

    try {
      const startTime = performance.now();
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD', 
        cache: 'no-store' 
      });
      const endTime = performance.now();
      const latency = endTime - startTime;

      if (response.ok) {
        if (latency < 300) {
          this.connectionQuality = 'excellent';
        } else if (latency < 1000) {
          this.connectionQuality = 'good';
        } else {
          this.connectionQuality = 'poor';
        }
      } else {
        this.connectionQuality = 'limited';
      }
    } catch (error) {
      this.connectionQuality = 'offline';
      this.isOnline = false;
    }

    this.updateConnectionIndicator();
  }

  notifyConnectionChange() {
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('connection-changed', {
      detail: { 
        online: this.isOnline,
        quality: this.connectionQuality 
      }
    }));

    // Atualizar UI
    this.updateConnectionIndicator();

    // Se voltou online, tentar sincronizar
    if (this.isOnline) {
      this.triggerSync();
    }
  }

  updateConnectionIndicator() {
    const indicator = document.getElementById('connection-indicator');
    if (!indicator) return;

    const statusConfig = {
      excellent: { icon: 'fas fa-wifi', text: 'Excelente', class: 'excellent' },
      good: { icon: 'fas fa-wifi', text: 'Boa', class: 'good' },
      poor: { icon: 'fas fa-wifi', text: 'Instável', class: 'poor' },
      limited: { icon: 'fas fa-exclamation-triangle', text: 'Limitada', class: 'limited' },
      offline: { icon: 'fas fa-wifi-slash', text: 'Offline', class: 'offline' }
    };

    const config = statusConfig[this.connectionQuality] || statusConfig.offline;
    
    indicator.className = `connection-indicator ${config.class}`;
    indicator.innerHTML = `<i class="${config.icon}"></i> ${config.text}`;
  }

  triggerSync() {
    // Registrar sync para background
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-forms');
        registration.sync.register('sync-contacts');
      });
    }

    // Notificar usuário
    this.showSyncNotification();
  }

  showSyncNotification() {
    const notification = document.createElement('div');
    notification.className = 'sync-notification';
    notification.innerHTML = `
      <div class="sync-content">
        <i class="fas fa-sync-alt fa-spin"></i>
        <span>Sincronizando dados...</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Criar instância global
const connectionManager = new ConnectionManager();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConnectionManager;
}
