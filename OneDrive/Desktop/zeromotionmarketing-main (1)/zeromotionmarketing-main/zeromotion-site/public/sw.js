// Advanced Service Worker for ZeroMotion Marketing
const CACHE_NAME = 'zeromotion-v2.1.0';
const STATIC_CACHE = 'zeromotion-static-v2.1.0';
const DYNAMIC_CACHE = 'zeromotion-dynamic-v2.1.0';
const IMAGE_CACHE = 'zeromotion-images-v2.1.0';
const VIDEO_CACHE = 'zeromotion-videos-v2.1.0';
const API_CACHE = 'zeromotion-api-v2.1.0';
const FONT_CACHE = 'zeromotion-fonts-v2.1.0';

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Critical resources to cache immediately on install (mobile-first)
const PRECACHE_URLS = [
  '/',
  '/pricing',
  '/services/web-design',
  '/services/brand-identity',
  '/services/ai-integration',
  '/services/crm',
  '/about',
  '/contact',
  // Critical assets
  '/favico/favicon-32x32.png',
  '/favico/android-chrome-192x192.png',
  '/favico/apple-touch-icon.png',
  '/brand/ZeroMotion-Outline.png',
  // Fonts (critical for mobile)
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  // CSS (critical styles)
  '/_astro/global.css'
];

// App shell resources for instant loading
const APP_SHELL_URLS = [
  '/',
  '/favico/site.webmanifest',
  '/robots.txt',
  '/sitemap.xml'
];

// Enhanced route patterns with improved caching strategies
const ROUTE_STRATEGIES = [
  // Static assets with versioned filenames
  {
    pattern: /\/assets\/.*\.(js|css)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 // 1 year for versioned assets
  },
  {
    pattern: /\/_astro\/.*\.(js|css)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 // 1 year for Astro assets
  },
  // Images with WebP/AVIF optimization
  {
    pattern: /\.(webp|avif|png|jpg|jpeg|gif|svg|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: IMAGE_CACHE,
    maxAge: 365 * 24 * 60 * 60 // 1 year
  },
  // Video assets
  {
    pattern: /\.(mp4|webm|mov)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: VIDEO_CACHE,
    maxAge: 365 * 24 * 60 * 60 // 1 year
  },
  // Font assets with separate cache
  {
    pattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: FONT_CACHE,
    maxAge: 365 * 24 * 60 * 60 // 1 year
  },
  {
    pattern: /\.(woff|woff2|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: FONT_CACHE,
    maxAge: 365 * 24 * 60 * 60 // 1 year
  },
  // API endpoints with background sync
  {
    pattern: /\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: API_CACHE,
    maxAge: 5 * 60, // 5 minutes
    backgroundSync: true
  },
  // Analytics and tracking - never cache
  {
    pattern: /\/gtm\.js|\/gtag\/|\/collect|\/analytics\//,
    strategy: CACHE_STRATEGIES.NETWORK_ONLY,
    cache: null,
    maxAge: 0
  },
  // Critical pages with offline fallback
  {
    pattern: /\/$|\/(pricing|services|about|contact)$/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60, // 24 hours
    offlineFallback: true
  },
  // PWA assets
  {
    pattern: /\.(webmanifest|json)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: STATIC_CACHE,
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  // Service worker and cache manifest
  {
    pattern: /(sw\.js|cache-manifest\.json)$/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: STATIC_CACHE,
    maxAge: 0 // Always check for updates
  }
];

// Detect development environment
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.port;

// Install event - precache critical resources with mobile optimization
self.addEventListener('install', event => {
  console.log('SW: Install event');

  // Skip service worker in development
  if (isDevelopment) {
    console.log('SW: Skipping install in development');
    return;
  }

  event.waitUntil(
    Promise.all([
      // Precache critical resources (mobile-first)
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Precaching critical resources');
        return cache.addAll(PRECACHE_URLS);
      }),

      // Cache app shell for instant loading
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Precaching app shell');
        return cache.addAll(APP_SHELL_URLS);
      }),

      // Skip waiting to activate immediately
      self.skipWaiting()
    ]).then(() => {
      console.log('SW: All critical resources cached successfully');
    }).catch(error => {
      console.error('SW: Failed to cache critical resources:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('SW: Activate event');
  
  // Skip service worker in development
  if (isDevelopment) {
    console.log('SW: Skipping activate in development');
    return;
  }
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE && 
                cacheName !== VIDEO_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Enhanced request handling with offline support and background sync
async function handleRequest(request, routeConfig) {
  const {
    strategy,
    cache: cacheName,
    maxAge,
    backgroundSync = false,
    offlineFallback = false
  } = routeConfig;

  try {
    switch (strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request, cacheName, maxAge);

      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirstWithOffline(request, cacheName, maxAge, backgroundSync, offlineFallback);

      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request, cacheName, maxAge);

      case CACHE_STRATEGIES.NETWORK_ONLY:
        return await networkOnlyWithQueue(request, backgroundSync);

      case CACHE_STRATEGIES.CACHE_ONLY:
        return await cacheOnlyWithFallback(request, cacheName, offlineFallback);

      default:
        return await networkFirstWithOffline(request, cacheName, maxAge, backgroundSync, offlineFallback);
    }
  } catch (error) {
    console.log('SW: Error handling request:', error);

    // Try offline fallback for critical requests
    if (offlineFallback) {
      return await getOfflineFallback(request);
    }

    return new Response('Service Unavailable', { status: 503 });
  }
}

// Enhanced network first with offline support
async function networkFirstWithOffline(request, cacheName, maxAge, backgroundSync, offlineFallback) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache:', error);

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Queue for background sync if enabled
    if (backgroundSync) {
      await queueApiRequest({
        url: request.url,
        options: {
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          body: request.method !== 'GET' ? await request.clone().text() : undefined
        }
      });
    }

    // Return offline fallback for critical pages
    if (offlineFallback) {
      return await getOfflineFallback(request);
    }

    return new Response('Offline', { status: 503 });
  }
}

// Network only with queuing for offline retry
async function networkOnlyWithQueue(request, backgroundSync) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('SW: Network failed for non-cacheable request:', error);

    // Queue analytics requests for later retry
    if (backgroundSync && request.url.includes('/analytics/')) {
      await queueAnalytics({
        url: request.url,
        data: await request.clone().text()
      });
    }

    throw error;
  }
}

