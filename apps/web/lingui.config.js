/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  format: 'po',
  orderBy: 'origin',
  locales: ['en', 'es', 'ta', 'zh', 'ru', 'fr'],
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
