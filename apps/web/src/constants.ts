import { IS_MAINNET } from '@hey/data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

// Web3
const POLYGON_MAINNET = {
  ...polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon.publicnode.com' }
};
const POLYGON_MUMBAI = {
  ...polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://polygon-mumbai-bor.publicnode.com' }
};
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id;
