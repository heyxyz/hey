import type { KillSwitch } from '@hey/data/kill-switches';

import { enabledKillSwitches } from '@hey/data/kill-switches';

/**
 * Checks if a feature is enabled globally
 * @param key The kill switch key
 * @returns Whether the feature is enabled
 */
const isFeatureEnabled = (key: KillSwitch) => {
  return enabledKillSwitches.includes(key);
};

export default isFeatureEnabled;
