import { IS_MAINNET } from '@hey/data/constants';
import { polygon, polygonAmoy } from 'wagmi/chains';

export const PERMIT_2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
export const HEY_REFERRAL_PROFILE_ID = parseInt('0x0d').toString();
export const CHAIN = IS_MAINNET ? polygon : polygonAmoy;
