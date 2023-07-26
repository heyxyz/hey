import { IS_MAINNET } from '@lenster/data/constants';
import getRpc from '@lenster/lib/getRpc';
import { polygon, polygonMumbai } from 'wagmi/chains';

// Web3
export const POLYGON_MAINNET = {
  ...polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: getRpc(137) }
};
export const POLYGON_MUMBAI = {
  ...polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: getRpc(80001) }
};
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id;
