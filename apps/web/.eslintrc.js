/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('@hey/config/eslint/react.js')],
  ignorePatterns: ["sw.js"]
};
