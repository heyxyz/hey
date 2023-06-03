module.exports = {
  extends: [require.resolve('./base.js'), 'next', 'next/core-web-vitals'],
  rules: {
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'react/jsx-no-useless-fragment': 'error',
    'react/self-closing-comp': 'error',
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off'
  }
};
