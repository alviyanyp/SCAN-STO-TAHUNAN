/* Service worker STO Barcode: aplikasi bisa diinstal & dibuka cepat.
 * Naikkan VERSION setiap kali index.html diubah supaya HP mengambil versi baru. */
const VERSION = '1.3.1';
const CACHE = 'sto-barcode-' + VERSION;
const SHELL = ['./', './index.html', './index.html?app=sto-barcode', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const LIB = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).then(() => c.add(LIB).catch(() => {}))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // kirim data ke server: tidak disentuh
  const url = new URL(req.url);
  if (/script\.google|googleusercontent/.test(url.hostname)) return;   // data STO selalu dari server

  // Halaman: ambil versi terbaru dari internet (maks 3 detik), kalau lambat pakai yang tersimpan
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(new Promise(resolve => {
      let done = false;
      const fallback = () => caches.match('./index.html').then(r => { if (!done && r) { done = true; resolve(r); } });
      const t = setTimeout(fallback, 3000);
      fetch(req).then(res => {
        clearTimeout(t);
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
        if (!done) { done = true; resolve(res); }
      }).catch(() => { clearTimeout(t); caches.match('./index.html').then(r => { if (!done) { done = true; resolve(r || Response.error()); } }); });
    }));
    return;
  }

  // Library scanner, ikon, manifest: pakai simpanan (cepat), ambil dari internet bila belum ada
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok && (url.origin === location.origin || req.url === LIB)) {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
    }
    return res;
  })));
});
