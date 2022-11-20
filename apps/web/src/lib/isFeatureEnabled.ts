import { IS_MAINNET } from 'data/constants';
import { featureFlags } from 'data/feature-flags';

const isFeatureEnabled = (featureKey: string, profileId: string): boolean => {
  const feature = featureFlags.find((feature) => feature.key === featureKey);

  return IS_MAINNET ? feature?.enabledFor.includes(profileId) ?? false : true;
};

export default isFeatureEnabled;
