/** @type {import('next').NextConfig} */
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './themes.config.tsx'
});

module.exports = withNextra({
  transpilePackages: ['data'],
  reactStrictMode: true
});
