import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import axios from 'axios';
import catchedError from 'src/lib/catchedError';
import {
  SCORE_WORKER_URL,
  SWR_CACHE_AGE_10_MINS_30_DAYS
} from 'src/lib/constants';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import heyPrisma from 'src/lib/heyPrisma';
import lensPrisma from 'src/lib/lensPrisma';
import { noBody } from 'src/lib/responses';

const toTemplateStringsArray = (array: string[]) => {
  const stringsArray: any = [...array];
  stringsArray.raw = array;
  return stringsArray;
};

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
        .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
        .json({
          expiresAt: cachedProfile.expiresAt,
          score: cachedProfile.score,
          success: true
        });
    }

    const client = createClickhouseClient();
    const scoreQueryResponse = await axios.get(SCORE_WORKER_URL, {
      params: { id, pro: pro?.id === id, secret: process.env.SECRET }
    });

    const lensScoreQuery = scoreQueryResponse.data[0].toString();
    const lensScorePromise = lensPrisma.$queryRaw<any>(
      toTemplateStringsArray([lensScoreQuery])
    );

    const heyScoreQuery = scoreQueryResponse.data[1].toString();
    const heyScorePromise = client
      .query({
        format: 'JSONEachRow',
        query: heyScoreQuery
      })
      .then((result) => result.json<{ score: number }>())
      .catch(() => null);

    const results = await Promise.allSettled([
      lensScorePromise,
      heyScorePromise
    ]);

    const lensScore =
      results[0].status === 'fulfilled' && results[0].value[0]
        ? Number(results[0].value[0]?.score)
        : 0;
    const heyScore =
      results[1].status === 'fulfilled' && results[1].value
        ? Number(results[1].value[0]?.score)
        : 0;

    if (lensScore === 0 && heyScore === 0) {
      return res.status(404).json({ success: false });
    }

    const score = lensScore + heyScore || 0;
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
