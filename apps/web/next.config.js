const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['data'],
  reactStrictMode: false,
  experimental: { scrollRestoration: true },
  async rewrites() {
    return [
      {
        source: '/sitemaps/:match*',
        destination: 'https://api.hey.xyz/sitemap/:match*'
      },
      {
        source: '/u/(.*)',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value:
              '.*twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot.*'
          }
        ],
        destination: 'https://rishi.app'
      },
      {
        source: '/u/lens/(.*)',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value:
              '.*twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot.*'
          }
        ],
        destination: 'https://rishi.app'
      },
      {
        source: '/posts/(.*)',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value:
              '.*twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot.*'
          }
        ],
        destination: 'https://rishi.app'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.com/invite/B8eKhSSUwX',
        permanent: true
      },
      {
        source: '/donate',
        destination: 'https://giveth.io/project/hey?utm_source=hey',
        permanent: true
      },
      {
        source: '/u/lens/:username*',
        destination: '/u/:username*',
        permanent: true
      },
      {
        source: '/gitcoin',
        destination:
          'https://explorer.gitcoin.co/#/round/424/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008-4',
        permanent: true
      },
      // Forms
      {
        source: '/-/token-request',
        destination:
          'https://hey.height.app/?taskForm=Token-Allowlist-Request-mwarXOg6ks0A',
        permanent: true
      },
      {
        source: '/-/verification-request',
        destination:
          'https://hey.height.app/?taskForm=Verification-Request-fBxpj55hUMmf',
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin' }
        ]
      },
      { source: '/about', headers },
      { source: '/privacy', headers },
      { source: '/thanks', headers }
    ];
  }
};

module.exports = nextConfig;
