require("dotenv").config();
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_ETHERSCAN_API_KEY as string,
      polygonAmoy: process.env.POLYGON_ETHERSCAN_API_KEY as string
    },
    customChains: [
      {
        chainId: 80002,
        network: "polygonAmoy",
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  },
  networks: {
    polygon: {
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 200000000000, // 200 gwei
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    },
    polygonAmoy: {
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 100000000000, // 100 gwei
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    }
  },
  solidity: {
    settings: { optimizer: { enabled: true }, viaIR: true },
    version: "0.8.24"
  }
};

export default config;
