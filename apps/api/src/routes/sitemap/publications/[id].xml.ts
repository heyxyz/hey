import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SITEMAP_BATCH_SIZE } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
import { noBody } from 'src/lib/responses';
import { buildUrlsetXml } from 'src/lib/sitemap/buildSitemap';

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
    const offset = (Number(batch) - 1) * SITEMAP_BATCH_SIZE;

    const response = await lensPrisma.$queryRaw<{ publication_id: string }[]>`
      SELECT publication_id FROM publication.record
      WHERE publication_type IN ('POST', 'QUOTE')
      ORDER BY block_timestamp ASC
      LIMIT ${SITEMAP_BATCH_SIZE}
      OFFSET ${offset};
    `;

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
