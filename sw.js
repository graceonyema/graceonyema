const staticCacheName="site-static-v7",filesToCache=["/","/about","/services","/contact","/styles/index.min.css","/styles/bootstrap.min.css","/scripts/index.min.js","/favicon.ico","/assets/icons/diagonals1.svg","/assets/icons/diagonals2.svg","/assets/icons/gracen_first_logo.png","/assets/icons/gracen_first_logo-2x.png","/assets/icons/gracen_second_logo.png","/assets/icons/gracen_second_logo-2x.png","/assets/images/grace_onyema_1_pic-400.jpg","/assets/images/grace_onyema_1_pic-400-2x.jpg","/assets/images/grace_onyema_1_pic-500.jpg","/assets/images/grace_onyema_1_pic-500-2x.jpg","/assets/images/grace_onyema_1_pic-600.jpg","https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"];self.addEventListener("install",s=>{s.waitUntil(async function(){const s=await caches.open(staticCacheName);await s.addAll(filesToCache)}())}),self.addEventListener("activate",s=>{s.waitUntil(async function(){const s=await caches.keys();await Promise.all(s.filter(s=>s.startsWith("site-static-")&&s!==staticCacheName).map(s=>{console.log("deleting old cache:",s),caches.delete(s)}))}())}),self.skipWaiting(),self.addEventListener("fetch",s=>{s.respondWith(async function(){const a=await caches.open(staticCacheName),e=await a.match(s.request),t=fetch(s.request);return s.waitUntil(async function(){const e=await t;await a.put(s.request,e.clone())}()),e||t}())});