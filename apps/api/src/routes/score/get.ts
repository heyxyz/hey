import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import axios from 'axios';
import heyPg from 'src/db/heyPg';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import {
  CACHE_AGE_30_MINS,
  SCORE_WORKER_URL,
  SUSPENDED_FEATURE_ID,
  SWR_CACHE_AGE_1_HOUR_12_HRS
} from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';
import calculateAdjustments from 'src/helpers/score/calculateAdjustments';
import syncToStack from 'src/helpers/score/syncToStack';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [cachedProfile, pro, suspended] = await heyPg.multi(
      `
        SELECT * FROM "CachedProfileScore" WHERE "id" = $1 LIMIT 1;
        SELECT * FROM "Pro" WHERE "id" = $1 LIMIT 1;
        SELECT * FROM "ProfileFeature" WHERE enabled = TRUE AND "featureId" = $2 AND "profileId" = $1;
      `,
      [id as string, SUSPENDED_FEATURE_ID]
    );

    if (suspended.length > 0) {
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_30_MINS)
        .json({ score: 0, success: true });
    }

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

    const [scores, lensProfile, adjustedScores] = await Promise.all([
      lensPg.query(scoreQuery),
      lensPg.query(
        `SELECT owned_by FROM profile.record WHERE profile_id = $1`,
        [id as string]
      ),
      heyPg.query(
        `SELECT * FROM "AdjustedProfileScore" WHERE "profileId" = $1`,
        [id as string]
      )
    ]);

    // Background job to calculate adjustments
    calculateAdjustments(id as string, lensProfile[0]?.owned_by);

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
        new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours
      ]
    );

    syncToStack(lensProfile[0]?.owned_by, newCachedProfile[0]?.score);

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
