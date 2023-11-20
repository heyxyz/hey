import type { FeatureFlag } from '@hey/data/feature-flags';
import { featureFlags } from 'src/store/persisted/useFeatureFlagsStore';

import getCurrentSession from './getCurrentSession';

/**
 * Checks if a feature is enabled for the current user
 * @param key The feature flag key
 * @returns Whether the feature is enabled
 */
const isFeatureEnabled = (key: FeatureFlag) => {
  const { id: sessionProfileId } = getCurrentSession();

  if (!sessionProfileId) {
    return false;
  }

  return featureFlags().includes(key);
};

export default isFeatureEnabled;
