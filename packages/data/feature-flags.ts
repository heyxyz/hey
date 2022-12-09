import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'access-settings',
    name: 'Access settings',
    enabledFor: [...lensterMembers, ...aaveMembers]
  }
];
