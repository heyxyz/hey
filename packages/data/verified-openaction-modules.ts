import { IS_MAINNET } from './constants';

export const VerifiedOpenActionModules = {
  RentableBillboard: IS_MAINNET
    ? '0x6487b9c720203ce95332cd06dcc18a78102a31d1'
    : '0x6487b9c720203ce95332cd06dcc18a78102a31d1',
  Swap: IS_MAINNET
    ? '0x3394E78a3389b1f0216F30fA0613f4975D0573C3'
    : '0x8a3fFD86C4409Eb3c3b94DCC5219024CCf6C6179'
};
