import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import axios from 'axios';
import heyPg from 'src/db/heyPg';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import {
  CACHE_AGE_6_HOURS,
  SCORE_WORKER_URL,
  SUSPENDED_FEATURE_ID
} from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';
import calculateAdjustments from 'src/helpers/score/calculateAdjustments';

const getCachedProfileScore = async (id: string) => {
  return await heyPg.multi(
    `
    SELECT * FROM "CachedProfileScore" WHERE "id" = $1 LIMIT 1;
    SELECT * FROM "Pro" WHERE "id" = $1 LIMIT 1;
    SELECT * FROM "ProfileFeature" WHERE enabled = TRUE AND "featureId" = $2 AND "profileId" = $1;
  `,
    [id, SUSPENDED_FEATURE_ID]
  );
};

const getLensData = async (id: string, scoreQuery: string) => {
  return await Promise.all([
    lensPg.query(scoreQuery),
    lensPg.query(`SELECT owned_by FROM profile.record WHERE profile_id = $1`, [
      id
    ]),
    heyPg.query(`SELECT * FROM "AdjustedProfileScore" WHERE "profileId" = $1`, [
      id
    ])
  ]);
};

const updateCachedProfileScore = async (id: string, score: number) => {
  return await heyPg.query(
    `
    INSERT INTO "CachedProfileScore" ("id", "score", "expiresAt")
    VALUES ($1, $2, $3)
    ON CONFLICT ("id")
    DO UPDATE SET "score" = $2, "expiresAt" = $3
    RETURNING *;
  `,
    [
      id,
      score < 0 ? 0 : score,
      new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours
    ]
  );
};

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [cachedProfile, pro, suspended] = await getCachedProfileScore(
      id as string
    );

    if (suspended.length > 0) {
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_6_HOURS)
        .json({ score: 0, success: true });
    }

    const cachedProfileData = cachedProfile[0];
    if (
      cachedProfileData?.expiresAt &&
      new Date() < cachedProfileData.expiresAt
    ) {
      logger.info(
        `[Lens] Fetched profile score from cache for ${id} - ${cachedProfileData.score}`
      );
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_6_HOURS)
        .json({
          expiresAt: cachedProfileData.expiresAt,
          score: cachedProfileData.score,
          success: true
        });
    }

    const scoreQueryRequest = await axios.get(SCORE_WORKER_URL, {
      params: { id, pro: pro[0]?.id === id, secret: process.env.SECRET }
    });
    const scoreQuery = scoreQueryRequest.data.toString();

    const [scores, lensProfile, adjustedScores] = await getLensData(
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
    const newCachedProfile = await updateCachedProfileScore(
      id as string,
      totalScore
    );

    logger.info(
      `[Lens] Fetched profile score for ${id} - ${newCachedProfile[0]?.score} - Expires at: ${newCachedProfile[0]?.expiresAt}`
    );

    return res
      .status(200)
      .json({ score: newCachedProfile[0]?.score, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
