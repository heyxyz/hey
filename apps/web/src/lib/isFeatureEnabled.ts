import type { KillSwitch } from '@hey/data/feature-flags';

import { hydrateKillSwitches } from 'src/store/persisted/useKillSwitchesStore';

/**
 * Checks if a feature is enabled globally
 * @param key The kill switch key
 * @returns Whether the feature is enabled
 */
const isFeatureEnabled = (key: KillSwitch | string) => {
  const killSwitches = hydrateKillSwitches();

  if (!killSwitches) {
    return false;
  }

  return killSwitches.includes(key);
};

export default isFeatureEnabled;
