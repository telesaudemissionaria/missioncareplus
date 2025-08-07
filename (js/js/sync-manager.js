// js/sync-manager.js
class SyncManager {
  constructor() {
    this.pendingData = this.loadPendingData();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Ouvir eventos de conexão
    window.addEventListener('connection-changed', (e) => {
      if (e.detail.online) {
        this.attemptSync();
      }
    });
  }

  loadPendingData() {
    const stored = localStorage.getItem('pendingSyncData');
    return stored ? JSON.parse(stored) : {
      forms: [],
      contacts: [],
      medicines: [],
      assessments: []
    };
  }

  savePendingData() {
    localStorage.setItem('pendingSyncData', JSON.stringify(this.pendingData));
  }

  addToPending(type, data) {
    const item = {
      id: this.generateId(),
      type: type,
      data: data,
      timestamp: new Date().toISOString(),
      synced: false
    };

    this.pendingData[type].push(item);
    this.savePendingData();
    
    // Mostrar indicador de sincronização pendente
    this.showPendingSyncIndicator();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async attemptSync() {
    if (!navigator.onLine) return;

    const syncPromises = [];

    // Sincronizar formulários
    if (this.pendingData.forms.length > 0) {
      syncPromises.push(this.syncForms());
    }

    // Sincronizar contatos
    if (this.pendingData.contacts.length > 0) {
      syncPromises.push(this.syncContacts());
    }

    // Sincronizar medicamentos
    if (this.pendingData.medicines.length > 0) {
      syncPromises.push(this.syncMedicines());
    }

    // Sincronizar avaliações
    if (this.pendingData.assessments.length > 0) {
      syncPromises.push(this.syncAssessments());
    }

    try {
      await Promise.all(syncPromises);
      this.hidePendingSyncIndicator();
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }

  async syncForms() {
    const formsToSync = [...this.pendingData.forms];
    
    for (const form of formsToSync) {
      try {
        const response = await fetch('/api/triagem/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
        });

        if (response.ok) {
          // Remover da lista de pendentes
          this.pendingData.forms = this.pendingData.forms.filter(f => f.id !== form.id);
          this.savePendingData();
        }
      } catch (error) {
        console.error('Erro ao sincronizar formulário:', error);
      }
    }
  }

  async syncContacts() {
    const contactsToSync = [...this.pendingData.contacts];
    
    for (const contact of contactsToSync) {
      try {
        const response = await fetch('/api/contatos/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contact.data)
        });

        if (response.ok) {
          this.pendingData.contacts = this.pendingData.contacts.filter(c => c.id !== contact.id);
          this.savePendingData();
        }
      } catch (error) {
        console.error('Erro ao sincronizar contato:', error);
      }
    }
  }

  async syncMedicines() {
    // Implementação similar para medicamentos
  }

  async syncAssessments() {
    // Implementação similar para avaliações
  }

  showPendingSyncIndicator() {
    const indicator = document.getElementById('sync-pending-indicator');
    if (indicator) {
      indicator.classList.remove('hidden');
      indicator.innerHTML = `
        <i class="fas fa-clock"></i>
        <span>${this.getTotalPendingItems()} itens pendentes</span>
      `;
    }
  }

  hidePendingSyncIndicator() {
    const indicator = document.getElementById('sync-pending-indicator');
    if (indicator) {
      indicator.classList.add('hidden');
    }
  }

  getTotalPendingItems() {
    return this.pendingData.forms.length + 
           this.pendingData.contacts.length + 
           this.pendingData.medicines.length + 
           this.pendingData.assessments.length;
  }

  // Métodos para uso nas páginas
  saveFormOffline(formData) {
    this.addToPending('forms', formData);
  }

  saveContactOffline(contactData) {
    this.addToPending('contacts', contactData);
  }

  saveMedicineOffline(medicineData) {
    this.addToPending('medicines', medicineData);
  }

  saveAssessmentOffline(assessmentData) {
    this.addToPending('assessments', assessmentData);
  }
}

// Criar instância global
const syncManager = new SyncManager();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SyncManager;
}
