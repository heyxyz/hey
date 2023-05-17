import { aaveMembers } from './aave-members';
import { lineasterMembers } from './lineaster-members';

export const mainnetVerified = [...aaveMembers, ...lineasterMembers];

export const testnetVerified = [...aaveMembers, ...lineasterMembers];
