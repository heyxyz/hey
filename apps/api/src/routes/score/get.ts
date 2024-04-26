import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import axios from 'axios';
import catchedError from 'src/lib/catchedError';
import {
  SCORE_WORKER_URL,
  SWR_CACHE_AGE_1_HOUR_24_HRS
} from 'src/lib/constants';
import heyPrisma from 'src/lib/heyPrisma';
import lensPrisma from 'src/lib/lensPrisma';
import { noBody } from 'src/lib/responses';

const toTemplateStringsArray = (array: string[]) => {
  const stringsArray: any = [...array];
  stringsArray.raw = array;
  return stringsArray;
};

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [cachedProfile, pro] = await heyPrisma.$transaction([
      heyPrisma.cachedProfileScore.findUnique({ where: { id: id as string } }),
      heyPrisma.pro.findUnique({ where: { id: id as string } })
    ]);

    if (cachedProfile?.expiresAt && new Date() < cachedProfile.expiresAt) {
      logger.info(
        `Lens: Fetched profile score from cache for ${id} - ${cachedProfile.score}`
      );

      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_HOUR_24_HRS)
        .json({
          expiresAt: cachedProfile.expiresAt,
          score: cachedProfile.score,
          success: true
        });
    }

    const scoreQueryRequest = await axios.get(SCORE_WORKER_URL, {
      params: { id, pro: pro?.id === id, secret: process.env.SECRET }
    });
    const scoreQuery = scoreQueryRequest.data.toString();
    const scores = await lensPrisma.$queryRaw<any>(
      toTemplateStringsArray([scoreQuery])
    );

    if (!scores[0]) {
      return res.status(404).json({ success: false });
    }

    const score = Number(scores[0].score);

    const baseData = {
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      id: id as string,
      score: score < 0 ? 0 : score
    };

    const newCachedProfile = await heyPrisma.cachedProfileScore.upsert({
      create: baseData,
      update: baseData,
      where: { id: id as string }
    });

    logger.info(
      `Lens: Fetched profile score for ${id} - ${newCachedProfile.score} - Expires at: ${newCachedProfile.expiresAt}`
    );

    return res
      .status(200)
      .json({ score: newCachedProfile.score, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
