/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['data'],
  reactStrictMode: false,
  experimental: { scrollRestoration: true },
  images: { unoptimized: true }
};

module.exports = nextConfig;