// Cache only with offline fallback
async function cacheOnlyWithFallback(request, cacheName, offlineFallback) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  if (offlineFallback) {
    return await getOfflineFallback(request);
  }

  return new Response('Not Found', { status: 404 });
}

// Get offline fallback page
async function getOfflineFallback(request) {
  const cache = await caches.open(STATIC_CACHE);

  // Try to serve cached version of the same page
  const cachedPage = await cache.match(request);
  if (cachedPage) {
    return cachedPage;
  }

  // Fallback to offline page if available
  const offlinePage = await cache.match('/offline.html');
  if (offlinePage) {
    return offlinePage;
  }

  // Ultimate fallback
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offline - ZeroMotion Marketing</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
        .container { max-width: 600px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>You're Offline</h1>
        <p>Please check your internet connection and try again.</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Cache First strategy
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    // Only cache successful responses (not partial 206 responses)
    if (networkResponse.ok && networkResponse.status !== 206) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, returning cached version:', error);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Network First strategy
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Always try to fetch in background
  const fetchPromise = fetch(request).then(networkResponse => {
    // Only cache successful responses (not partial 206 responses)
    if (networkResponse.ok && networkResponse.status !== 206) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cached version
  });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Wait for network if no cache
  return fetchPromise;
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const date = new Date(dateHeader);
  const now = new Date();
  const age = (now.getTime() - date.getTime()) / 1000;
  
  return age > maxAge;
}

// Enhanced background sync for offline actions
self.addEventListener('sync', event => {
  console.log('SW: Background sync:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }

  if (event.tag === 'api-sync') {
    event.waitUntil(doApiSync());
  }

  if (event.tag === 'analytics-sync') {
    event.waitUntil(doAnalyticsSync());
  }
});

// Queue for offline requests
const offlineQueue = [];

async function doBackgroundSync() {
  console.log('SW: Performing background sync');

  try {
    // Process queued requests
    const queuedRequests = await getQueuedRequests();

    for (const request of queuedRequests) {
      try {
        await fetch(request.url, request.options);
        console.log('SW: Successfully synced request:', request.url);
      } catch (error) {
        console.error('SW: Failed to sync request:', request.url, error);
        // Re-queue failed requests
        await queueRequest(request);
      }
    }

    // Clear processed requests
    await clearQueuedRequests();
  } catch (error) {
    console.error('SW: Background sync failed:', error);
  }
}

async function doApiSync() {
  console.log('SW: Performing API sync');

  try {
    const apiRequests = await getQueuedApiRequests();

    for (const request of apiRequests) {
      try {
        const response = await fetch(request.url, request.options);

        if (response.ok) {
          // Update cached API response
          const cache = await caches.open(API_CACHE);
          await cache.put(request.url, response.clone());
          console.log('SW: API sync successful:', request.url);
        }
      } catch (error) {
        console.error('SW: API sync failed:', request.url, error);
      }
    }

    await clearQueuedApiRequests();
  } catch (error) {
    console.error('SW: API sync failed:', error);
  }
}

async function doAnalyticsSync() {
  console.log('SW: Performing analytics sync');

  try {
    const analyticsData = await getQueuedAnalytics();

    if (analyticsData.length > 0) {
      // Send batched analytics data
      await sendAnalyticsBatch(analyticsData);
      await clearQueuedAnalytics();
      console.log('SW: Analytics sync successful');
    }
  } catch (error) {
    console.error('SW: Analytics sync failed:', error);
  }
}

// Queue management functions
async function queueRequest(request) {
  const queue = await getOfflineQueue();
  queue.push({
    ...request,
    timestamp: Date.now(),
    id: Math.random().toString(36).substr(2, 9)
  });
  await saveOfflineQueue(queue);
}

async function getQueuedRequests() {
  return await getOfflineQueue();
}

async function clearQueuedRequests() {
  await saveOfflineQueue([]);
}

// Storage helpers for offline functionality
async function getOfflineQueue() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match('/offline-queue');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('SW: Failed to get offline queue:', error);
  }
  return [];
}

