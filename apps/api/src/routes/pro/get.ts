import type { Handler } from 'express';

import { HeyPro } from '@hey/abis';
import { HEY_PRO, IS_MAINNET } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import getRpc from 'src/lib/getRpc';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';
import { createPublicClient } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const pro = await prisma.pro.findUnique({
      where: { id: id as string }
    });

    if (pro?.expiresAt && new Date() < pro.expiresAt) {
      logger.info(`Fetched pro status from cache for ${id}`);

      return res.status(200).json({
        cached: true,
        result: { expiresAt: pro.expiresAt, isPro: true },
        success: true
      });
    }

    const client = createPublicClient({
      chain: IS_MAINNET ? polygon : polygonAmoy,
      transport: getRpc({ mainnet: IS_MAINNET })
    });

    const data = await client.readContract({
      abi: HeyPro,
      address: HEY_PRO,
      args: [id],
      functionName: 'proExpiresAt'
    });

    const jsonData = JSON.parse(data as string);
    const expiresAt = new Date(jsonData * 1000);
    const expired = expiresAt < new Date();

    if (expired) {
      return res
        .status(404)
        .json({ result: { expiresAt: null, isPro: false }, success: true });
    }

    const baseData = { expiresAt: new Date(expiresAt), id: id as string };
    const newPro = await prisma.pro.upsert({
      create: baseData,
      update: baseData,
      where: { id: id as string }
    });

    const result = { expiresAt: newPro.expiresAt, isPro: true };

    logger.info(`Fetched pro status for ${id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
