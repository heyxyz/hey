const allowedBots =
  '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*';

/** @type {import('next').NextConfig} */
module.exports = {
  headers() {
    return [
      {
        headers: [
          { key: 'Document-Policy', value: 'js-profiling' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin' }
        ],
        source: '/(.*)'
      }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: false,
  redirects() {
    return [
      {
        destination: '/?signup=true',
        permanent: false,
        source: '/signup'
      },
      {
        destination: 'https://discord.com/invite/B8eKhSSUwX',
        permanent: true,
        source: '/discord'
      },
      {
        destination:
          'https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1?referrer=0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF',
        permanent: true,
        source: '/zorb'
      },
      {
        destination:
          'https://explorer.gitcoin.co/#/round/42161/25/1?utm_source=bcharity.net',
        permanent: true,
        source: '/gitcoin'
      },
      // Forms
      {
        destination:
          'https://good.height.app/?taskForm=Token-Allowlist-Request-mwarXOg6ks0A',
        permanent: true,
        source: '/-/token-request'
      },
      {
        destination: 'https://tana.pub/EltxDvrSt3Yn/good-changelog',
        permanent: true,
        source: '/-/changelog'
      },
      {
        destination:
          'https://plugins.crisp.chat/urn:crisp.im:contact-form:0/contact/37355035-47aa-4f42-ad47-cffc3d1fea16',
        permanent: true,
        source: '/support'
      },
      {
        destination:
          'https://yoginth.notion.site/ff1926a080fa44bc9d40ee534f627949',
        permanent: true,
        source: '/-/mod-guide'
      }
    ];
  },
  rewrites() {
    return [
      {
        destination: `${process.env.NEXT_PUBLIC_OG_URL}/u/:match*`,
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        source: '/u/:match*'
      },
      {
        destination: `${process.env.NEXT_PUBLIC_OG_URL}/posts/:match*`,
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        source: '/posts/:match*'
      }
    ];
  },
  transpilePackages: ['data']
};
