importScripts('js/sw-utils.js');

const STATIC_CACHE = 'STATIC-V1';
const DYNAMIC_CACHE = 'DYNAMIC-V1';
const IMMUTABLE_CACHE = 'IMMUTABLE-V1';

const AppShell = [
//   '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'js/app.js',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg'
];

const AppShellImmutable = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'js/libs/jquery.js',
  'css/animate.css'
];

// Install the resources for the app
self.addEventListener('install', e => {
  // Open cache storage
  const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(AppShell));
  const cacheImmutable = caches.open(IMMUTABLE_CACHE).then(cache => cache.addAll(AppShellImmutable));

  e.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

// Activate sw and remove old cache versions
self.addEventListener('activate', e => {
  const response = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes('STATIC')) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(response);
});

self.addEventListener('fetch', e => {
  const response = caches.match(e.request).then(res => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then(newRes => {
        return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
      });
    }
  });

  e.respondWith(response);
});
