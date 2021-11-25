const staticCacheName="site-static-v1",filesToCache=["/","/about","/services","/contact","/styles/bootstrap.min.css","/styles/index.min.css","/scripts/index.min.js","/favicon.ico","/assets/icons/logo2.png","/assets/icons/diagonals1.svg","/assets/icons/diagonals2.svg","/assets/images/grace_onyema_1_pic-400.jpg","/assets/images/grace_onyema_1_pic-400-2x.jpg","/assets/images/grace_onyema_1_pic-500.jpg","/assets/images/grace_onyema_1_pic-500-2x.jpg","https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"];self.addEventListener("install",s=>{s.waitUntil(async function(){const s=await caches.open(staticCacheName);await s.addAll(filesToCache)}())}),self.addEventListener("activate",s=>{s.waitUntil(async function(){const s=await caches.keys();await Promise.all(s.filter(s=>s.startsWith("site-static-")&&s!==staticCacheName).map(s=>{console.log("deleting old cache:",s),caches.delete(s)}))}())}),self.skipWaiting(),self.addEventListener("fetch",s=>{s.respondWith(async function(){const a=await caches.open(staticCacheName),t=await a.match(s.request),e=fetch(s.request);return s.waitUntil(async function(){const t=await e;await a.put(s.request,t.clone())}()),t||e}())});
