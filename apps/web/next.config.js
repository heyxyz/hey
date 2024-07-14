const allowedBots =
  '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*';
const {
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  VERCEL_DEPLOYMENT_ID,
  VERCEL_GITHUB_COMMIT_SHA
} = process.env;
const COMMIT_SHA =
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || VERCEL_GITHUB_COMMIT_SHA || 'local';
const DEPLOYMENT_ID = VERCEL_DEPLOYMENT_ID || 'unknown';

/** @type {import('next').NextConfig} */
module.exports = {
  headers() {
    return [
      {
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Hey-Version', value: COMMIT_SHA },
          { key: 'X-Hey-Deployment', value: DEPLOYMENT_ID }
        ],
        source: '/(.*)'
      }
    ];
  },
  poweredByHeader: false,
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
          'https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1?referrer=0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF',
        permanent: true,
        source: '/zorb'
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
        destination: 'https://heyverse.zohodesk.in/portal/en/newticket',
        permanent: true,
        source: '/support'
      },
      {
        destination:
          'https://yoginth.notion.site/ff1926a080fa44bc9d40ee534f627949',
        permanent: true,
        source: '/-/mod-guide'
      },
      // Redirect: hey.xyz/u/lens/<localname> > hey.xyz/u/<localname>
      {
        destination: '/u/:handle',
        permanent: true,
        source: '/u/:namespace/:handle'
      }
    ];
  },
  rewrites() {
    return [
      {
        destination: 'https://og.hey.xyz/u/:match*',
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        source: '/u/:match*'
      },
      {
        destination: 'https://og.hey.xyz/posts/:match*',
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        source: '/posts/:match*'
      }
    ];
  },
  transpilePackages: ['data']
};
