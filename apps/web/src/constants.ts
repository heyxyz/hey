import { IS_MAINNET } from '@hey/data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

export const CHAIN_ID = IS_MAINNET ? polygon.id : polygonMumbai.id;
