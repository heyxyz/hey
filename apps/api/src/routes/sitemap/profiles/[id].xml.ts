import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { SITEMAP_BATCH_SIZE } from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';
import { buildUrlsetXml } from 'src/helpers/sitemap/buildSitemap';

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
    const offset = (Number(batch) - 1) * SITEMAP_BATCH_SIZE || 0;

    const response = await lensPg.query(
      `
        SELECT h.local_name
        FROM namespace.handle_link hl
        JOIN namespace.handle h ON hl.handle_id = h.handle_id
        ORDER BY h.block_timestamp
        LIMIT $1
        OFFSET $2;
      `,
      [SITEMAP_BATCH_SIZE, offset]
    );

    const entries = response.map((handle) => ({
      loc: `https://hey.xyz/u/${handle.local_name}`
    }));

    const xml = buildUrlsetXml(entries);

    logger.info(
      `Lens: Fetched profiles sitemap for batch ${batch} having ${response.length} entries from user-agent: ${user_agent}`
    );

    return res.status(200).setHeader('Content-Type', 'text/xml').send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
