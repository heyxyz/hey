import { LENS_TESTNET_RPCS } from "@hey/data/rpcs";
import { TokenStandard } from "@hey/indexer";
import { chains } from "@lens-network/sdk/viem";
import {
  createPublicClient,
  fallback,
  getContract,
  http,
  isAddress
} from "viem";

const client = createPublicClient({
  chain: chains.testnet,
  transport: fallback(
    LENS_TESTNET_RPCS.map((rpc) => http(rpc, { batch: true }))
  )
});

const isContract = async (address: `0x${string}`) => {
  const code = await client.getBytecode({ address });
  return code !== null;
};

const erc20ABI = [
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256" }]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint8" }]
  }
];

const isERC20 = async (address: `0x${string}`) => {
  try {
    const contract = getContract({ address, abi: erc20ABI, client });
    await contract.read.totalSupply();
    await contract.read.balanceOf([
      "0x0000000000000000000000000000000000000000"
    ]);
    return true;
  } catch {
    return false;
  }
};

const erc721ABI = [
  {
    name: "supportsInterface",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "bytes4" }],
    outputs: [{ type: "bool" }]
  }
];

const isERC721 = async (address: `0x${string}`) => {
  try {
    const contract = getContract({ address, abi: erc721ABI, client });
    return await contract.read.supportsInterface(["0x80ac58cd"]);
  } catch {
    return false;
  }
};

const isERC1155 = async (address: `0x${string}`) => {
  try {
    const contract = getContract({ address, abi: erc721ABI, client });
    return await contract.read.supportsInterface(["0xd9b67a26"]);
  } catch {
    return false;
  }
};

const detectTokenType = async (address: `0x${string}`) => {
  if (!isAddress(address)) return "Invalid address";
  if (!(await isContract(address))) return "Not a contract";
  if (await isERC20(address)) return TokenStandard.Erc20;
  if (await isERC721(address)) return TokenStandard.Erc721;
  if (await isERC1155(address)) return TokenStandard.Erc1155;
  return "Unknown standard";
};

export default detectTokenType;
