/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: ['plugin:perfectionist/recommended-alphabetical'],
  plugins: ['@typescript-eslint', 'unicorn', 'perfectionist'],
  rules: {
    curly: 'error',
    'prefer-destructuring': ['error', { VariableDeclarator: { object: true } }],
    'no-unexpected-multiline': 'error',
    'unicorn/better-regex': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'error'
  },
  ignorePatterns: ['generated.ts', 'node_modules']
};
