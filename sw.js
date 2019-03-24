/**
 * sw.js
 */

const appCache = 'v1-restaurant-reviews-app-cache';
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
  event.respondWith(fromCache(event.request));
  event.waitUntil(update(event.request).then(refresh));

  function fromCache(request) {
    return caches.open(appCache).then(function(cache) {
      return cache.match(request);
    });
  }

  function update(request) {
    return caches.open(appCache).then(function(appCache) {
      return fetch(request).then(function(response) {
        return appCache.put(request, response.clone()).then(function() {
          return response;
        });
      });
    });
  }

  function refresh(response) {
    return self.clients.matchAll().then(function(clients) {
      clients.forEach(function(client) {
        var message = {
          type: 'refresh',
          url: response.url,
          eTag: response.headers.get('ETag')
        };

        client.postMessage(JSON.stringify(message));
      });
    });
  }
});