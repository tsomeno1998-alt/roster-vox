const CACHE = 'roster-vox-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (url.hostname !== location.hostname) return

  // /_next/static/ は cache-first（ハッシュ付きファイル名で永続キャッシュ可）
  if (url.pathname.startsWith('/_next/static/')) {
    e.respondWith(
      caches.match(request).then(cached => cached ?? fetch(request).then(res => {
        caches.open(CACHE).then(c => c.put(request, res.clone()))
        return res
      }))
    )
    return
  }

  // その他: network-first、失敗時はキャッシュ
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()))
        return res
      })
      .catch(() => caches.match(request))
  )
})
