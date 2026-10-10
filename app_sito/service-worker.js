// Service worker di Pizza Perfetta a Casa: la pagina arriva sempre dalla rete,
// la copia salvata serve solo quando manca la connessione.
const CACHE = 'pizza-perfetta-v3';
const FILES = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png', '/hero.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Solo richieste GET del sito stesso; login e dati (Netlify Identity, Firebase) passano diretti
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/.netlify/')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && (req.mode === 'navigate' || FILES.includes(url.pathname))) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req.mode === 'navigate' ? '/' : req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req.mode === 'navigate' ? '/' : req))
  );
});
