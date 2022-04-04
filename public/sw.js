if (!self.define) {
  let e,
    s = {}
  const n = (n, t) => (
    (n = new URL(n + '.js', t).href),
    s[n] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = n), (e.onload = s), document.head.appendChild(e)
        } else (e = n), importScripts(n), s()
      }).then(() => {
        let e = s[n]
        if (!e) throw new Error(`Module ${n} didn’t register its module`)
        return e
      })
  )
  self.define = (t, a) => {
    const i =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[i]) return
    let r = {}
    const c = (e) => n(e, i),
      d = { module: { uri: i }, exports: r, require: c }
    s[i] = Promise.all(t.map((e) => d[e] || c(e))).then((e) => (a(...e), r))
  }
}
define(['./workbox-75794ccf'], function (e) {
  'use strict'
  importScripts('fallback-CzBPXGeCddMEVPvM3kG-A.js'),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/CzBPXGeCddMEVPvM3kG-A/_buildManifest.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/CzBPXGeCddMEVPvM3kG-A/_middlewareManifest.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/CzBPXGeCddMEVPvM3kG-A/_ssgManifest.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/202.729df87647c41fef.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/390-c2bc7a359ae74ef7.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/398-1c260e7cb741a5bd.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/419-0896965a78e600be.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/732-08e61bcf8aa28ad4.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/743.ecb6f9072880012f.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/748-a570519be11f43aa.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/838-78badf418c4ed604.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/framework-bb5c596eafb42b22.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/main-f47a8edd3e6c3835.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/404-573f3feaf5129eef.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/500-21c11732c8680c13.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/_app-9df86aad489d16e2.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/_error-0509152792d2b207.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/_offline-fba74c4ccf40040f.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/communities-8fee6e334f018269.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/communities/%5Bid%5D-744935da67384234.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/communities/create-e75c29072faeceda.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/create-d8257e17e98676e4.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/crowdfunds/create-a7db1e0fe376047e.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/explore-6341970552bc49e8.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/index-392515d6e50fb632.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/notifications-da7028cfa6b56b4c.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/posts/%5Bid%5D-f45fba041e7b3abb.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/settings-7805a31f848eeb3e.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/settings/account-a00bd612429ec9fb.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/settings/allowance-26ca7db9bb921be8.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/settings/delete-97200114edadd71a.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/thanks-2c81666687cb9016.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/pages/u/%5Busername%5D-dbc18805536bf5d3.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/polyfills-5cd94c89d3acac5f.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/chunks/webpack-0892109dffb5ed83.js',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        {
          url: '/_next/static/css/31524f0bddd35ff3.css',
          revision: 'CzBPXGeCddMEVPvM3kG-A'
        },
        { url: '/_offline', revision: 'CzBPXGeCddMEVPvM3kG-A' },
        { url: '/ens.svg', revision: '644b49c89af8f37a753a04bde4649075' },
        { url: '/eth-white.svg', revision: '24ceec7272261d795f0039c02f0d46c1' },
        { url: '/favicon.svg', revision: '20a391483a10c6c2eda99a9167ceaf07' },
        { url: '/logo.svg', revision: '24f9ae3cafeb4ac30050ade77f4e6260' },
        {
          url: '/wallet/coinbase.svg',
          revision: '62578f5994645a1825d4829e2c4394b0'
        },
        {
          url: '/wallet/metamask.svg',
          revision: 'fbf33967fa244d21d61fb85f233fc331'
        },
        {
          url: '/wallet/walletconnect.svg',
          revision: '8215855c185176eb79446ce8cc1f3998'
        }
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: t
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers
                  })
                : s
          },
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) }
        ]
      }),
      'GET'
    )
})
