// sw.js
const CACHE_NAME = 'missioncare-offline-v1';
const OFFLINE_CACHE = 'missioncare-offline-data';
const DYNAMIC_CACHE = 'missioncare-dynamic-v1';

// Lista de recursos essenciais para funcionamento offline
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/sintomas-graves.html',
  '/3-triagem-adulto.html',
  '/3b-triagem-pediatria.html',
  '/4-emergencias.html',
  '/5-assistenteIA.html',
  '/6-textos-biblico.html',
  '/8-medicamentos.html',
  '/9-contatos.html',
  '/manifest.json',
  '/assets/css/offline.css',
  '/assets/data/offline-protocols.json',
  '/assets/data/emergency-faq.json',
  '/assets/data/basic-medicines.json',
  '/assets/data/biblical-texts.json',
  '/js/connection-manager.js',
  '/js/mode-switcher.js',
  '/js/sync-manager.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(OFFLINE_CACHE)
      .then(cache => {
        console.log('Service Worker: Cacheando recursos offline');
        return cache.addAll(OFFLINE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== OFFLINE_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('Service Worker: Limpando cache antigo', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estratégia de interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se está no cache, retorna do cache
        if (response) {
          return response;
        }

        // Se não está no cache, tenta buscar da rede
        return fetch(event.request)
          .then(fetchResponse => {
            // Clona a resposta
            const responseClone = fetchResponse.clone();
            
            // Salva no cache dinâmico
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseClone);
              });

            return fetchResponse;
          })
          .catch(() => {
            // Se falhar a rede e for uma página, retorna página offline
            if (event.request.url.includes('.html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', event => {
  console.log('Service Worker: Sincronização em background', event.tag);
  
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
  
  if (event.tag === 'sync-contacts') {
    event.waitUntil(syncContacts());
  }
});

// Funções de sincronização
async function syncForms() {
  const pendingData = await getPendingData('forms');
  
  for (const item of pendingData) {
    try {
      const response = await fetch('/api/triagem/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data)
      });
      
      if (response.ok) {
        await removeFromPending(item.id, 'forms');
      }
    } catch (error) {
      console.error('Erro ao sincronizar formulário:', error);
    }
  }
}

async function syncContacts() {
  // Implementação similar para contatos
}

// Funções auxiliares
async function getPendingData(type) {
  // Implementar busca de dados pendentes no IndexedDB
  return [];
}

async function removeFromPending(id, type) {
  // Implementar remoção de dados sincronizados
}
