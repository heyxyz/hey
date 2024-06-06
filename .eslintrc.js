module.exports = {
  "extends": [
    "plugin:perfectionist/recommended-alphabetical"
  ],
  "plugins": ["perfectionist"],
  "rules": {
    "perfectionist/sort-interfaces": "error"
  },
  settings: {
    next: {
      rootDir: ['apps/*/']
    }
  }
};
