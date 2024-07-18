import type { Request, Response } from 'express';

import {
  generateLongExpiry,
  getRedis,
  getTtlRedis,
  setRedis
} from '@hey/db/redisClient';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import heyPg from 'src/db/heyPg';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_6_HOURS, SCORE_WORKER_URL } from 'src/helpers/constants';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { noBody } from 'src/helpers/responses';
import calculateAdjustments from 'src/helpers/score/calculateAdjustments';

const buildCacheKey = (id: string) => `score:${id}`;

const getDbData = async (id: string, scoreQuery: string) => {
  return await Promise.all([
    lensPg.query(scoreQuery),
    lensPg.query(`SELECT owned_by FROM profile_view WHERE profile_id = $1`, [
      id
    ]),
    heyPg.query(
      `SELECT * FROM "AdjustedProfileScore" WHERE "profileId" = $1;`,
      [id]
    )
  ]);
};

export const get = [
  rateLimiter({ requests: 50, within: 1 }),
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const [cachedScore, ttl] = await Promise.all([
        getRedis(buildCacheKey(id as string)),
        getTtlRedis(buildCacheKey(id as string))
      ]);

      if (cachedScore) {
        logger.info(
          `(cached) [Lens] Fetched profile score from cache for ${id} - ${cachedScore}`
        );

        return res
          .status(200)
          .setHeader('Cache-Control', CACHE_AGE_6_HOURS)
          .json({ score: Number(cachedScore), success: true, ttl });
      }

      const scoreQueryRequest = await axios.get(SCORE_WORKER_URL, {
        params: { id, secret: process.env.SECRET }
      });
      const scoreQuery = scoreQueryRequest.data.toString();

      const [scores, lensProfile, adjustedScores] = await getDbData(
        id as string,
        scoreQuery
      );

      calculateAdjustments(id as string, lensProfile[0]?.owned_by);

      const sumOfAdjustedScores = adjustedScores.reduce(
        (acc, score) => acc + score.score,
        0
      );
      if (!scores[0]) {
        return res.status(404).json({ success: false });
      }

      const totalScore = Number(scores[0].score) + sumOfAdjustedScores;
      await setRedis(
        buildCacheKey(id as string),
        totalScore,
        generateLongExpiry()
      );

      logger.info(`[Lens] Fetched profile score for ${id} - ${totalScore}`);

      return res.status(200).json({ score: totalScore, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
