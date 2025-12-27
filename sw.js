// ===================================
// ZENITH AMBIENT - SERVICE WORKER
// Offline support and caching
// ===================================

const CACHE_NAME = 'zenith-ambient-v2.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/main.css',
    '/css/themes.css',
    '/css/animations.css',
    '/css/zen-mode.css',
    '/css/breathing.css',
    '/css/achievements.css',
    '/css/analytics.css',
    '/js/sounds.js',
    '/js/frequency.js',
    '/js/visualizer.js',
    '/js/presets.js',
    '/js/particles.js',
    '/js/timer.js',
    '/js/storage.js',
    '/js/breathing.js',
    '/js/achievements.js',
    '/js/analytics.js',
    '/js/keyboard.js',
    '/js/i18n.js',
    '/js/app.js'
];

// Install - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((err) => {
                console.log('Cache install failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension and other non-http requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-OK responses
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Cache successful responses
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Offline fallback for HTML pages
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-analytics') {
        console.log('📊 Syncing analytics data');
    }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'Zenith Ambient';
    const options = {
        body: data.body || 'Yeni güncelleme mevcut!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
