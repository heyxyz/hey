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
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'prettier',
    'unicorn',
    'import',
    'perfectionist'
  ],
  rules: {
    curly: 'error',
    'no-unused-vars': 'off',
    'prettier/prettier': 'error',
    'unused-imports/no-unused-imports': 'error',
    'require-await': 'error',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'prefer-destructuring': ['error', { VariableDeclarator: { object: true } }],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off', // turn warn
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-use-before-define': 'error',
    'no-unexpected-multiline': 'error',
    'unicorn/better-regex': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/no-array-for-each': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-lonely-if': 'error',
    'unicorn/no-useless-undefined': 'error',
    'unicorn/prefer-array-find': 'error'
  },
  ignorePatterns: ['generated.ts', 'node_modules']
};
