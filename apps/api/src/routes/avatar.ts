import type { Handler } from 'express';

import { LensHub } from '@hey/abis';
import logger from '@hey/lib/logger';
import { ALCHEMY_URL, CACHE_AGE_INDEFINITE } from '@utils/constants';
import { noBody } from '@utils/responses';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: http(ALCHEMY_URL)
    });

    const data: any = await client.readContract({
      abi: LensHub,
      address: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
      args: [id],
      functionName: 'tokenURI'
    });

    const jsonData = JSON.parse(
      Buffer.from(data.split(',')[1], 'base64').toString()
    );

    const base64Image = jsonData.image.split(';base64,').pop();
    const svgImage = Buffer.from(base64Image, 'base64').toString('utf-8');
    logger.info(`Downloaded Lenny avatar for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_INDEFINITE)
      .type('svg')
      .send(svgImage);
  } catch {
    const url =
      'https://i.seadn.io/s/raw/files/b7a5afa354adaf5f988acd8b0ba2409e.jpg';
    return res.status(302).redirect(url);
  }
};
