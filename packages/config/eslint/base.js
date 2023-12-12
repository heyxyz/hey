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
  plugins: ['@typescript-eslint', 'unicorn', 'import', 'perfectionist'],
  rules: {
    curly: 'error',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'prefer-destructuring': ['error', { VariableDeclarator: { object: true } }],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-use-before-define': 'error',
    'no-unexpected-multiline': 'error',
    'unicorn/better-regex': 'error'
  },
  ignorePatterns: ['generated.ts', 'node_modules']
};
