const allowedBots =
  '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*';

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: { scrollRestoration: true },
  headers() {
    return [
      {
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin' }
        ],
        source: '/(.*)'
      }
    ];
  },
  reactStrictMode: false,
  redirects() {
    return [
      {
        destination: 'https://discord.com/invite/B8eKhSSUwX',
        permanent: true,
        source: '/discord'
      },
      {
        destination:
          'https://explorer.gitcoin.co/#/round/424/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008-4',
        permanent: true,
        source: '/gitcoin'
      },
      // Forms
      {
        destination:
          'https://hey.height.app/?taskForm=Token-Allowlist-Request-mwarXOg6ks0A',
        permanent: true,
        source: '/-/token-request'
      },
      {
        destination:
          'https://hey.height.app/?taskForm=Verification-Request-fBxpj55hUMmf',
        permanent: true,
        source: '/-/verification-request'
      },
      {
        destination:
          'https://yoginth.notion.site/Hey-Changelog-eb2a41319c1b40be8e22e5deb01efd10',
        permanent: true,
        source: '/-/changelog'
      },
      {
        destination:
          'https://yoginth.notion.site/Hey-Portals-Open-Graph-Spec-ddbedce64a2d4e1a80f66db182159aff',
        permanent: true,
        source: '/-/portals'
      },
      {
        destination:
          'https://yoginth.notion.site/Hey-Moderation-Tool-Guide-ff1926a080fa44bc9d40ee534f627949',
        permanent: true,
        source: '/-/mod-guide'
      }
    ];
  },
  rewrites() {
    return [
      {
        destination: 'https://api.hey.xyz/sitemap/:match*',
        source: '/sitemaps/:match*'
      },
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
