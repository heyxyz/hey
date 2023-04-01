/** @type {import('next').NextConfig} */
const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }];
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {
    sentry: {
      hideSourceMaps: true
    },
    transpilePackages: ['data'],
    reactStrictMode: false,
    experimental: {
      scrollRestoration: true,
      newNextLinkBehavior: true,
      swcPlugins: [['@lingui/swc-plugin', {}]]
    },
    async rewrites() {
      return [
        { source: '/collect/:match*', destination: 'https://api.mixpanel.com/:match*' },
        { source: '/sitemap.xml', destination: 'https://sitemap.lenster.xyz/sitemap.xml' },
        { source: '/sitemap/:match*', destination: 'https://sitemap.lenster.xyz/:match*' }
      ];
    },
    async redirects() {
      return [
        { source: '/u/:handle(.+).lens', destination: '/u/:handle', permanent: true },
        { source: '/u/:handle(.+).test', destination: '/u/:handle', permanent: true },
        { source: '/discord', destination: 'https://discord.com/invite/B8eKhSSUwX', permanent: true },
        {
          source: '/donate',
          destination: 'https://bounties.gitcoin.co/grants/5007/lenster',
          permanent: true
        },
        {
          source: '/gitcoin',
          destination:
            'https://grant-explorer.gitcoin.co/#/round/1/0xd95a1969c41112cee9a2c931e849bcef36a16f4c/0xbe519f8c8f7ff2acb359dd757c5d2bf25b05d9fd29b8684885aa27f1fa487fcf-0xd95a1969c41112cee9a2c931e849bcef36a16f4c',
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
  },
  { silent: true }
);
