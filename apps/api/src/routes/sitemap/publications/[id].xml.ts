import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SITEMAP_BATCH_SIZE } from 'src/lib/constants';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { noBody } from 'src/lib/responses';
import { buildUrlsetXml } from 'src/lib/sitemap/buildSitemap';
import getLastModDate from 'src/lib/sitemap/getLastModDate';

export const config = {
  api: { responseLimit: '8mb' }
};

export const get: Handler = async (req, res) => {
  const batch = req.path
    .replace('/sitemap/publications/', '')
    .replace('.xml', '');

  if (!batch) {
    return noBody(res);
  }

  const user_agent = req.headers['user-agent'];

  try {
    const offset = (Number(batch) - 1) * SITEMAP_BATCH_SIZE;
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        SELECT id, block_timestamp 
        FROM publications
        ORDER BY block_timestamp ASC
        LIMIT ${SITEMAP_BATCH_SIZE}
        OFFSET ${offset}
      `
    });
    const result = await rows.json<{ block_timestamp: string; id: string }>();

    const entries = result.map((publication) => ({
      changefreq: 'monthly',
      lastmod: getLastModDate(publication.block_timestamp),
      loc: `https://hey.xyz/posts/${publication.id}`,
      priority: 0.5
    }));

    const xml = buildUrlsetXml(entries);

    logger.info(
      `Lens: Fetched publications sitemap for batch ${batch} having ${result.length} entries from user-agent: ${user_agent}`
    );

    return res.status(200).setHeader('Content-Type', 'text/xml').send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
