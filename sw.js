/**
 * sw.js
 */

const appCache = 'v1.1-restaurant-reviews-app-cache';
const cacheFiles = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js'
];

// serviceWorker install.
self.addEventListener('install', function(event) {
  console.log('serviceWorker: install');
  event.waitUntil(caches.open(appCache).then(function(cache) {
    return cache.addAll(cacheFiles);
  }));
});

// serviceWorker fetch.
self.addEventListener('fetch', function(event) {
  console.log('serviceWorker: fetch');
  event.respondWith(fromNetwork(event.request, 400).catch(function() {
    return fromCache(event.request);
  }));
});

function fromNetwork(request, timeout) {
  return new Promise(function(fulfill, reject) {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function(response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(appCache).then(function(cache) {
    return cache.match(request).then(function(matching) {
      return matching || Promise.reject('no-match');
    });
  });
}