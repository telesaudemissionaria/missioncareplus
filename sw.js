// sw.js
const CACHE_NAME = 'missioncare-plus-v1';
const urlsToCache = [
  './',
  './index.html',
  './1-inicio.html',
  './2-devocional.html',
  './4-emergencias.html',
  './9-contatos.html',
  './manifest.json',
  './style.css',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900',
  'https://cdn.tailwindcss.com'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o recurso do cache se existir
        if (response) {
          return response;
        }
        // Caso contrário, faz a requisição de rede
        return fetch(event.request);
      })
  );
});
