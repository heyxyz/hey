module.exports = {
  root: true,
  extends: ['weblint'],
  overrides: [
    {
      files: ['**/*.stories.{ts,tsx}'],
      extends: ['plugin:storybook/recommended'],
      rules: {}
    }
  ],
  rules: {
    'import/no-anonymous-default-export': 'off'
  }
};
