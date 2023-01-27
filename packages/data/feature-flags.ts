import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'wav3s',
    name: 'Wav3s Integration',
    enabledFor: [...lensterMembers, ...aaveMembers]
  },
  {
    key: 'preferences-settings',
    name: 'Preferences settings',
    enabledFor: [...lensterMembers, ...aaveMembers]
  }
];
