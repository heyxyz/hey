/** @type {import('tailwindcss').Config} */
const TailwindPreset = require('ui/tailwind-preset');

module.exports = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/components/*.{ts,tsx}'],
  ...TailwindPreset
};
