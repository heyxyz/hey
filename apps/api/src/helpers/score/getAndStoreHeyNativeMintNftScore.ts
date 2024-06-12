import type { Address } from 'viem';

import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import { createPublicClient, http } from 'viem';
import { zora } from 'viem/chains';

import { zoraBalanceOfABI } from './zoraBalanceOfABI';

const getAndStoreHeyNativeMintNftScore = async (
  id: string,
  address: Address
) => {
  try {
    const client = createPublicClient({
      chain: zora,
      transport: http('https://rpc.zora.energy')
    });

    const tokenBalance = await client.readContract({
      abi: zoraBalanceOfABI,
      address: '0xF2086c0EAA8b34b0Eef73920D0b1B53f4146e2e4',
      args: [address as Address, 2n],
      functionName: 'balanceOf'
    });

    const hasNft = tokenBalance === 1n;

    if (hasNft) {
      await goodPg.query(
        `
          INSERT INTO "AdjustedProfileScore" (score, reason, "profileId")
          VALUES (1500, 'HeyNativeMintNftHolder', $1)
          ON CONFLICT ("profileId", reason)
          DO NOTHING;
        `,
        [id]
      );

      logger.info(
        `BJ - Hey Native Mint NFT holder score upserted for ${id} - ${address}`
      );
    }

    return true;
  } catch {
    logger.error(
      `BJ - Failed to get and store Hey Native Mint NFT score for ${id} - ${address}`
    );
    return false;
  }
};

export default getAndStoreHeyNativeMintNftScore;
