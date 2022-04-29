const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching
  },
  images: {
    domains: ['ik.imagekit.io']
  },
  reactStrictMode: process.env.NODE_ENV === 'production'
})
