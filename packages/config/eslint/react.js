/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('./base.js'), 'plugin:react/recommended'],
  rules: {
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'react/self-closing-comp': 'error',
    'react/react-in-jsx-scope': 'off'
  },
  settings: { react: { version: 'detect' } }
};
