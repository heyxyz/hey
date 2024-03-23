const { withSentryConfig } = require('@sentry/nextjs');

const allowedBots =
  '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
          'https://yoginth.notion.site/Hey-Changelog-eb2a41319c1b40be8e22e5deb01efd10',
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
          'https://yoginth.notion.site/Hey-Moderation-Tool-Guide-ff1926a080fa44bc9d40ee534f627949',
        permanent: true,
        source: '/-/mod-guide'
      }
    ];
  },
  rewrites() {
    return [
      {
        destination: 'https://api.hey.xyz/sitemap/allProfiles',
        source: '/sitemaps/all-profiles'
      },
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

module.exports = withSentryConfig(
  nextConfig,
  { org: 'heyverse', project: 'web', silent: true },
  {
    automaticVercelMonitors: true,
    disableLogger: true,
    hideSourceMaps: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    widenClientFileUpload: true
  }
);
