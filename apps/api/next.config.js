/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ['data'],
  async rewrites() {
    return [{ source: '/:path*', destination: '/api/:path*' }];
  }
};

module.exports = nextConfig;
