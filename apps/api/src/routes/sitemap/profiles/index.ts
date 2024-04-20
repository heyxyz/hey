import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SITEMAP_BATCH_SIZE } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
import { buildSitemapXml } from 'src/lib/sitemap/buildSitemap';

export const get: Handler = async (req, res) => {
  const user_agent = req.headers['user-agent'];

  try {
    const response = await lensPrisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count FROM namespace.handle;
    `;

    const totalHandles = Number(response[0]?.count) || 0;
    const totalBatches = Math.ceil(totalHandles / SITEMAP_BATCH_SIZE);

    const entries = Array.from({ length: totalBatches }, (_, index) => ({
      loc: `https://hey.xyz/sitemap/profiles/${index + 1}.xml`
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `Lens: Fetched all profiles sitemap having ${totalBatches} batches from user-agent: ${user_agent}`
    );

    return res.status(200).setHeader('Content-Type', 'text/xml').send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
