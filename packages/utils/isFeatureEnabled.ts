import { IS_MAINNET } from 'data/constants';
import { featureFlags } from 'data/feature-flags';

/**
 * Returns whether a given feature is enabled for a given profile ID.
 * @param featureKey - The key of the feature to check.
 * @param profileId - The ID of the profile to check.
 * @returns Whether the feature is enabled for the given profile ID.
 */
const isFeatureEnabled = (featureKey: string, profileId: string): boolean => {
  const feature = featureFlags.find((f) => f.key === featureKey);
  if (!feature) {
    return false;
  }

  return IS_MAINNET ? feature.enabledFor.includes(profileId) : true;
};

export default isFeatureEnabled;
