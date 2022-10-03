import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'messages',
    name: 'Messages',
    enabledFor: [...lensterMembers, ...aaveMembers]
  }
];
