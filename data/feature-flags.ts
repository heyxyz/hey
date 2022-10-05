import { lensterMembers } from './lenster-members';
import { xmtpMembers } from './xmtp-members';

export const featureFlags = [
  {
    key: 'messages',
    name: 'Messages',
    enabledFor: [...lensterMembers, ...xmtpMembers]
  },
  {
    key: 'composer-v2',
    name: 'Composer v2',
    enabledFor: [...lensterMembers]
  }
];
