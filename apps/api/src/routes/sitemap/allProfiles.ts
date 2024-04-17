import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import { XMLBuilder } from 'fast-xml-parser';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_30_DAYS } from 'src/lib/constants';

const profiles = [
  '1jI5D--iDuPrWhfNdPm3AbXR_3eCSKtY60sYbkQrqEA4',
  '1lPsDZM1BDnJgW7uklpmzS-OECZg8Xq7Ax-883zpRRtI',
  '1MsVenKF0yaDbw0ppER1h1f_uhSvK4c7JiPeXKA2hoAY',
  '1ORpHMMJN13oarscm0Pe8BlPynVWScO7n_x63TfPi7ZY',
  '1Cl8kSYP4Tn1oI7aOANXn_vN9eSMhL8RWJHHyUWhN-q4',
  '1ABiKdB9JmQC2rPTCCgsvWso6rNN6rk-EppOOvqgI6rM'
];

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

export const get: Handler = (_, res) => {
  try {
    const entries: Url[] = profiles.map((id) => ({
      loc: `https://hey.xyz/sitemaps/profiles?id=${id}`
    }));

    const xml = buildSitemapXml(entries);
    logger.info('Sitemap fetched from Google Sheets');

    return res
      .status(200)
      .setHeader('Content-Type', 'text/xml')
      .setHeader('Cache-Control', CACHE_AGE_30_DAYS)
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
