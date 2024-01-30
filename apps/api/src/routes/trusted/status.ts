import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import {
  SWR_CACHE_AGE_10_MINS_30_DAYS,
  TRUSTED_PROFILE_FEATURE_ID
} from 'src/lib/constants';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const prismaQuery = prisma.profileFeature.findFirst({
      where: {
        enabled: true,
        featureId: TRUSTED_PROFILE_FEATURE_ID,
        profileId: id as string
      }
    });

    const client = createClickhouseClient();
    const clickhouseQuery = client
      .query({
        format: 'JSONEachRow',
        query: `
        SELECT count(*) as count
        FROM trusted_reports
        WHERE actor = '${id}'
        AND resolved = 1;
      `
      })
      .then((rows) => rows.json<Array<{ count: string }>>());

    const [data, result] = await Promise.all([prismaQuery, clickhouseQuery]);

    logger.info(`Trusted profile status fetched: ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({
        isTrusted: data?.profileId === id,
        resolvedCount: Number(result[0]?.count) || 0,
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
