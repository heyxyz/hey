import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import { XMLBuilder } from 'fast-xml-parser';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_INDEFINITE } from 'src/lib/constants';
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
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const range = 'A1:B50000';
    const apiKey = process.env.GOOGLE_API_KEY;

    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${apiKey}`
    );

    const json: {
      values: string[][];
    } = await sheetsResponse.json();
    const handles = json.values.map((row) => row[0]);
    const entries: Url[] = handles.map((handle) => ({
      changefreq: 'weekly',
      loc: `https://hey.xyz/u/${handle}`,
      priority: '1.0'
    }));

    const xml = buildSitemapXml(entries);
    logger.info('Sitemap fetched from Google Sheets');

    return res
      .status(200)
      .setHeader('Content-Type', 'text/xml')
      .setHeader('Cache-Control', CACHE_AGE_INDEFINITE)
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
