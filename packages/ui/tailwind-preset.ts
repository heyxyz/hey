const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
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
        brand: colors.violet,
        red: colors.red,
        pink: colors.pink,
        blue: colors.blue,
        green: colors.emerald,
        yellow: colors.yellow
      }
    }
  },
  variants: {
    extend: {}
  }
};
