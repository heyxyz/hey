/** @type {import('tailwindcss').Config} */
const base = require('ui/tailwind-preset');

module.exports = {
  ...base,
  content: ['./stories/**/*.{ts,tsx}', '../../packages/ui/src/*.{ts,tsx}'],
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')]
};
