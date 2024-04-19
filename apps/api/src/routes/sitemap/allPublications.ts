import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import { XMLBuilder } from 'fast-xml-parser';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_30_DAYS, SITEMAP_BATCH_SIZE } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';

interface Url {
  loc: string;
}

const buildSitemapXml = (url: Url[]): string => {
  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    processEntities: true,
    suppressEmptyNode: true
  });

  return builder.build({
    sitemapindex: {
      '@_xmlns': 'https://www.sitemaps.org/schemas/sitemap/0.9',
      sitemap: url
    }
  });
};

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

    const entries: Url[] = Array.from({ length: totalBatches }, (_, index) => ({
      loc: `https://hey.xyz/sitemaps/publications?batch=${index + 1}`
    }));

    const xml = buildSitemapXml(entries);
    logger.info(
      `Lens: Fetched all publications sitemap having ${totalBatches} batches from user-agent: ${user_agent}`
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
