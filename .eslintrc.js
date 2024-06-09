module.exports = {
  // "extends": [
  //   "plugin:perfectionist/recommended-alphabetical"
  // ],
  // "plugins": ["perfectionist"],
  // "rules": {
  //   "perfectionist/sort-interfaces": "error"
  // },
  "rules": {
    "prettier/prettier": [
      "error", 
      {
        "endOfLine": "off"
      }
    ]
  },
  settings: {
    next: {
      rootDir: ['apps/*/']
    }
  }
};
