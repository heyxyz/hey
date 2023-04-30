/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src']
    }
  ],
  extractBabelOptions: {
    presets: ['@babel/preset-typescript', '@babel/preset-react']
  },
  format: 'po',
  formatOptions: {
    origins: true,
    lineNumbers: false
  },
  orderBy: 'origin',
  locales: ['en', 'es', 'ta', 'zh', 'kn', 'ru'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en'
  }
};
