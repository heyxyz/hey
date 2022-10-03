import { featureFlags } from 'data/feature-flags';
import { IS_MAINNET } from 'src/constants';

const getFeatureEnabled = (featureKey: string, profileId: string): boolean => {
  const feature = featureFlags.find((feature) => feature.key === featureKey);

  return IS_MAINNET ? feature?.enabledFor.includes(profileId) ?? false : true;
};

export default getFeatureEnabled;
