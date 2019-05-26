var CACHE_TITLE = "md-cache";
var CACHE_VERSION = "v2";
var CACHE_NAME = CACHE_TITLE + "-" + CACHE_VERSION;
var urlsToCache = [
	"index.html",
	"gallery.html",
	"go.html",
	"login.html",
	"map.html",
	"pricing.html",
	"registration.html",
	"service-page.html",
	"google09e0df6a3450acd1.html",
	"manifest.json",
	"assets/bootstrap/css/bootstrap.min.css",
	"assets/bootstrap/js/bootstrap.min.js",
	"assets/css/smoothproducts.css",
	"assets/img/avatars/avatar1.jpg",
	"assets/img/avatars/avatar2.jpg",
	"assets/img/avatars/avatar3.jpg",
	"assets/img/scenery/image1.jpg",
	"assets/img/scenery/image4.jpg",
	"assets/img/scenery/image5.jpg",
	"assets/img/scenery/image6.jpg",
	"assets/img/favicon.png",
	"assets/img/main_background.jpg",
	"assets/img/main_background2.jpg",
	"assets/img/page-logo.png",
	"assets/img/temp_image1.jpg",
	"assets/img/temp_image2.jpg",
	"assets/img/temp_image3.jpg",
	"assets/img/temp_image4.jpg",
	"assets/img/temp_image5.jpg",
	"assets/img/temp_image6.jpg",
	"assets/js/jquery.min.js",
	"assets/js/main.js",
	"assets/js/smoothproducts.min.js",
	"assets/js/theme.js"
];

// Install
self.addEventListener("install", function(evt) {
	evt.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
		console.log("Cache Opened");
		return cache.addAll(urlsToCache);
	}))
})

// Fetch
self.addEventListener("fetch", function(evt) {
	evt.respondWith(caches.match(evt.request).then(function(response) {
		if (response) {
			return response;
		}
		return fetch(evt.request);
	}))
})

self.addEventListener("activate", function(evt) {
	evt.waitUntil(caches.keys().then(function(cacheNames) {
		return Promise.all(cacheNames.map(function(cacheName) {
			if (cacheName !== CACHE_NAME && cacheName.indexOf(CACHE_TITLE) === 0) {
				return caches.delete(cacheName);
			}
		}))
	}))
})
