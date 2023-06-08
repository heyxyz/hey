import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  networks: {
    hardhat: {},
    linea: {
      url: process.env.LINEA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY ?? ''],
    },
  },
};

export default config;
