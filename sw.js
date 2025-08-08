// service-worker.js
const CACHE = 'missioncare-v1';

// Liste aqui TUDO que precisa abrir offline
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',

  // Páginas (use os nomes RENOMEADOS)
  './3-triagem-adulto.html',
  './3b-triagem-pediatria.html',
  './4-emergencias.html',
  './5-assistente-ia.html',
  './6-textos-biblicos.html',
  './8-medicamentos.html',
  './9-contatos.html',
  './sintomas-graves.html',

  // Ícones PWA (ajuste se mudar os nomes/locais)
  './icons/icon-192.png',
  './icons/icon-512.png',

  // CDNs críticos (respostas opacas, mas funcionam offline se pré-cacheadas)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?display=swap&family=Lexend:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900',
  'https://fonts.gstatic.com/'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Navegações (HTML): NetworkFirst com fallback pra cache e, por fim, index (app shell)
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        return cached || cache.match('./index.html');
      }
    })());
    return;
  }

  // Demais (CSS/JS/Fontes/Imagens): CacheFirst
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreVary: true });
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      if (req.method === 'GET' && fresh && fresh.status === 200) {
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      return cached; // se não tiver, falha silenciosa
    }
  })());
});
