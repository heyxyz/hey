import { IS_MAINNET } from '@hey/data/constants';
import { CookiesKeys, cookieStorage } from '@hey/data/cookieStorage';
import { featureFlags } from '@hey/data/feature-flags';

/**
 * Returns whether a given feature is enabled for a given profile ID.
 *
 * @param featureKey The key of the feature to check.
 * @returns Whether the feature is enabled or not.
 */
const isFeatureEnabled = (featureKey: string): boolean => {
  const user = JSON.parse(
    cookieStorage.getItem(CookiesKeys.AppStore) ||
      JSON.stringify({ state: { profileId: null } })
  );
  const feature = featureFlags.find((f) => f.key === featureKey);

  if (!feature) {
    return false;
  }

  return IS_MAINNET ? feature.enabledFor.includes(user.state.profileId) : true;
};

export default isFeatureEnabled;
