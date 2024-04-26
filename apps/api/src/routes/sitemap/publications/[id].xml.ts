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
  const batch = req.path.replace('/sitemap/publications/', '');

  if (!batch) {
    return noBody(res);
  }

  const user_agent = req.headers['user-agent'];

  try {
    const offset = (Number(batch) - 1) * SITEMAP_BATCH_SIZE || 0;

    const response = await lensPg.query(
      `
        SELECT publication_id FROM publication.record
        WHERE publication_type IN ('POST', 'QUOTE')
        AND is_hidden = false AND gardener_flagged = false
        ORDER BY block_timestamp ASC
        LIMIT $1
        OFFSET $2;
      `,
      [SITEMAP_BATCH_SIZE, offset]
    );

    const entries = response.map((publication) => ({
      loc: `https://hey.xyz/posts/${publication.publication_id}`
    }));

    const xml = buildUrlsetXml(entries);

    logger.info(
      `Lens: Fetched publications sitemap for batch ${batch} having ${response.length} entries from user-agent: ${user_agent}`
    );

    return res.status(200).setHeader('Content-Type', 'text/xml').send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
