/**
 * Whether the regex lookbehind feature is available in the current environment.
 *
 * Safari older than 16.4 (released on 2023 March) does not support regex lookbehind.
 */
export const regexLookbehindAvailable: boolean = ((): boolean => {
  try {
    return "ab".replace(/(?<=a)b/g, "c") === "ac";
  } catch (error) {
    return false;
  }
})();
