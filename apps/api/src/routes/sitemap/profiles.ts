import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import { XMLBuilder } from 'fast-xml-parser';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_30_DAYS, SITEMAP_BATCH_SIZE } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
import { noBody } from 'src/lib/responses';

export const config = {
  api: { responseLimit: '8mb' }
};

interface Url {
  changefreq: string;
  loc: string;
  priority: string;
}

const buildSitemapXml = (url: Url[]): string => {
  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    processEntities: true,
    suppressEmptyNode: true
  });

  return builder.build({
    urlset: { '@_xmlns': 'https://www.sitemaps.org/schemas/sitemap/0.9', url }
  });
};

export const get: Handler = async (req, res) => {
  const { batch } = req.query;

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

    const entries: Url[] = response.map((handle) => ({
      changefreq: 'weekly',
      loc: `https://hey.xyz/u/${handle.local_name}`,
      priority: '1.0'
    }));

    const xml = buildSitemapXml(entries);
    logger.info(
      `Lens: Fetched profiles sitemap for batch ${batch} having ${response.length} entries from user-agent: ${user_agent}`
    );

    return res
      .status(200)
      .setHeader('Content-Type', 'text/xml')
      .setHeader('Cache-Control', CACHE_AGE_30_DAYS)
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
