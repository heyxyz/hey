/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es', 'ta', 'zh', 'kn', 'ru'],
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src']
    }
  ],
  fallbackLocales: {
    default: 'en'
  },
  formatOptions: {
    origins: true,
    lineNumbers: false
  },
  format: 'po',
  orderBy: 'origin',
  sourceLocale: 'en'
};
