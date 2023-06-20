/**
 * Get user's locale for metadata
 *
 * @returns the user's locale or 'en-US' as default
 */
const getUserLocale = () => {
  return navigator?.languages?.length
    ? navigator.languages[0]
    : navigator.language;
};

export default getUserLocale;
