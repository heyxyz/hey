require('dotenv').config();

import type { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_ETHERSCAN_API_KEY!,
      polygonAmoy: process.env.POLYGON_ETHERSCAN_API_KEY!
    },
    customChains: [
      {
        chainId: 80002,
        network: 'polygonAmoy',
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com'
        }
      }
    ]
  },
  networks: {
    polygon: {
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 200000000000, // 200 gwei
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    },
    polygonAmoy: {
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 100000000000, // 100 gwei
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    }
  },
  solidity: {
    settings: { optimizer: { enabled: true }, viaIR: true },
    version: '0.8.24'
  },
  sourcify: { enabled: true }
};

export default config;
