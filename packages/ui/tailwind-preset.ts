/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const LineaCyan = {
  ...colors.cyan,
  500: '#61dfff'
};

module.exports = {
  darkMode: 'class',
  theme: {
    screens: {
      xs: '300px',
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        gray: colors.zinc,
        brand: LineaCyan,
        green: colors.emerald,
        cyan: LineaCyan,
        dark: '#1D1D1D',
        darker: '#121212'
      }
    }
  },
  variants: {
    extend: {}
  }
};
