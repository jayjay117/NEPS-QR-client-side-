// NEPS-QR Service Worker

const CACHE_NAME = "neps-qr-cache-v1"
const urlsToCache = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/main.js",
    "images/neps_qr-logo.gif",
    "/images/hero-image.png",
    "/images/about-image.png",
    "/images/Business-home.png",
    "/images/individual-home.png",
    "/images/app-store.png",
    "/images/play-store.png",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css",
    "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js",
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
]

// Install event - cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache")
            return cache.addAll(urlsToCache)
        }),
    )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME]
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                }),
            )
        }),
    )
})

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response
                }

                // Clone the request
                const fetchRequest = event.request.clone()

                return fetch(fetchRequest).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response
                    }

                    // Clone the response
                    const responseToCache = response.clone()

                    caches.open(CACHE_NAME).then((cache) => {
                        // Don't cache if it's a Google Analytics request
                        if (!event.request.url.includes("google-analytics.com")) {
                            cache.put(event.request, responseToCache)
                        }
                    })

                    return response
                })
            })
            .catch(() => {
                // If both cache and network fail, show offline page
                if (event.request.mode === "navigate") {
                    return caches.match("/offline.html")
                }
            }),
    )
})

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
    if (event.tag === "sync-transactions") {
        event.waitUntil(syncTransactions())
    }
})

// Function to sync transactions when back online
function syncTransactions() {
    return new Promise((resolve, reject) => {
        // Get pending transactions from IndexedDB
        // This is a placeholder - actual implementation would depend on your data structure
        console.log("Syncing pending transactions")

        // Simulate successful sync
        setTimeout(() => {
            console.log("Transactions synced successfully")
            resolve()
        }, 2000)
    })
}
