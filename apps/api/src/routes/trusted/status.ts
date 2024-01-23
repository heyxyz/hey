import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { TRUSTED_PROFILE_FEATURE_ID } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import prisma from '@utils/prisma';
import { noBody } from '@utils/responses';

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

    return res.status(200).json({
      isTrusted: data?.profileId === id,
      resolvedCount: Number(result[0]?.count) || 0,
      success: true
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
