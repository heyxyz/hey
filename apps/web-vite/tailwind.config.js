import base from '@hey/ui/tailwind-preset';
import aspectRatio from '@tailwindcss/aspect-ratio';
import tailwindForms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  ...base,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/*.{ts,tsx}'],
  plugins: [aspectRatio, tailwindForms]
};
