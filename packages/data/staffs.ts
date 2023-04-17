import { aaveMembers } from 'aave-members';

import { lensterMembers } from './lenster-members';

export const mainnetStaffs = [...lensterMembers, ...aaveMembers];

export const testnetStaffs = [
  '0x15', // yoginth.test
  '0x01aa', // lenster.test
  '0x2f' // sasicodes.test
];
