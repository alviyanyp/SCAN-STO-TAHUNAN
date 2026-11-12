/* Service worker STO Dashboard: supaya bisa diinstal & langsung terbuka.
 * Data dashboard selalu diambil langsung dari server (tidak disimpan). */
const VERSION = 'dash-1.0.0';
const CACHE = 'sto-dashboard-' + VERSION;
const SHELL = ['./', './index.html', './index.html?app=sto-dashboard', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('sto-dashboard-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            // Apps Script & Google: langsung ke internet

  // Halaman: versi terbaru dari internet, kalau offline pakai simpanan
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
      return res;
    }).catch(() => caches.match('./index.html').then(r => r || Response.error())));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
