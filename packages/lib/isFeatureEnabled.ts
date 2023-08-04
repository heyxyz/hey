import { IS_MAINNET } from '@lenster/data/constants';
import { featureFlags } from '@lenster/data/feature-flags';
import { Localstorage } from '@lenster/data/storage';

/**
 * Returns whether a given feature is enabled for a given profile ID.
 *
 * @param featureKey The key of the feature to check.
 * @returns Whether the feature is enabled or not.
 */
const isFeatureEnabled = (featureKey: string): boolean => {
  const user = JSON.parse(
    localStorage.getItem(Localstorage.AppStore) ||
      JSON.stringify({ state: { profileId: null } })
  );
  const feature = featureFlags.find((f) => f.key === featureKey);

  if (!feature) {
    return false;
  }

  return IS_MAINNET ? feature.enabledFor.includes(user.state.profileId) : true;
};

export default isFeatureEnabled;
