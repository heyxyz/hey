import type { Address, Hex } from 'viem';

import { IS_MAINNET } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import {
  createPublicClient,
  decodeAbiParameters,
  encodeAbiParameters,
  http
} from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

import { PERMIT_2_ADDRESS } from '../../apps/web/src/constants';
import { Permit2 } from '../abis';

const RPC_URL = IS_MAINNET
  ? 'https://polygon-rpc.com'
  : 'https://rpc.ankr.com/polygon_mumbai';

function timeToMilliseconds(
  value: number,
  unit: 'd' | 'h' | 'min' | 'ms' | 's'
): number {
  const timeInMilliseconds = new Date();
  switch (unit) {
    case 'ms':
      timeInMilliseconds.setMilliseconds(value);
      break;
    case 's':
      timeInMilliseconds.setSeconds(value);
      break;
    case 'min':
      timeInMilliseconds.setMinutes(value);
      break;
    case 'h':
      timeInMilliseconds.setHours(value);
      break;
    case 'd':
      timeInMilliseconds.setDate(value);
      break;
    default:
      throw new Error('Invalid time unit');
  }
  return timeInMilliseconds.getTime();
}

/**
 * Converts an expiration (in milliseconds) to a deadline (in seconds) suitable for the EVM.
 * Permit2 expresses expirations as deadlines, but JavaScript usually uses milliseconds,
 * so this is provided as a convenience function.
 */
function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000);
}

const swapAbi = [
  {
    components: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'srcToken', type: 'address' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'erc20ForFee', type: 'uint256' },
      { internalType: 'uint256', name: 'erc20Needed', type: 'uint256' },
      { internalType: 'uint256', name: 'nativeNeeded', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
      { internalType: 'bytes', name: 'swapPath', type: 'bytes' }
    ],
    internalType: 'struct TokenWrapperInstructions',
    name: 'wrapperInstructions',
    type: 'tuple'
  },
  {
    components: [
      {
        components: [
          { internalType: 'uint8', name: 'swapperId', type: 'uint8' },
          { internalType: 'bytes', name: 'swapPayload', type: 'bytes' }
        ],
        internalType: 'struct SwapInstructions',
        name: 'swapInstructions',
        type: 'tuple'
      },
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'address', name: 'paymentOperator', type: 'address' },
      { internalType: 'address', name: 'refund', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' }
    ],
    internalType: 'struct SwapAndExecuteInstructions',
    name: 'instructions',
    type: 'tuple'
  },
  {
    components: [
      { internalType: 'bytes4', name: 'appId', type: 'bytes4' },
      { internalType: 'bytes4', name: 'affiliateId', type: 'bytes4' },
      { internalType: 'uint256', name: 'bridgeFee', type: 'uint256' },
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        internalType: 'struct Fee[]',
        name: 'appFees',
        type: 'tuple[]'
      }
    ],
    internalType: 'struct FeeData',
    name: 'feeData',
    type: 'tuple'
  },
  { internalType: 'bytes', name: 'signature', type: 'bytes' }
] as const;

const bridgeAbi = [
  {
    components: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'srcToken', type: 'address' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'erc20ForFee', type: 'uint256' },
      { internalType: 'uint256', name: 'erc20Needed', type: 'uint256' },
      { internalType: 'uint256', name: 'nativeNeeded', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
      { internalType: 'bytes', name: 'swapPath', type: 'bytes' }
    ],
    internalType: 'struct TokenWrapperInstructions',
    name: 'wrapperInstructions',
    type: 'tuple'
  },
  {
    components: [
      {
        components: [
          { internalType: 'uint8', name: 'swapperId', type: 'uint8' },
          { internalType: 'bytes', name: 'swapPayload', type: 'bytes' }
        ],
        internalType: 'struct SwapInstructions',
        name: 'preBridge',
        type: 'tuple'
      },
      {
        components: [
          { internalType: 'uint8', name: 'swapperId', type: 'uint8' },
          { internalType: 'bytes', name: 'swapPayload', type: 'bytes' }
        ],
        internalType: 'struct SwapInstructions',
        name: 'postBridge',
        type: 'tuple'
      },
      { internalType: 'uint8', name: 'bridgeId', type: 'uint8' },
      { internalType: 'uint256', name: 'dstChainId', type: 'uint256' },
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'address', name: 'paymentOperator', type: 'address' },
      { internalType: 'address', name: 'refund', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'bytes', name: 'additionalArgs', type: 'bytes' }
    ],
    internalType: 'struct BridgeInstructions',
    name: 'instructions',
    type: 'tuple'
  },
  {
    components: [
      { internalType: 'bytes4', name: 'appId', type: 'bytes4' },
      { internalType: 'bytes4', name: 'affiliateId', type: 'bytes4' },
      { internalType: 'uint256', name: 'bridgeFee', type: 'uint256' },
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        internalType: 'struct Fee[]',
        name: 'appFees',
        type: 'tuple[]'
      }
    ],
    internalType: 'struct FeeData',
    name: 'feeData',
    type: 'tuple'
  },
  { internalType: 'bytes', name: 'signature', type: 'bytes' }
] as const;

