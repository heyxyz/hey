const base = require("@hey/ui/tailwind-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/*.{ts,tsx}"],
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")]
};
