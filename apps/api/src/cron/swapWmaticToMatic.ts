import type { Address } from 'viem/accounts';

import { POLYGONSCAN_URL } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import getRpc from 'src/helpers/getRpc';
import { createPublicClient, createWalletClient, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon } from 'viem/chains';

const OWNER_ADDRESS = '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF';
const WMATIC_ADDRESS = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';

const swapWmaticToMatic = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  logger.info('Cron: Swapping WMATIC for MATIC');

  const abi = [
    {
      constant: false,
      inputs: [{ name: 'wad', type: 'uint256' }],
      name: 'withdraw',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ];

  const wallet = process.env.ADMIN_PRIVATE_KEY;
  const account = privateKeyToAccount(wallet as Address);
  const walletClient = createWalletClient({
    account,
    chain: polygon,
    transport: getRpc({ mainnet: true })
  });
  const publicClient = createPublicClient({
    chain: polygon,
    transport: getRpc({ mainnet: true })
  });

  const relayAdminBalance = await publicClient.getBalance({
    address: OWNER_ADDRESS
  });

  const isLessThanFiveMatic = parseInt(formatEther(relayAdminBalance)) < 5;

  if (isLessThanFiveMatic) {
    logger.info('Cron: Not enough MATIC to swap');
    return;
  }

  // Swap WMATIC for MATIC
  const wmaticBalance = await publicClient.readContract({
    abi: [
      {
        inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    address: WMATIC_ADDRESS,
    args: [OWNER_ADDRESS],
    functionName: 'balanceOf'
  });

  const wmaticBalanceFormatted = formatEther(wmaticBalance);

  if (parseInt(wmaticBalanceFormatted) < 50) {
    logger.info(
      `Cron: WMATIC is below the threshold - ${wmaticBalanceFormatted} < 50`
    );
    return;
  }

  const hash = await walletClient.writeContract({
    abi,
    address: WMATIC_ADDRESS,
    args: [wmaticBalance],
    functionName: 'withdraw'
  });

  logger.info(
    `Swapped ${formatEther(wmaticBalance)} WMATIC for MATIC - ${POLYGONSCAN_URL}/tx/${hash}`
  );
};

export default swapWmaticToMatic;
