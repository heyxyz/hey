module.exports = {
  root: true,
  extends: ['node'],
  rules: {
    'import/no-anonymous-default-export': 'off'
  },
  ignorePatterns: ['generated.ts']
};
