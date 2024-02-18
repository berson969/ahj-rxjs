const cacheName = "messages-cache";
const urlsToCache = [
  "./src/index.html",
  "./src/css/style.css",
  "./bootstrap-5.0.1-dist/js/bootstrap.bundle.min.js",
  "./bootstrap-5.0.1-dist/css/bootstrap.min.css",
];

self.addEventListener("install", (event) => {
  console.log("Установлен");

  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(urlsToCache);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener("activate", () => {
  console.log("Активирован");
});

self.addEventListener("fetch", (event) => {
  console.log("Происходит запрос на сервер");
  const url = new URL(event.request.url);

  if (url.pathname === "/messages/start") {
    event.respondWith(
      fetch(url, {
        method: "POST",
      })
    );
  } else {
    event.respondWith(handleFetchRequest(event.request));
  }
});

async function handleFetchRequest(request) {
  const cache = await caches.open(cacheName);

  try {
    if (navigator.onLine) {
      const response = await fetch(request.url);
      const clonedResponse = response.clone();
      await cache.put(request, clonedResponse);
      return response;
    } else {
      const cachedResponse = await cache.match(request);
      return (
        cachedResponse ||
        new Response(JSON.stringify({ messages: [] }), {
          headers: { "Content-Type": "application/json" },
        })
      );
    }
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return (
      cachedResponse ||
      new Response(JSON.stringify({ messages: [] }), {
        headers: { "Content-Type": "application/json" },
      })
    );
  }
}
