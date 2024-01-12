import { IS_MAINNET } from '@hey/data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

export const CHAIN = IS_MAINNET ? polygon : polygonMumbai;
