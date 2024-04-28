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
      SELECT COUNT(h.handle) AS count
      FROM namespace.handle h
      JOIN namespace.handle_link hl ON h.handle_id = hl.handle_id
      JOIN profile.record p ON hl.token_id = p.profile_id
      WHERE p.is_burnt = false;
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
