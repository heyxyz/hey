/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['lens']);
const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }];
const isProd = process.env.VERCEL_ENV === 'production';

module.exports = withTM({
  reactStrictMode: false,
  trailingSlash: false,
  assetPrefix: isProd ? 'https://petals.lenster.xyz' : '',
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://sitemap.lenster.xyz/sitemap.xml'
      },
      {
        source: '/sitemaps/:match*',
        destination: 'https://sitemap.lenster.xyz/sitemaps/:match*'
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
        destination: 'https://gitcoin.co/grants/5007/lenster',
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
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin' },
          { key: 'Permissions-Policy', value: 'interest-cohort=()' }
        ]
      },
      { source: '/about', headers },
      { source: '/privacy', headers },
      { source: '/thanks', headers }
    ];
  }
});
