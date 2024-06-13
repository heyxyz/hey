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
        "endOfLine": "auto"
      }
    ]
  },
  settings: {
    next: {
      rootDir: ['apps/*/']
    }
  }
};