async function saveOfflineQueue(queue) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(queue));
    await cache.put('/offline-queue', response);
  } catch (error) {
    console.error('SW: Failed to save offline queue:', error);
  }
}

// API request queuing
async function queueApiRequest(request) {
  const queue = await getApiQueue();
  queue.push({
    ...request,
    timestamp: Date.now()
  });
  await saveApiQueue(queue);
}

async function getQueuedApiRequests() {
  return await getApiQueue();
}

async function getApiQueue() {
  try {
    const cache = await caches.open(API_CACHE);
    const response = await cache.match('/api-queue');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('SW: Failed to get API queue:', error);
  }
  return [];
}

async function saveApiQueue(queue) {
  try {
    const cache = await caches.open(API_CACHE);
    const response = new Response(JSON.stringify(queue));
    await cache.put('/api-queue', response);
  } catch (error) {
    console.error('SW: Failed to save API queue:', error);
  }
}

async function clearQueuedApiRequests() {
  await saveApiQueue([]);
}

// Analytics queuing
async function queueAnalytics(data) {
  const queue = await getAnalyticsQueue();
  queue.push({
    ...data,
    timestamp: Date.now()
  });
  await saveAnalyticsQueue(queue);
}

async function getQueuedAnalytics() {
  return await getAnalyticsQueue();
}

async function getAnalyticsQueue() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match('/analytics-queue');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('SW: Failed to get analytics queue:', error);
  }
  return [];
}

async function saveAnalyticsQueue(queue) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(queue));
    await cache.put('/analytics-queue', response);
  } catch (error) {
    console.error('SW: Failed to save analytics queue:', error);
  }
}

async function clearQueuedAnalytics() {
  await saveAnalyticsQueue([]);
}

async function sendAnalyticsBatch(data) {
  // Implement actual analytics sending logic here
  console.log('SW: Sending analytics batch:', data.length, 'events');
}

