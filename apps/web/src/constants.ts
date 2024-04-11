import { IS_MAINNET } from '@hey/data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

export const CHAIN = IS_MAINNET ? polygon : polygonMumbai;

export const PERMIT_2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'; // same on Polygon and Mumbai
