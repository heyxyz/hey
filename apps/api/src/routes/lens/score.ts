import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import axios from 'axios';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_1_DAY } from 'src/lib/constants';
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

    logger.info(`Lens: Fetched profile score for ${id} - ${score}`);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_1_DAY)
      .json({ cached: new Date().toISOString(), score, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
