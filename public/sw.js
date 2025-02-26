// /sw.js
const CORE_CACHE_VERSION = 'MyFancyCacheName_v1';
const CORE_ASSETS = [
  '/',
  '/src/main.css',
  'https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.umd.js',
  '/src/main.js',
  '/manifest.json',
  `https://fdnd.directus.app/items/person/?filter={"id":237}`,
  `https://fdnd.directus.app/items/person/?filter={"_and":[{"squads":{"squad_id":{"tribe":{"name":"CMD%20Minor%20Web%20Dev"}}}},{"squads":{"squad_id":{"cohort":"2425"}}}]}`,
  'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE_VERSION).then((cache) => {
      // Add all the assets in the array to the 'MyFancyCacheName_v1'
      // `Cache` instance for later use.
      return cache.addAll(CORE_ASSETS).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Activating service worker');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch event: ', event.request.url);
  if (isCoreGetRequest(event.request)) {
    console.log('Core get request: ', event.request.url);
    // cache only strategy
    event.respondWith(
      caches
        .open(CORE_CACHE_VERSION)
        .then((cache) => cache.match(event.request.url))
    );
  } else if (isHtmlGetRequest(event.request)) {
    console.log('html get request', event.request.url);
    // generic fallback
    event.respondWith(
      caches
        .open('html-cache')
        .then((cache) => cache.match(event.request.url))
        .then((response) =>
          response ? response : fetchAndCache(event.request, 'html-cache')
        )
        .catch((e) => {
          return caches
            .open(CORE_CACHE_VERSION)
            .then((cache) => cache.match('/offline'));
        })
    );
  }
});

function fetchAndCache(request, cacheName) {
  return fetch(request).then((response) => {
    if (!response.ok) {
      throw new TypeError('Bad response status');
    }

    const clone = response.clone();
    caches.open(cacheName).then((cache) => cache.put(request, clone));
    return response;
  });
}

/**
 * Checks if a request is a GET and HTML request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is a GET and HTML request
 */
function isHtmlGetRequest(request) {
  return (
    request.method === 'GET' &&
    request.headers.get('accept') !== null &&
    request.headers.get('accept').indexOf('text/html') > -1
  );
}

/**
 * Checks if a request is a core GET request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is in the core mapping
 */
function isCoreGetRequest(request) {
  return (
    request.method === 'GET' && CORE_ASSETS.includes(getPathName(request.url))
  );
}

/**
 * Get a pathname from a full URL by stripping off domain
 *
 * @param {Object} requestUrl        The request object, e.g. https://www.mydomain.com/index.css
 * @returns {String}                Relative url to the domain, e.g. index.css
 */
function getPathName(requestUrl) {
  const url = new URL(requestUrl);
  return url.pathname;
}
