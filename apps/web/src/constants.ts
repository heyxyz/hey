import { IS_MAINNET } from 'data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

// Web3
export const RPC_URL = IS_MAINNET ? 'https://rpc.ankr.com/polygon' : 'https://rpc.ankr.com/polygon_mumbai';
export const POLYGON_MAINNET = {
  ...polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' }
};
export const POLYGON_MUMBAI = {
  ...polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
};
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id;
