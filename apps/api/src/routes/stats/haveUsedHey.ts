import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      query: `SELECT count(*) as count FROM events WHERE actor = '${id}';`,
      format: 'JSONEachRow'
    });
    const result = await rows.json<Array<{ count: number }>>();
    logger.info('Have used hey status fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, haveUsedHey: Number(result[0].count) > 0 });
  } catch (error) {
    return catchedError(res, error);
  }
};
