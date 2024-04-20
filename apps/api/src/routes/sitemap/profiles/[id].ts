import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_30_DAYS, SITEMAP_BATCH_SIZE } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
import { noBody } from 'src/lib/responses';

export const config = {
  api: { responseLimit: '8mb' }
};

export const get: Handler = async (req, res) => {
  const batch = req.path.replace('/sitemap/profiles/', '');

  if (!batch) {
    return noBody(res);
  }

  const user_agent = req.headers['user-agent'];

  try {
    const offset = (Number(batch) - 1) * SITEMAP_BATCH_SIZE;

    const response = await lensPrisma.$queryRaw<{ local_name: string }[]>`
      SELECT local_name FROM namespace.handle
      ORDER BY block_timestamp ASC
      LIMIT ${SITEMAP_BATCH_SIZE}
      OFFSET ${offset};
    `;

    const entries = response
      .map((handle) => `https://hey.xyz/u/${handle.local_name}`)
      .join('\n');

    logger.info(
      `Lens: Fetched profiles sitemap for batch ${batch} having ${response.length} entries from user-agent: ${user_agent}`
    );

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_DAYS)
      .setHeader('Content-Type', 'text/plain')
      .send(entries);
  } catch (error) {
    return catchedError(res, error);
  }
};
