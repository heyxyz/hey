import type { KillSwitch } from '@hey/data/kill-switches';

import { hydrateKillSwitches } from 'src/store/persisted/useKillSwitchesStore';

/**
 * Checks if a feature is enabled globally
 * @param key The kill switch key
 * @returns Whether the feature is enabled
 */
const isFeatureEnabled = (key: KillSwitch) => {
  const { killSwitches } = hydrateKillSwitches();

  return killSwitches.includes(key);
};

export default isFeatureEnabled;
