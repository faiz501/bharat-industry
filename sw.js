// Service Worker for Bharat Industries Website
// Provides offline functionality, caching, and performance optimizations

const CACHE_NAME = 'bharat-industries-v1.2';
const STATIC_CACHE = 'bharat-static-v1';
const DYNAMIC_CACHE = 'bharat-dynamic-v1';
const IMAGE_CACHE = 'bharat-images-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/team.html',
  '/privacy-policy.html',
  '/terms-of-service.html',
  '/css/style.css',
  '/css/products.css',
  '/css/team.css',
  '/js/main.js',
  '/js/animations.js',
  '/data/config.json',
  '/images/logo.webp',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Images to cache on demand
const IMAGE_ASSETS = [
  '/images/hero-img.webp',
  'team-person-3.jpeg'
];

// Cache size limits
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 50,
  [IMAGE_CACHE]: 20
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache critical images
      caches.open(IMAGE_CACHE).then(cache => {
        console.log('[SW] Caching critical images');
        return cache.addAll(IMAGE_ASSETS);
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    }).catch(error => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle static assets (CSS, JS, fonts)
function handleStaticAsset(request) {
  return caches.open(STATIC_CACHE).then(cache => {
    return cache.match(request).then(response => {
      if (response) {
        console.log('[SW] Serving static asset from cache:', request.url);
        return response;
      }
      
      // Fetch and cache if not found
      return fetch(request).then(fetchResponse => {
        if (fetchResponse.ok) {
          cache.put(request, fetchResponse.clone());
        }
        return fetchResponse;
      }).catch(() => {
        // Return offline fallback for critical assets
        if (request.url.includes('.css')) {
          return new Response('/* Offline CSS fallback */', {
            headers: { 'Content-Type': 'text/css' }
          });
        }
        if (request.url.includes('.js')) {
          return new Response('// Offline JS fallback', {
            headers: { 'Content-Type': 'application/javascript' }
          });
        }
      });
    });
  });
}

// Handle image requests
function handleImageRequest(request) {
  return caches.open(IMAGE_CACHE).then(cache => {
    return cache.match(request).then(response => {
      if (response) {
        console.log('[SW] Serving image from cache:', request.url);
        return response;
      }
      
      // Fetch and cache image
      return fetch(request).then(fetchResponse => {
        if (fetchResponse.ok) {
          cache.put(request, fetchResponse.clone());
          limitCacheSize(IMAGE_CACHE, CACHE_LIMITS[IMAGE_CACHE]);
        }
        return fetchResponse;
      }).catch(() => {
        // Return placeholder image for offline
        return generatePlaceholderImage();
      });
    });
  });
}

// Handle API requests (config.json, etc.)
function handleAPIRequest(request) {
  return caches.open(DYNAMIC_CACHE).then(cache => {
    return fetch(request).then(response => {
      if (response.ok) {
        console.log('[SW] Caching API response:', request.url);
        cache.put(request, response.clone());
        limitCacheSize(DYNAMIC_CACHE, CACHE_LIMITS[DYNAMIC_CACHE]);
      }
      return response;
    }).catch(() => {
      // Return cached version if network fails
      return cache.match(request).then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving API response from cache:', request.url);
          return cachedResponse;
        }
        // Return offline fallback
        return new Response(JSON.stringify({
          error: 'Offline',
          message: 'This content is not available offline'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      });
    });
  });
}

// Handle dynamic requests (HTML pages)
function handleDynamicRequest(request) {
  return caches.open(DYNAMIC_CACHE).then(cache => {
    return fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
        limitCacheSize(DYNAMIC_CACHE, CACHE_LIMITS[DYNAMIC_CACHE]);
      }
      return response;
    }).catch(() => {
      // Try to serve from cache
      return cache.match(request).then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving page from cache:', request.url);
          return cachedResponse;
        }
        
        // Return offline page
        return caches.match('/index.html').then(indexResponse => {
          if (indexResponse) {
            return indexResponse;
          }
          
          // Fallback offline page
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Offline - Nakoda Metal Industries</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 50px;
                  background: #f5f5f5;
                }
                .offline-container {
                  max-width: 500px;
                  margin: 0 auto;
                  background: white;
                  padding: 40px;
                  border-radius: 10px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .logo { color: #B87333; font-size: 2rem; margin-bottom: 20px; }
                h1 { color: #2C2C2C; }
                p { color: #6C757D; line-height: 1.6; }
                .retry-btn {
                  background: #B87333;
                  color: white;
                  padding: 12px 24px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="offline-container">
                <div class="logo">⚙️ Nakoda Metal Industries</div>
                <h1>You're Offline</h1>
                <p>It looks like you're not connected to the internet. Some content may not be available, but you can still browse cached pages.</p>
                <button class="retry-btn" onclick="window.location.reload()">Retry Connection</button>
              </div>
            </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        });
      });
    });
  });
}

// Utility functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/);
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/data/') || url.pathname.endsWith('.json');
}

function limitCacheSize(cacheName, maxItems) {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        // Delete oldest entries
        const deleteCount = keys.length - maxItems;
        for (let i = 0; i < deleteCount; i++) {
          cache.delete(keys[i]);
        }
      }
    });
  });
}

function generatePlaceholderImage() {
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#999">
        Image Offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

function syncContactForm() {
  // Handle offline form submissions when back online
  return new Promise((resolve) => {
    console.log('[SW] Syncing contact form submissions');
    // Implementation would depend on your form handling
    resolve();
  });
}

// Push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/logo.webp',
      badge: '/images/logo.webp',
      vibrate: [100, 50, 100],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ cacheSize: size });
    });
  }
});

function getCacheSize() {
  return Promise.all([
    caches.open(STATIC_CACHE).then(cache => cache.keys()),
    caches.open(DYNAMIC_CACHE).then(cache => cache.keys()),
    caches.open(IMAGE_CACHE).then(cache => cache.keys())
  ]).then(results => {
    return {
      static: results[0].length,
      dynamic: results[1].length,
      images: results[2].length,
      total: results[0].length + results[1].length + results[2].length
    };
  });
}

// Periodic cleanup
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

function cleanupOldCaches() {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const now = Date.now();
  
  return caches.open(DYNAMIC_CACHE).then(cache => {
    return cache.keys().then(requests => {
      return Promise.all(
        requests.map(request => {
          return cache.match(request).then(response => {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
              const responseDate = new Date(dateHeader).getTime();
              if (now - responseDate > maxAge) {
                return cache.delete(request);
              }
            }
          });
        })
      );
    });
  });
}

console.log('[SW] Service Worker script loaded');
