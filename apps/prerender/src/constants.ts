import { IS_MAINNET } from '@lenster/data/constants';

export const BASE_URL = IS_MAINNET
  ? 'https://lenster.xyz'
  : 'https://testnet.lenster.xyz';
