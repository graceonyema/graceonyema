const staticCacheName="site-static-v2",filesToCache=["/","/about","/services","/contact","/styles/index.min.css","/styles/bootstrap.min.css","/scripts/index.min.js","/favicon.ico","/assets/icons/diagonals1.svg","/assets/icons/diagonals2.svg","/assets/icons/gracen_first_logo.png","/assets/icons/gracen_second_logo.png","https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css","https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"];self.addEventListener("install",s=>{s.waitUntil(async function(){const s=await caches.open(staticCacheName);await s.addAll(filesToCache)}())}),self.addEventListener("activate",s=>{s.waitUntil(async function(){const s=await caches.keys();await Promise.all(s.filter(s=>s.startsWith("site-static-")&&s!==staticCacheName).map(s=>{console.log("deleting old cache:",s),caches.delete(s)}))}())}),self.skipWaiting(),self.addEventListener("fetch",s=>{s.respondWith(async function(){const t=await caches.open(staticCacheName),a=await t.match(s.request),e=fetch(s.request);return s.waitUntil(async function(){const a=await e;await t.put(s.request,a.clone())}()),a||e}())});