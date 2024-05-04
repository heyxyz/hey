import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import axios from 'axios';
import heyPg from 'src/db/heyPg';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import {
  SCORE_WORKER_URL,
  SWR_CACHE_AGE_1_HOUR_12_HRS
} from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [cachedProfile, pro] = await heyPg.multi(
      `
        SELECT * FROM "CachedProfileScore"
        WHERE "id" = $1
        LIMIT 1;

        SELECT * FROM "Pro"
        WHERE "id" = $1
        LIMIT 1;
      `,
      [id as string]
    );

    if (
      cachedProfile[0]?.expiresAt &&
      new Date() < cachedProfile[0].expiresAt
    ) {
      logger.info(
        `Lens: Fetched profile score from cache for ${id} - ${cachedProfile[0].score}`
      );

      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_HOUR_12_HRS)
        .json({
          expiresAt: cachedProfile[0].expiresAt,
          score: cachedProfile[0].score,
          success: true
        });
    }

    const scoreQueryRequest = await axios.get(SCORE_WORKER_URL, {
      params: { id, pro: pro[0]?.id === id, secret: process.env.SECRET }
    });
    const scoreQuery = scoreQueryRequest.data.toString();

    const [scores, adjustedScores] = await Promise.all([
      lensPg.query(scoreQuery),
      heyPg.query(
        `SELECT * FROM "AdjustedProfileScore" WHERE "profileId" = $1`,
        [id as string]
      )
    ]);

    const sum = adjustedScores.reduce((acc, score) => acc + score.score, 0);

    if (!scores[0]) {
      return res.status(404).json({ success: false });
    }

    const score = Number(scores[0].score) + sum;

    const newCachedProfile = await heyPg.query(
      `
        INSERT INTO "CachedProfileScore" ("id", "score", "expiresAt")
        VALUES ($1, $2, $3)
        ON CONFLICT ("id")
        DO UPDATE SET "score" = $2, "expiresAt" = $3
        RETURNING *;
      `,
      [
        id as string,
        score < 0 ? 0 : score,
        new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
      ]
    );

    logger.info(
      `Lens: Fetched profile score for ${id} - ${newCachedProfile[0]?.score} - Expires at: ${newCachedProfile[0]?.expiresAt}`
    );

    return res
      .status(200)
      .json({ score: newCachedProfile[0]?.score, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
