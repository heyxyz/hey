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
        permanent: true,
        source: '/discord'
      },
      {
        destination: 'https://giveth.io/project/hey?utm_source=hey',
        permanent: true,
        source: '/donate'
      },
      {
        destination: '/u/:username*',
        permanent: true,
        source: '/u/lens/:username*'
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
        destination: 'https://tally.so/r/3No6NQ',
        permanent: true,
        source: '/-/trusted'
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
