import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/helpers/catchedError';
import { buildSitemapXml } from 'src/helpers/sitemap/buildSitemap';

export const get: Handler = (req, res) => {
  const user_agent = req.headers['user-agent'];

  try {
    const sitemaps = [
      'https://api.hey.xyz/sitemap/profiles.xml',
      'https://api.hey.xyz/sitemap/publications.xml',
      'https://api.hey.xyz/sitemap/others.xml'
    ];

    const entries = sitemaps.map((sitemap) => ({
      loc: sitemap
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `Lens: Fetched all sitemaps index from user-agent: ${user_agent}`
    );

    return res.status(200).setHeader('Content-Type', 'text/xml').send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
