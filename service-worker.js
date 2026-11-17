const CACHE_NAME = "techservice-v1"
const RUNTIME_CACHE = "techservices-runtime-v1"

// RECURSOS QUE ESTARÁN DISPONIBLES SIN CONEXIÓN A INTERNET

const APP_SHELL = [
    "./",
    "./index.html",
    "./offline.html",
    "manifest.json",
    "./css/estilos.css",
    "./js/app.js",
    "./img/logo.svg",
    "./img/icons/icon-192.png",
    "./lib/fontawesome/css/all.min.css",
    "./lib/fontawesome/css/all.min.css",
    "./lib/fontawesome/css/webfonts/fa-brands-400.ttf",
    "./lib/fontawesome/css/webfonts/fa-brands-400.woff2",
    "./lib/fontawesome/css/webfonts/fa-regular-400.ttf",
    "./lib/fontawesome/css/webfonts/fa-brands-400.woff2",
    "./lib/fontawesome/css/webfonts/fa-solid-400.ttf",
    "./lib/fontawesome/css/webfonts/fa-solid-900.woff2",
    "./lib/fontawesome/css/webfonts/fa-v4compatibility.ttf",
    "./lib/fontawesome/css/webfonts/fa-v4compatibility.woff2"
]

// INSTALL - GUARDAMOS EL APPSHELL EN CACHE STORAGE

self.addEventListener("insttal", (eventp) => {
    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting)
        )
})

//Activate - Eliminamos versiones antiguas de cache
self.addEventListener("activate", (evento) => {
    const cachesPermitidos = [CACHE_NAME, RUNTIME_CACHE]
    evento.waitUntil(
        caches.keys()
        .then((nombres) => Promise.all(
            nombres
            .filter((nombre) => !cachesPermitidos.includes(nombre)).map((nombre) => caches.delete(nombre))
        ))
        .then(() => self.clients.claim())
    )
})

//Fetch - Usamos network first con respaldo offline, y con recursos externos usamos stale while revalidate
 self.addEventListener("fetch", (evento) => {
    const   solicitud  = evento.request
if (solicitud.mode === "navigate") {
    evento.respondWith(
        fetch(solicitud)
            .then((respuestaRed) => {
                const COPIA = respuestaRed.clone();

                return caches.open(RUNTIME_CACHE)
                    .then((cache) => {
                        return cache.put(solicitud, COPIA);
                    })
                    .then(() => {
                        return respuestaRed;
                    });
            })
            .catch(async () => {
                return (
                    await caches.match(solicitud) ||
                    await caches.match("./index.html") ||
                    await caches.match("./offline.html")
                );
            })
    );

    return;
}

//RECURSOS LOCALES DEL PROYECTO
if(url.origin === self.location.origin){
    evento.respondWith(
        caches.match(solicitud)
            .then((respuestaCache) => {
                if (respuestaCache) {
                    return respuestaCache
                }
                return fetch(solicitud)
                    .then((respuestaRed) => {
                        if (!resputaRed || resputaRed.status !== 200){
                            return respuestaRed
                        }
                        const copia = resputaRed.clone()
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => cache.put(solicitud,copia))
                            return respuestaRed
                    })
            })
    )
    return;
}

//RECURSOS ADICIONALES
evento.respondWith(
    caches.open(RUNTIME_CACHE).then(async (cache) => {
        const respuestaCache = await cache.match(solicitud)
        const actualizacion = fetch(solicitud)
            .then((resputaRed) => {
                if (resputaRed && (resputaRed.ok || respuestaRed.type === "opaque")) {
                    cache.put(solicitud, resputaRed.clone())
                }
                return respuestaRed
            })
            .catch(() => respuestaCache)
            return respuestaCache || actualizacion
    })
)   