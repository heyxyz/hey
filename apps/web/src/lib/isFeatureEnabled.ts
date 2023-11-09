import type { FeatureFlag } from '@hey/data/feature-flags';
import { featureFlags } from '@hey/data/feature-flags';

import getCurrentSessionProfileId from './getCurrentSessionProfileId';

const isFeatureEnabled = (key: FeatureFlag) => {
  const currentSessionProfileId = getCurrentSessionProfileId();

  if (!currentSessionProfileId) {
    return false;
  }
  const feature = featureFlags.find((f) => f.key === key);

  return feature?.enabledFor.includes(currentSessionProfileId);
};

export default isFeatureEnabled;
