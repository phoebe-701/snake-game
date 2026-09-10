// Service Worker：缓存游戏文件，实现离线可玩
const CACHE_NAME = 'snake-pwa-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE_NAME) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(resp){
      return resp || fetch(e.request).then(function(netResp){
        return caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request, netResp.clone());
          return netResp;
        });
      }).catch(function(){
        if(e.request.mode === 'navigate'){
          return caches.match('./index.html');
        }
      });
    })
  );
});
