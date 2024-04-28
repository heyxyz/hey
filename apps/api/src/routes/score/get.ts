import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import axios from 'axios';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import {
  SCORE_WORKER_URL,
  SWR_CACHE_AGE_1_HOUR_12_HRS
} from 'src/helpers/constants';
import prisma from 'src/helpers/prisma';
import { noBody } from 'src/helpers/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [cachedProfile, pro] = await prisma.$transaction([
      prisma.cachedProfileScore.findUnique({ where: { id: id as string } }),
      prisma.pro.findUnique({ where: { id: id as string } })
    ]);

    if (cachedProfile?.expiresAt && new Date() < cachedProfile.expiresAt) {
      logger.info(
        `Lens: Fetched profile score from cache for ${id} - ${cachedProfile.score}`
      );

      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_HOUR_12_HRS)
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

    const [scores, adjustedScores] = await Promise.all([
      lensPg.query(scoreQuery),
      prisma.adjustedProfileScore.findMany({
        where: { profileId: id as string }
      })
    ]);

    const sum = adjustedScores.reduce((acc, score) => acc + score.score, 0);

    if (!scores[0]) {
      return res.status(404).json({ success: false });
    }

    const score = Number(scores[0].score) + sum;

    const baseData = {
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      id: id as string,
      score: score < 0 ? 0 : score
    };

    const newCachedProfile = await prisma.cachedProfileScore.upsert({
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
