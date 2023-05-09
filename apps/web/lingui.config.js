/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  format: 'po',
  orderBy: 'origin',
  locales: ['en', 'zh', 'fr', 'ru', 'ta'],
  sourceLocale: 'en',
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
  }
};
