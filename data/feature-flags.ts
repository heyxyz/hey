import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';
import { xmtpMembers } from './xmtp-members';

export const featureFlags = [
  {
    key: 'messages',
    name: 'Messages',
    enabledFor: [...lensterMembers, ...aaveMembers, ...xmtpMembers]
  },
  {
    key: 'composer-v2',
    name: 'Composer v2',
    enabledFor: [...lensterMembers]
  }
];
