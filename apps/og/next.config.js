const { CF_PAGES_COMMIT_SHA } = process.env;
const COMMIT_SHA = CF_PAGES_COMMIT_SHA || 'local';

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers() {
    return [
      {
        headers: [{ key: 'X-Hey-Version', value: COMMIT_SHA }],
        source: '/(.*)'
      }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true
};

module.exports = nextConfig;
