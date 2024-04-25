import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import axios from 'axios';
import catchedError from 'src/lib/catchedError';
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
    const cachedProfile = await heyPrisma.cachedProfileScore.findUnique({
      where: { id: id as string }
    });

    if (cachedProfile?.expiresAt && new Date() < cachedProfile.expiresAt) {
      logger.info(
        `Lens: Fetched profile score from cache for ${id} - ${cachedProfile.score}`
      );

      return res.status(200).json({
        expiresAt: cachedProfile.expiresAt,
        score: cachedProfile.score,
        success: true
      });
    }

    const scoreQueryRequest = await axios.get(
      'https://score.heyxyz.workers.dev',
      { params: { id, secret: process.env.SECRET } }
    );
    const scoreQuery = scoreQueryRequest.data.toString();
    const scores = await lensPrisma.$queryRaw<any>(
      toTemplateStringsArray([scoreQuery])
    );

    if (!scores[0]) {
      return res.status(404).json({ success: false });
    }

    const score = Number(scores[0].score);

    const baseData = {
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      id: id as string,
      score
    };

    const newCachedProfile = await heyPrisma.cachedProfileScore.upsert({
      create: baseData,
      update: baseData,
      where: { id: id as string }
    });

    logger.info(
      `Lens: Fetched profile score for ${id} - ${score} - Expires at: ${newCachedProfile.expiresAt}`
    );

    return res.status(200).json({ score, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
