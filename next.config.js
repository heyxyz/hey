module.exports = {
  reactStrictMode: true,
  exportPathMap: async function () {
    return {
      '/u/yoginth': { page: '/u/[username]' }
    }
  }
}
