import type { KillSwitch } from '@hey/data/feature-flags';

import { IS_PREVIEW, IS_PRODUCTION } from '@hey/data/constants';
import { hydrateFeatureFlags } from 'src/store/persisted/useFeatureFlagsStore';

/**
 * Checks if a feature is enabled globally
 * @param key The kill switch key
 * @returns Whether the feature is enabled
 */
const isFeatureEnabled = (key: KillSwitch | string) => {
  console.log('yoginth before condition', IS_PRODUCTION, IS_PREVIEW);
  if (!IS_PRODUCTION || IS_PREVIEW) {
    return true;
  }

  console.log('yoginth after condition', IS_PRODUCTION, IS_PREVIEW);

  const { killSwitches } = hydrateFeatureFlags();

  console.log('yoginth killSwitches', killSwitches);

  if (!killSwitches) {
    return false;
  }

  console.log('yoginth key', key, killSwitches.includes(key));

  return killSwitches.includes(key);
};

export default isFeatureEnabled;
