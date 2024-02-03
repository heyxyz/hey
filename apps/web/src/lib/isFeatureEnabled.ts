import type { KillSwitch } from '@hey/data/feature-flags';

import { hydrateFeatureFlags } from 'src/store/persisted/useFeatureFlagsStore';

/**
 * Checks if a feature is enabled globally
 * @param key The kill switch key
 * @returns Whether the feature is enabled
 */
const isFeatureEnabled = (key: KillSwitch | string) => {
  const { killSwitches } = hydrateFeatureFlags();

  if (!killSwitches) {
    return false;
  }

  return killSwitches.includes(key);
};

export default isFeatureEnabled;
