import type { Address } from 'viem';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import { createPublicClient, http } from 'viem';
import { zora } from 'viem/chains';

import { zoraBalanceOfABI } from './zoraBalanceOfABI';

const getAndStoreHeyZorbNftScore = async (id: string, address: Address) => {
  try {
    const client = createPublicClient({
      chain: zora,
      transport: http('https://rpc.zora.energy')
    });

    const tokenBalance = await client.readContract({
      abi: zoraBalanceOfABI,
      address: '0xF2086c0EAA8b34b0Eef73920D0b1B53f4146e2e4',
      args: [address as Address, 1n],
      functionName: 'balanceOf'
    });

    const hasNft = tokenBalance === 1n;

    if (hasNft) {
      await heyPg.query(
        `
          INSERT INTO "AdjustedProfileScore" (score, reason, "profileId")
          VALUES (2000, 'ZorbHolder', $1)
          ON CONFLICT ("profileId", reason)
          DO NOTHING;
        `,
        [id]
      );

      logger.info(
        `[Worker] Hey Zorb NFT holder score upserted for ${id} - ${address}`
      );
    }

    return true;
  } catch {
    throw new Error('Failed to get and store Hey Zorb NFT score');
  }
};

export default getAndStoreHeyZorbNftScore;
