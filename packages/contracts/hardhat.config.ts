import type { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
  defaultNetwork: 'polygonMumbai',
  etherscan: {
    apiKey: {
      polygonMumbai: ''
    }
  },
  networks: {
    polygonMumbai: {
      accounts: [''],
      url: ''
    }
  },
  solidity: '0.8.23',
  sourcify: {
    enabled: true
  }
};

export default config;
