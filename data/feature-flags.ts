import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'composer-v2',
    name: 'Composer v2',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'access-settings',
    name: 'Access settings',
    enabledFor: [...lensterMembers]
  }
];
