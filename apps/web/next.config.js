/** @type {import('next').NextConfig} */
const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }];

const nextConfig = {
  transpilePackages: ['data'],
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true,
    swcPlugins: [['@lingui/swc-plugin', {}]]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://sitemap.lenster.xyz/sitemap.xml'
      },
      {
        source: '/sitemaps/:match*',
        destination: 'https://sitemap.lenster.xyz/:match*'
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
        destination: 'https://bounties.gitcoin.co/grants/5007/lenster',
        permanent: true
      },
      {
        source: '/gitcoin',
        destination:
          'https://explorer.gitcoin.co/#/round/1/0x12bb5bbbfe596dbc489d209299b8302c3300fa40/0x12bb5bbbfe596dbc489d209299b8302c3300fa40-9',
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
          { key: 'Referrer-Policy', value: 'strict' }
        ]
      },
      { source: '/about', headers },
      { source: '/privacy', headers },
      { source: '/thanks', headers }
    ];
  }
};

module.exports = nextConfig;
