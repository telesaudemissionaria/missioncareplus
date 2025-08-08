const CACHE = 'missioncare-v1.2';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  // Páginas do aplicativo
  './3-triagem-adulto.html',
  './3b-triagem-pediatria.html',
  './4-emergencias.html',
  './5-assistente-ia.html',
  './6-textos-biblicos.html',
  './8-medicamentos.html',
  './9-contatos.html',
  './sintomas-graves.html',
  // Recursos externos (com fallback)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?display=swap&family=Lexend:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900'
];

// Instalação do Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        return cache.addAll(PRECACHE.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('Falha no cache:', err))
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

// Estratégia de cache: Network First para navegações, Cache First para demais recursos
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  
  // Ignorar requisições para o Chrome Extension
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Estratégia para páginas HTML (navegação)
  if (req.mode === 'navigate' || 
      (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    e.respondWith(
      fetch(req)
        .then(response => {
          // Clonar a resposta para armazenar em cache
          const responseClone = response.clone();
          caches.open(CACHE).then(cache => cache.put(req, responseClone));
          return response;
        })
        .catch(() => {
          // Fallback para o cache se offline
          return caches.match(req)
            .then(cached => cached || caches.match('./index.html'));
        })
    );
    return;
  }
  
  // Estratégia para demais recursos (Cache First)
  e.respondWith(
    caches.match(req)
      .then(cached => {
        if (cached) return cached;
        
        return fetch(req)
          .then(response => {
            // Armazenar em cache apenas respostas válidas
            if (req.method === 'GET' && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE).then(cache => cache.put(req, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Fallback para recursos críticos
            if (req.destination === 'style' || req.destination === 'script') {
              return caches.match('./style.css');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Sincronização em segundo plano
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-data') {
    e.waitUntil(syncData());
  }
});

// Função de sincronização de dados
async function syncData() {
  try {
    // Lógica de sincronização aqui
    console.log('Sincronizando dados...');
    // Exemplo: enviar dados para o servidor
    // await sendDataToServer();
    return true;
  } catch (err) {
    console.error('Erro na sincronização:', err);
    return false;
  }
}
