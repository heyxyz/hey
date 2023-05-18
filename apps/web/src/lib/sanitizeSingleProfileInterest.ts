/**
 * Sanitizes a single profile interest key into its label.
 *
 * @param profileInterest Profile interest key to sanitize
 * @returns Sanitized label
 */
const sanitizeSingleProfileInterest = (profileInterest: string): string => {
  // Check if it's a subcategory
  if (profileInterest.includes('__')) {
    return profileInterest.toLowerCase().split('__')[1].replaceAll('_', ' ');
  }

  return profileInterest.replaceAll('_', ' & ').toLowerCase();
};

export default sanitizeSingleProfileInterest;
