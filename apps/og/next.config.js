const {
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  VERCEL_DEPLOYMENT_ID,
  VERCEL_GITHUB_COMMIT_SHA
} = process.env;
const COMMIT_SHA =
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || VERCEL_GITHUB_COMMIT_SHA || 'local';
const DEPLOYMENT_ID = VERCEL_DEPLOYMENT_ID || 'unknown';

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers() {
    return [
      {
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=172800, stale-while-revalidate=86400'
          },
          { key: 'X-Hey-Version', value: COMMIT_SHA },
          { key: 'X-Hey-Deployment', value: DEPLOYMENT_ID }
        ],
        source: '/(.*)'
      }
    ];
  },
  poweredByHeader: false
};

module.exports = nextConfig;
