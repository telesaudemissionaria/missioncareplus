const CACHE = 'missioncare-v1.3';
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
  './sintomas-graves.html'
];

// Instalação do Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
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

// Estratégia de cache otimizada
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
      caches.match(req)
        .then(cached => {
          // Se estiver offline, usa o cache
          if (!navigator.onLine && cached) {
            return cached;
          }
          
          // Se estiver online, tenta buscar da rede
          return fetch(req)
            .then(response => {
              // Clonar a resposta para armazenar em cache
              const responseClone = response.clone();
              caches.open(CACHE).then(cache => cache.put(req, responseClone));
              return response;
            })
            .catch(() => {
              // Fallback para o cache se offline ou erro de rede
              return cached || caches.match('./index.html');
            });
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
