import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { SITEMAP_BATCH_SIZE } from 'src/helpers/constants';
import { buildSitemapXml } from 'src/helpers/sitemap/buildSitemap';

export const get: Handler = async (req, res) => {
  const user_agent = req.headers['user-agent'];

  try {
    const response = await lensPg.query(`
      SELECT COUNT(DISTINCT h.local_name)
      FROM namespace.handle_link hl
      JOIN namespace.handle h ON hl.handle_id = h.handle_id;
    `);

    const totalHandles = Number(response[0]?.count) || 0;
    const totalBatches = Math.ceil(totalHandles / SITEMAP_BATCH_SIZE);

    const entries = Array.from({ length: totalBatches }, (_, index) => ({
      loc: `https://api.hey.xyz/sitemap/profiles/${index + 1}.xml`
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `Lens: Fetched all profiles sitemap index having ${totalBatches} batches from user-agent: ${user_agent}`
    );

    return res.status(200).setHeader('Content-Type', 'text/xml').send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
