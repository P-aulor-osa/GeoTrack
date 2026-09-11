// Nome do cache onde os arquivos do aplicativo serão armazenados.
const CACHE_NAME = "geotrack-v2";

// Arquivos principais que queremos deixar disponíveis offline.
const ARQUIVOS = [
    "./",
    "./index.html",
    "./resultado.html",
    "./style.css",
    "./index.js",
    "./resultado.js",
    "./manifest.json",

    // Fontes
    "./LeagueSpartan-Bold.ttf",
    "./BeVietnamPro-Regular.ttf",

    // Ícones
    "./icons/icon-192.jpeg",
    "./icons/icon-512.jpeg"
];


// --------------------------------------------------
// INSTALL
// --------------------------------------------------

// O evento "install" acontece quando o service worker é instalado pela primeira vez.
self.addEventListener("install", (event) => {

    // Espera o cache terminar de ser criado antes de considerar a instalação concluída.
    event.waitUntil(

        // Abre/cria nosso cache.
        caches.open(CACHE_NAME)
            .then((cache) => {

                // Guarda os arquivos definidos acima no cache.
                return cache.addAll(ARQUIVOS);
            })
    );
});


// --------------------------------------------------
// ACTIVATE
// --------------------------------------------------

// O evento "activate" acontece quando o service worker assume o controle da página.
self.addEventListener("activate", (event) => {

    event.waitUntil(

        // Procura todos os caches existentes.
        caches.keys()
            .then((cachesExistentes) => {

                return Promise.all(

                    cachesExistentes
                        .filter((cache) => cache !== CACHE_NAME)

                        // Apaga caches antigos.
                        .map((cache) => caches.delete(cache))
                );
            })
    );
});


// --------------------------------------------------
// FETCH
// --------------------------------------------------

// O evento "fetch" acontece sempre que a página tenta buscar algum recurso.
self.addEventListener("fetch", (event) => {

    event.respondWith(

        // Primeiro tenta encontrar o arquivo no cache.
        caches.match(event.request)
            .then((respostaCache) => {

                // Se encontrou no cache, usa ele.
                if (respostaCache) {
                    return respostaCache;
                }

                // Se não encontrou, busca normalmente
                // pela internet.
                return fetch(event.request);
            })
    );
});