/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/:match*', destination: '/api/:match*' }];
  }
};

module.exports = nextConfig;
