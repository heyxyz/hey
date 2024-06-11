import type { Address } from 'viem';

import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import { createPublicClient, http } from 'viem';
import { zora } from 'viem/chains';

const getAndStoreZorbScore = async (id: string, address: Address) => {
  try {
    const client = createPublicClient({
      chain: zora,
      transport: http('https://rpc.zora.energy')
    });

    const zorbBalance = await client.readContract({
      abi: [
        {
          inputs: [
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'uint256', name: 'id', type: 'uint256' }
          ],
          name: 'balanceOf',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function'
        }
      ],
      address: '0xF2086c0EAA8b34b0Eef73920D0b1B53f4146e2e4',
      args: [address as Address, 1n],
      functionName: 'balanceOf'
    });

    const hasZorb = zorbBalance === 1n;

    if (hasZorb) {
      await goodPg.query(
        `
          INSERT INTO "AdjustedProfileScore" (score, reason, "profileId")
          VALUES (2000, 'ZorbHolder', $1)
          ON CONFLICT ("profileId", reason)
          DO NOTHING;
        `,
        [id]
      );

      logger.info(`BJ - Zorb holder score upserted for ${id} - ${address}`);
    }

    return true;
  } catch {
    logger.error(
      `BJ - Failed to get and store Zorb score for ${id} - ${address}`
    );
    return false;
  }
};

export default getAndStoreZorbScore;
