const { withSentryConfig } = require('@sentry/nextjs');

const allowedBots =
  '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
          'https://explorer.gitcoin.co/#/round/42161/25/1?utm_source=hey.xyz',
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
        destination: 'https://tana.pub/EltxDvrSt3Yn/hey-changelog',
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
