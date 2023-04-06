/** @type {import('tailwindcss').Config} */
const TailwindPreset = require('./tailwind-preset');

module.exports = {
  content: ['./src/**/*.{ts,tsx,mdx}', './themes.config.tsx'],
  ...TailwindPreset
};
