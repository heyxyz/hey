import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
    logger.info('Have used hey status fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, haveUsedHey: Number(result[0].count) > 0 });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
