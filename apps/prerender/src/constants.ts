import { IS_MAINNET } from '@hey/data/constants';

export const BASE_URL = IS_MAINNET
  ? 'https://lenster.xyz'
  : 'https://testnet.hey.xyz';
