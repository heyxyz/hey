import type { Request, Response } from 'express';

import { LensHub } from '@hey/abis';
import { IPFS_GATEWAY, IS_MAINNET, LENS_HUB } from '@hey/data/constants';
import daysToSeconds from '@hey/helpers/daysToSeconds';
import logger from '@hey/helpers/logger';
import randomNumber from '@hey/helpers/randomNumber';
import { CACHE_AGE_INDEFINITE_ON_DISK } from 'src/helpers/constants';
import getRpc from 'src/helpers/getRpc';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { getRedis, setRedis } from 'src/helpers/redisClient';
import { noBody } from 'src/helpers/responses';
import { createPublicClient } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

const getSvgImage = (base64Image: string) =>
  Buffer.from(base64Image, 'base64').toString('utf-8');

export const get = [
  rateLimiter({ requests: 2000, within: 1 }),
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const cacheKey = `avatar:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Downloaded Lenny avatar for ${id}`);
        return res
          .status(200)
          .setHeader('Cache-Control', CACHE_AGE_INDEFINITE_ON_DISK)
          .type('svg')
          .send(getSvgImage(cachedData));
      }

      const client = createPublicClient({
        chain: IS_MAINNET ? polygon : polygonAmoy,
        transport: getRpc({ mainnet: IS_MAINNET })
      });

      const data: any = await client.readContract({
        abi: LensHub,
        address: LENS_HUB,
        args: [id],
        functionName: 'tokenURI'
      });

      const jsonData = JSON.parse(
        Buffer.from(data.split(',')[1], 'base64').toString()
      );

      const base64Image = jsonData.image.split(';base64,').pop();

      await setRedis(
        cacheKey,
        base64Image,
        randomNumber(daysToSeconds(400), daysToSeconds(600))
      );
      logger.info(`Downloaded Lenny avatar for ${id}`);

      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_INDEFINITE_ON_DISK)
        .type('svg')
        .send(getSvgImage(base64Image));
    } catch {
      const url = `${IPFS_GATEWAY}/Qmb4XppdMDCsS7KCL8nCJo8pukEWeqL4bTghURYwYiG83i/cropped_image.png`;
      return res.status(302).redirect(url);
    }
  }
];
