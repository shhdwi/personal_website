'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "f3ee79746da0791faabdba7d26281386",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/lib/icons/github_2x.png": "6401c06a4431eb5619083e6a1783ed63",
"assets/lib/icons/linkedin_2x.png": "05c47a776fed9b4cd955e073f6528255",
"assets/lib/icons/mob_dev.png": "0b269d07676728567ecc4515b45ee02a",
"assets/lib/icons/pen.png": "858e481ed2f6569c100ad50159f99f86",
"assets/lib/icons/twitter_2x.png": "d5011590d94aab0f6e051754d553459d",
"assets/lib/icons/web.png": "344fd3cde2e70569da2f0df1ef555759",
"assets/lib/images/book.jpg": "098f859444260948ad6c066a994015dc",
"assets/lib/images/expense.jpg": "ac19e5b871666df6694f0d249292d543",
"assets/lib/images/gdsc%2520banner.jpg": "a9e53dc4abe44592333fa572ccc63242",
"assets/lib/images/graph.jpg": "e98d830a24636f825bae8b663a3c5c8c",
"assets/lib/images/hydrogen.jpg": "2f52ba6e9bf4136082e17a1788a5183b",
"assets/lib/images/img1-left.png": "fb5ecb57810989235ffa56574fc9277f",
"assets/lib/images/img1-right.png": "1f5d9a5cdac6cdf4fb94d919856c8611",
"assets/lib/images/img2-left.png": "0c72ffc26d4b25df5c4e65e434a6abe4",
"assets/lib/images/img2-right.png": "5a162e5712e7170830be0aed24cc5b48",
"assets/lib/images/insta.png": "6877fc99e2f36909c43ed69a833e93eb",
"assets/lib/images/instag.png": "77a11af568eb6682ee7cd58ad99a3ac1",
"assets/lib/images/instagg.png": "5c6fd3d7e01159fe3b2df3cfdc8d64fb",
"assets/lib/images/instagram.png": "aa0c51a2ba698c737479f0bb20025c6b",
"assets/lib/images/inta.png": "2a10c2344a8291bbde864ffbdbde9895",
"assets/lib/images/loader.json": "a59f97db2fae4bf3baf0ecf4d54026e5",
"assets/lib/images/ok.png": "96a164931819b47031ab49bc9484a748",
"assets/lib/images/okok.png": "e5c03d35a3b2d0dd3e3e6197efdf5b69",
"assets/lib/images/shrish.jpeg": "4f681809feecb6707670fc97ee9906c6",
"assets/lib/images/shrish.png": "c6218c8e5dfc10cdd534c25afef6bb43",
"assets/NOTICES": "d930321909dd185861a5566c90505969",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "65ab15c5cba9cec7dc1baa23ec14311e",
"/": "65ab15c5cba9cec7dc1baa23ec14311e",
"main.dart.js": "adcaa5976a171916c371e4f7fd1b40cb",
"manifest.json": "3abcd20a2983d79ae79494a2ce385a7a",
"version.json": "03acefc4795e8573b194262cd3a4419f"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
