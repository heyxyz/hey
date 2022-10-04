import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'messages',
    name: 'Messages',
    enabledFor: [
      ...lensterMembers,
      ...aaveMembers,
      '0xe248', // nick-molnar.lens
      '0x010e04', // elisealix22.lens
      '0x5cce' // saulmc.lens
    ]
  },
  {
    key: 'composer-v2',
    name: 'Composer v2',
    enabledFor: [...lensterMembers]
  }
];
