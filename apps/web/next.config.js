const linguiConfig = require('./lingui.config');

const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  transpilePackages: ['data'],
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    swcPlugins: [['@lingui/swc-plugin', {}]]
  },
  i18n: {
    locales: linguiConfig.locales,
    defaultLocale: linguiConfig.sourceLocale
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://sitemap.hey.xyz/sitemap.xml'
      },
      {
        source: '/sitemaps/:match*',
        destination: 'https://sitemap.hey.xyz/:match*'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/u/:handle(.+).lens',
        destination: '/u/:handle',
        permanent: true
      },
      {
        source: '/u/:handle(.+).test',
        destination: '/u/:handle',
        permanent: true
      },
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
        source: '/gitcoin',
        destination:
          'https://explorer.gitcoin.co/#/round/10/0x8de918f0163b2021839a8d84954dd7e8e151326d/0x8de918f0163b2021839a8d84954dd7e8e151326d-2',
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
