// Deep Cuts service worker: pages are network-first (so updates land), with the cache as the offline fallback.
const V="dc-v1",CORE=["/", "/worldie/", "/buzzer/", "/walkoff/", "/hailmary/", "/hattrick/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{if(res.ok&&res.type==="basic"){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==="navigate"?caches.match("/"):Response.error()))));
  }else if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&res.type!=="opaque"){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})));
  }
});
