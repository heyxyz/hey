const allowedBots =
  '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { scrollRestoration: true },
  async headers() {
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
  async redirects() {
    return [
      {
        destination: 'https://discord.com/invite/B8eKhSSUwX',
        source: '/discord'
      },
      {
        destination: 'https://giveth.io/project/hey?utm_source=hey',
        source: '/donate'
      },
      {
        destination:
          'https://explorer.gitcoin.co/#/round/424/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008-4',
        source: '/gitcoin'
      },
      // Forms
      {
        destination:
          'https://hey.height.app/?taskForm=Token-Allowlist-Request-mwarXOg6ks0A',
        source: '/-/token-request'
      },
      {
        destination:
          'https://hey.height.app/?taskForm=Verification-Request-fBxpj55hUMmf',
        source: '/-/verification-request'
      },
      {
        destination: 'https://tally.so/r/3No6NQ',
        source: '/-/trusted'
      },
      {
        destination:
          'https://reflect.site/g/yoginth/-hey-changelog/c6eae172c9cd43cebfc38b5afc64e456',
        source: '/-/changelog'
      },
      {
        destination:
          'https://reflect.site/g/yoginth/hey-portal-open-graph-spec/cd7225f128274da382f1f516e7e63f15',
        source: '/-/portals'
      }
    ];
  },
  async rewrites() {
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

module.exports = nextConfig;
