const postcss = require('postcss');

const randomClassNames = postcss.plugin('random-class-names', () => {
  return (root) => {
    root.walkRules((rule) => {
      if (rule.selector.startsWith('.')) {
        const randomName = 'a' + Math.random().toString(36).substring(2, 7);
        rule.selector = rule.selector.replace(/(\.[\w-]+)/g, `.${randomName}`);
      }
    });
  };
});

module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: {
      preset: 'advanced'
    },
    'random-class-names': randomClassNames,
    tailwindcss: {}
  }
};
