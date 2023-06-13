import { aaveMembers } from './aave-members';
import { lineasterMembers } from './lineaster-members';

export const mainnetVerified = [
  ...aaveMembers,
  ...lineasterMembers,
  '0x26', // linea
  '0x82', // chinzilla
  '0x87', // nakedwinnie
  '0x7a', // rooshee
  '0x33', // lovekosmas
  '0x8e', // chaindoe
  '0x6d' // emily
];

export const testnetVerified = [
  ...aaveMembers,
  ...lineasterMembers,
  '0x26', // linea
  '0x82', // chinzilla
  '0x87', // nakedwinnie
  '0x7a', // rooshee
  '0x33', // lovekosmas
  '0x8e', // chaindoe
  '0x6d' // emily
];
