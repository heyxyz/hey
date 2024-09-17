import type { Address, Hex, WalletClient } from "viem";

import { Bridge, Swap } from "@hey/abis";
import { IS_MAINNET, PERMIT_2_ADDRESS } from "@hey/data/constants";
import { POLYGON_AMOY_RPCS, POLYGON_RPCS } from "@hey/data/rpcs";
import { VerifiedOpenActionModules } from "@hey/data/verified-openaction-modules";
import {
  http,
  createPublicClient,
  decodeAbiParameters,
  encodeAbiParameters,
  fallback,
  parseAbi
} from "viem";
import { polygon, polygonAmoy } from "viem/chains";

const timeToMilliseconds = (
  value: number,
  unit: "d" | "h" | "min" | "ms" | "s"
): number => {
  const timeInMilliseconds = new Date();
  switch (unit) {
    case "ms":
      timeInMilliseconds.setMilliseconds(value);
      break;
    case "s":
      timeInMilliseconds.setSeconds(value);
      break;
    case "min":
      timeInMilliseconds.setMinutes(value);
      break;
    case "h":
      timeInMilliseconds.setHours(value);
      break;
    case "d":
      timeInMilliseconds.setDate(value);
      break;
    default:
      throw new Error("Invalid time unit");
  }
  return timeInMilliseconds.getTime();
};

/**
 * Converts an expiration (in milliseconds) to a deadline (in seconds) suitable for the EVM.
 * Permit2 expresses expirations as deadlines, but JavaScript usually uses milliseconds,
 * so this is provided as a convenience function.
 */
const toDeadline = (expiration: number): number => {
  return Math.floor((Date.now() + expiration) / 1000);
};

export const permit2SignatureAmount = ({
  chainId,
  data
}: {
  chainId: number;
  data: Hex;
}) => {
  if (chainId !== polygon.id) {
    const decoded = decodeAbiParameters(Bridge, data);
    const tokenWrapperInstructions = decoded[0];
    return tokenWrapperInstructions.amountIn;
  }

  const decoded = decodeAbiParameters(Swap, data);
  const tokenWrapperInstructions = decoded[0];
  return tokenWrapperInstructions.amountIn;
};

export const updateWrapperParams = ({
  chainId,
  data,
  deadline,
  nonce,
  signature
}: {
  chainId: number;
  data: Hex;
  deadline: bigint;
  nonce: bigint;
  signature: Hex;
}) => {
  if (chainId !== polygon.id) {
    const decoded = decodeAbiParameters(Bridge, data);
    const tokenWrapperInstructions = decoded[0];
    tokenWrapperInstructions.nonce = nonce;
    tokenWrapperInstructions.signature = signature;
    tokenWrapperInstructions.deadline = deadline;
    return encodeAbiParameters(Bridge, [
      tokenWrapperInstructions,
      decoded[1],
      decoded[2],
      decoded[3]
    ]);
  }

  const decoded = decodeAbiParameters(Swap, data);
  const tokenWrapperInstructions = decoded[0];
  tokenWrapperInstructions.nonce = nonce;
  tokenWrapperInstructions.signature = signature;
  tokenWrapperInstructions.deadline = deadline;
  return encodeAbiParameters(Swap, [
    tokenWrapperInstructions,
    decoded[1],
    decoded[2],
    decoded[3]
  ]);
};

export const getPermit2Allowance = async ({
  hash,
  owner,
  spender,
  token
}: {
  hash?: `0x${string}`;
  owner: Address;
  spender: Address;
  token: Address;
}) => {
  const client = createPublicClient({
    chain: IS_MAINNET ? polygon : polygonAmoy,
    transport: IS_MAINNET
      ? fallback(POLYGON_RPCS.map((rpc) => http(rpc)))
      : fallback(POLYGON_AMOY_RPCS.map((rpc) => http(rpc)))
  });

  if (hash) {
    await client.waitForTransactionReceipt({
      hash
    });
  }

  const allowanceData = await client.readContract({
    abi: parseAbi(["function allowance(address, address) returns (uint256)"]),
    address: token,
    args: [owner, spender],
    functionName: "allowance"
  });

  return allowanceData;
};

export const constructPermit2Sig = ({
  amount,
  token
}: {
  amount: bigint;
  token: Address;
}) => {
  const spender = VerifiedOpenActionModules.DecentNFT;

  const PERMIT2_DOMAIN_NAME = "Permit2";
  const permit2Address = PERMIT_2_ADDRESS;
  const domain = {
    chainId: IS_MAINNET ? polygon.id : polygonAmoy.id,
    name: PERMIT2_DOMAIN_NAME,
    verifyingContract: permit2Address as `0x${string}`
  };

  const TOKEN_PERMISSIONS = [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" }
  ];

  const PERMIT_TRANSFER_FROM_TYPES = {
    PermitTransferFrom: [
      { name: "permitted", type: "TokenPermissions" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ],
    TokenPermissions: TOKEN_PERMISSIONS
  };

  const PERMIT_SIG_EXPIRATION = timeToMilliseconds(30, "min");
  const permitTransfer = {
    deadline: toDeadline(PERMIT_SIG_EXPIRATION),
    nonce: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1,
    permitted: {
      amount,
      token
    },
    spender: spender as `0x${string}`
  } as const;
  return { domain, types: PERMIT_TRANSFER_FROM_TYPES, values: permitTransfer };
};

export const signPermitSignature = async (
  walletClient: WalletClient,
  amount: bigint,
  token: `0x${string}`
) => {
  if (!walletClient.account) {
    throw new Error("no account attached to wallet client");
  }
  const { domain, types, values } = constructPermit2Sig({
    amount,
    token
  });

  const signature = await walletClient.signTypedData({
    account: walletClient.account,
    domain,
    message: values,
    primaryType: "PermitTransferFrom",
    types
  });

  return {
    deadline: values.deadline,
    nonce: values.nonce,
    signature
  };
};
