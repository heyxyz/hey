export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const profileLinks = {
  twitter: 'https://twitter.com/heydotxyz'
};

export const defaultTitle = 'Hey';

export const defaultDescription = 'Hey';

import { IS_MAINNET } from '@hey/data/constants';

export const BASE_URL = IS_MAINNET
  ? 'https://hey.xyz'
  : 'https://testnet.hey.xyz';
