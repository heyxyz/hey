import { aaveMembers } from './aave-members';
import { lineasterMembers } from './lineaster-members';

export const mainnetVerified = [...aaveMembers, ...lineasterMembers, '0x26'];

export const testnetVerified = [...aaveMembers, ...lineasterMembers, '0x26'];
