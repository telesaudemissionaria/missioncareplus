// service-worker.js
const CACHE = 'missioncare-v1';

// Liste TUDO que precisa abrir offline (HTML, CSS/JS local, páginas, e os CDNs críticos)
const PRECACHE = [
  './index.html',
  './3-triagem-adulto.html',
  './3b-triagem-pediatria.html',
  './5-assistente-ia.html',
  './6-textos-biblicos.html',
  './8-medicamentos.html',
  './9-contatos.html',
  './sintomas-graves.html',
  './manifest.json',

  // CSS/JS locais (se houver)
  // './styles.css', './app.js',

  // CDNs críticos (serão responses opacas, mas funcionam offline se pré-carregados)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?display=swap&family=Lexend:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900',
  'https://fonts.gstatic.com/',
  // Imagem do hero (troque placehold.co por um arquivo local para garantir offline)
  // './assets/hero.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
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

// Estratégia:
// - Navegações (HTML): NetworkFirst com fallback para cache e, por fim, index.html (app shell)
// - Demais requests: CacheFirst, caindo para rede se não tiver cache
self.addEventListener('fetch', (e) => {
  const { request } = e;

  // Trata navegações
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put(request, fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(request);
        return cached || cache.match('./index.html');
      }
    })());
    return;
  }

  // Outros (CSS/JS/Fontes/Imagens): CacheFirst
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request, { ignoreVary: true });
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      // Evita cachear respostas POST/dinâmicas
      if (request.method === 'GET' && fresh && fresh.status === 200) {
        cache.put(request, fresh.clone());
      }
      return fresh;
    } catch (err) {
      // Sem rede e sem cache → falha silenciosa
      return cached;
    }
  })());
});
