import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { buildSitemapXml } from 'src/lib/sitemap/buildSitemap';

export const get: Handler = (req, res) => {
  const user_agent = req.headers['user-agent'];

  try {
    const sitemaps = [
      'https://hey.xyz/sitemap/profiles.xml',
      'https://hey.xyz/sitemap/publications.xml'
    ];

    const entries = sitemaps.map((sitemap) => ({
      loc: sitemap
    }));
    const xml = buildSitemapXml(entries);

    logger.info(`Lens: Fetched all sitemaps from user-agent: ${user_agent}`);

    return res.status(200).setHeader('Content-Type', 'text/xml').send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
