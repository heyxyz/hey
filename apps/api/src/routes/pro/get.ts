import type { Handler } from 'express';

import { HeyPro } from '@hey/abis';
import { HEY_PRO, IS_MAINNET } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import getRpc from 'src/helpers/getRpc';
import prisma from 'src/helpers/prisma';
import { noBody } from 'src/helpers/responses';
import { createPublicClient } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const pro = await heyPg.query(`SELECT * FROM "Pro" WHERE "id" = $1;`, [
      id as string
    ]);

    if (pro[0]?.expiresAt && new Date() < pro[0]?.expiresAt) {
      logger.info(`Fetched pro status from cache for ${id}`);

      return res.status(200).json({
        cached: true,
        result: { expiresAt: pro[0].expiresAt, isPro: true },
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
