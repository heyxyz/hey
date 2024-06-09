/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'always',
  bracketSpacing: true,
  semi: true,
  useTabs: false,
  trailingComma: 'none',
  singleQuote: true,
  tabWidth: 2,
  endOfLine: 'auto',
  plugins: [require.resolve('prettier-plugin-tailwindcss')]
};
