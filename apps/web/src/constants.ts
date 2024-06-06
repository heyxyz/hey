import { IS_MAINNET } from '@good/data/constants';
import { polygon, polygonAmoy } from 'wagmi/chains';

export const CHAIN = IS_MAINNET ? polygon : polygonAmoy;
