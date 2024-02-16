self.addEventListener('install',  (event) => {
  console.log('Установлен');

  event.waitUntil(
       caches.open('messages-cache')
          .then((cache) => {
            cache.addAll([
              './src/index.html',
              './src/css/style.css'
            ])
          })
           .then(() => self.skipWaiting())
  )
});

self.addEventListener('activate', (event) => {
  console.log('Активирован');
});



self.addEventListener("fetch", (event) => {
    console.log('Происходит запрос на сервер');
    event.respondWith(handleFetchRequest(event.request));
});

async function handleFetchRequest(request) {

    const cache = await caches.open('messages-cache');
    console.log("request",request.url)

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
          )
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
