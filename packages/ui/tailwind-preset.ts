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
        brand: {
          50: '#FED5D9',
          100: '#FEB9C0',
          200: '#FD9EA7',
          300: '#FC7481',
          400: '#FC5868',
          500: '#FB3A5D',
          600: '#FA1128',
          700: '#DA041A',
          800: '#AE0415',
          900: '#83030F'
        },
        gray: colors.zinc,
        green: colors.emerald
      }
    }
  },
  variants: { extend: {} }
};
