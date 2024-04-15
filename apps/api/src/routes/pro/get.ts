import type { Handler } from 'express';

import { HeyPro } from '@hey/abis';
import { HEY_PRO, IS_MAINNET } from '@hey/data/constants';
import catchedError from 'src/lib/catchedError';
import getRpc from 'src/lib/getRpc';
import { noBody } from 'src/lib/responses';
import { createPublicClient } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createPublicClient({
      chain: IS_MAINNET ? polygon : polygonAmoy,
      transport: getRpc({ mainnet: IS_MAINNET })
    });

    const data: any = await client.readContract({
      abi: HeyPro,
      address: HEY_PRO,
      args: [id],
      functionName: 'proExpiresAt'
    });

    const jsonData = JSON.parse(data);
    const expiresAt = jsonData ? new Date(jsonData * 1000) : null;

    const result = {
      expiresAt,
      isPro: expiresAt ? expiresAt > new Date() : false
    };

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