export const updateWraperParams = ({
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
  if (chainId != polygon.id) {
    const decoded = decodeAbiParameters(bridgeAbi, data);
    const tokenWraperInstructions = decoded[0];
    tokenWraperInstructions.nonce = nonce;
    tokenWraperInstructions.signature = signature;
    tokenWraperInstructions.deadline = deadline;
    return encodeAbiParameters(bridgeAbi, [
      tokenWraperInstructions,
      decoded[1],
      decoded[2],
      decoded[3]
    ]);
  } else {
    const decoded = decodeAbiParameters(swapAbi, data);
    const tokenWraperInstructions = decoded[0];
    tokenWraperInstructions.nonce = nonce;
    tokenWraperInstructions.signature = signature;
    tokenWraperInstructions.deadline = deadline;
    return encodeAbiParameters(swapAbi, [
      tokenWraperInstructions,
      decoded[1],
      decoded[2],
      decoded[3]
    ]);
  }
};

export const getAllowanceData = async ({
  owner,
  spender,
  token
}: {
  owner: Address;
  spender: Address;
  token: Address;
}) => {
  const client = createPublicClient({
    chain: IS_MAINNET ? polygon : polygonMumbai,
    transport: http(RPC_URL)
  });

  const allowanceData = await client.readContract({
    abi: Permit2,
    address: PERMIT_2_ADDRESS,
    args: [owner, token, spender],
    functionName: 'allowance'
  });

  return allowanceData;
};

export const constructPermit2Sig = async ({
  amount,
  from,
  token
}: {
  amount: bigint;
  from: Address;
  token: Address;
}) => {
  const spender = VerifiedOpenActionModules.DecentNFT;
  const allowanceData = await getAllowanceData({
    owner: from,
    spender: spender as `0x${string}`,
    token
  });

  const PERMIT2_DOMAIN_NAME = 'Permit2';
  const permit2Address = PERMIT_2_ADDRESS;
  const domain = {
    chainId: IS_MAINNET ? 137 : 80001,
    name: PERMIT2_DOMAIN_NAME,
    verifyingContract: permit2Address as `0x${string}`
  };

  const TOKEN_PERMISSIONS = [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ];

  const PERMIT_TRANSFER_FROM_TYPES = {
    PermitTransferFrom: [
      { name: 'permitted', type: 'TokenPermissions' },
      { name: 'spender', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ],
    TokenPermissions: TOKEN_PERMISSIONS
  };

  const PERMIT_SIG_EXPIRATION = timeToMilliseconds(30, 'min');
  const permitTransfer = {
    deadline: toDeadline(PERMIT_SIG_EXPIRATION),
    nonce: allowanceData[1],
    permitted: {
      amount,
      token
    },
    spender: spender as `0x${string}`
  } as const;
  return { domain, types: PERMIT_TRANSFER_FROM_TYPES, values: permitTransfer };
};

export const signPermitSignature = async (
  walletClient: any,
  amount: bigint,
  token: `0x${string}`
) => {
  if (walletClient == null) {
    throw new Error('no wallet client found');
  }
  const from = walletClient.account.address;
  const { domain, types, values } = await constructPermit2Sig({
    amount,
    from,
    token
  });

  const signature = await walletClient.signTypedData({
    domain,
    message: values,
    primaryType: 'PermitTransferFrom',
    types
  });

  return {
    deadline: values.deadline,
    nonce: values.nonce,
    signature
  };
};
