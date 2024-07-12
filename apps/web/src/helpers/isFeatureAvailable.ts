import type { FeatureFlag } from '@hey/data/feature-flags';

import { hydrateFeatureFlags } from 'src/store/persisted/useFeatureFlagsStore';

import getLensAuthData from './getLensAuthData';

/**
 * Checks if a feature is enabled for the current user
 * @param key The feature flag key
 * @returns Whether the feature is enabled
 */
const isFeatureAvailable = (key: FeatureFlag | string) => {
  const { id: sessionProfileId } = getLensAuthData();
  const featureFlags = hydrateFeatureFlags();

  if (!sessionProfileId) {
    return false;
  }

  return featureFlags.includes(key);
};

export default isFeatureAvailable;