// Push notifications
self.addEventListener('push', event => {
  console.log('SW: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/favico/android-chrome-192x192.png',
    badge: '/favico/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Update',
        icon: '/favico/favicon-32x32.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favico/favicon-32x32.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ZeroMotion Marketing', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread with mobile optimizations
self.addEventListener('message', event => {
  console.log('SW: Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  // Mobile-specific message handlers
  if (event.data && event.data.type === 'CACHE_CRITICAL_RESOURCES') {
    event.waitUntil(cacheCriticalResources());
  }

  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.waitUntil(getCacheInfo(event.ports[0]));
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearCache(event.data.cacheName));
  }
});

// Mobile-optimized critical resource caching
async function cacheCriticalResources() {
  try {
    const cache = await caches.open(STATIC_CACHE);

    // Cache hero images and critical assets for mobile
    const criticalAssets = [
      '/brand/ZeroMotion-Outline.png',
      '/favico/android-chrome-512x512.png'
    ];

    await cache.addAll(criticalAssets);
    console.log('SW: Critical mobile assets cached successfully');
  } catch (error) {
    console.error('SW: Failed to cache critical mobile assets:', error);
  }
}

// Get cache information for debugging
async function getCacheInfo(port) {
  try {
    const cacheNames = await caches.keys();
    const cacheInfo = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      cacheInfo[cacheName] = requests.length;
    }

    port.postMessage({
      success: true,
      cacheInfo,
      version: CACHE_NAME
    });
  } catch (error) {
    port.postMessage({
      success: false,
      error: error.message
    });
  }
}

// Clear specific cache
async function clearCache(cacheName) {
  try {
    if (cacheName) {
      await caches.delete(cacheName);
      console.log(`SW: Cache ${cacheName} cleared successfully`);
    } else {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      console.log('SW: All caches cleared successfully');
    }
  } catch (error) {
    console.error('SW: Failed to clear cache:', error);
  }
}

// Mobile performance monitoring
let networkRequests = 0;
let cacheHits = 0;

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Track network requests for performance monitoring
  networkRequests++;

  // Skip external requests (except fonts)
  if (!request.url.startsWith(self.location.origin) &&
      !request.url.includes('fonts.googleapis.com') &&
      !request.url.includes('fonts.gstatic.com')) {
    return;
  }

  // In development, always fetch fresh
  if (isDevelopment) {
    event.respondWith(fetch(request));
    return;
  }

  // Find matching route strategy
  const routeStrategy = ROUTE_STRATEGIES.find(route =>
    route.pattern.test(request.url)
  );

  if (routeStrategy) {
    event.respondWith(handleRequest(request, routeStrategy));
  } else {
    // Default strategy for HTML pages with mobile optimization
    event.respondWith(handleRequest(request, {
      strategy: CACHE_STRATEGIES.NETWORK_FIRST,
      cache: DYNAMIC_CACHE,
      maxAge: 24 * 60 * 60 // 24 hours for pages
    }));
  }
});

// Periodic cleanup (only in production)
if (!isDevelopment) {
  setInterval(() => {
    cleanupCaches();
  }, 24 * 60 * 60 * 1000); // Daily cleanup
}

// PWA Installability Check (for debugging)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_PWA_INSTALLABILITY') {
    checkPWAInstallability(event.ports[0]);
  }
});

async function checkPWAInstallability(port) {
  try {
    // Check if service worker is controlling the page
    const isControlling = !!navigator.serviceWorker.controller;

    // Check if manifest is accessible
    const manifestResponse = await fetch('/favico/site.webmanifest');
    const hasManifest = manifestResponse.ok;

    // Check if app is installable
    const isInstallable = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true;

    // Check required PWA features
    const hasFetch = 'serviceWorker' in navigator;
    const hasNotification = 'Notification' in window;
    const hasPush = 'PushManager' in window;

    port.postMessage({
      success: true,
      pwaStatus: {
        isControlling,
        hasManifest,
        isInstallable,
        hasFetch,
        hasNotification,
        hasPush,
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    });
  } catch (error) {
    port.postMessage({
      success: false,
      error: error.message
    });
  }
}

// Enhanced error handling for mobile
self.addEventListener('error', event => {
  console.error('SW: Unhandled error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('SW: Unhandled promise rejection:', event.reason);
});

async function cleanupCaches() {
  console.log('SW: Performing cache cleanup');
  
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response && isExpired(response, 30 * 24 * 60 * 60)) { // 30 days
          await cache.delete(request);
          console.log('SW: Deleted expired cache entry:', request.url);
        }
      }
    }
  } catch (error) {
    console.log('SW: Error during cache cleanup:', error);
  }
}