import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_30_DAYS, SITEMAP_BATCH_SIZE } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
import { buildSitemapXml } from 'src/lib/sitemap/buildSitemap';

export const get: Handler = async (req, res) => {
  const user_agent = req.headers['user-agent'];

  try {
    const response = await lensPrisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count
      FROM publication.record
      WHERE publication_type IN ('POST', 'QUOTE');
    `;

    const totalPublications = Number(response[0]?.count) || 0;
    const totalBatches = Math.ceil(totalPublications / SITEMAP_BATCH_SIZE);

    const entries = Array.from({ length: totalBatches }, (_, index) => ({
      loc: `https://api.hey.xyz/sitemap/publications/${index + 1}.xml`
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `Lens: Fetched all publications sitemap index having ${totalBatches} batches from user-agent: ${user_agent}`
    );

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_DAYS)
      .setHeader('Content-Type', 'text/xml')
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
