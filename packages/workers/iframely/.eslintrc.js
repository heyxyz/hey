module.exports = {
  root: true,
  extends: ['weblint'],
  rules: {
    'import/no-anonymous-default-export': 'off'
  },
  ignorePatterns: ['generated.ts']
};
