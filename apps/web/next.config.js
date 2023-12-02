/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  transpilePackages: ['data'],
  experimental: { scrollRestoration: true }
};

module.exports = nextConfig;
