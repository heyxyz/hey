require("dotenv").config();
import "@matterlabs/hardhat-zksync";
import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  zksolc: { version: "latest", settings: {} },
  defaultNetwork: "lensSepoliaTestnet",
  networks: {
    lensSepoliaTestnet: {
      accounts: [process.env.PRIVATE_KEY as string],
      url: "https://rpc.testnet.lens.dev",
      chainId: 37111,
      zksync: true,
      ethNetwork: "sepolia",
      verifyURL:
        "https://api-explorer-verify.staging.lens.zksync.dev/contract_verification"
    },
    hardhat: { zksync: true }
  }
};

export default config;
