import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from '@utils/constants';
import { XMLBuilder } from 'fast-xml-parser';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: { responseLimit: '8mb' }
};

interface Url {
  loc: string;
  changefreq: string;
  priority: string;
}

const buildSitemapXml = (url: Url[]): string => {
  const builder = new XMLBuilder({
    suppressEmptyNode: true,
    ignoreAttributes: false,
    processEntities: true,
    format: true
  });

  return builder.build({
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    urlset: { '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9', url }
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
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
      loc: `https://hey.xyz/u/${handle}`,
      changefreq: 'weekly',
      priority: '1.0'
    }));

    const xml = buildSitemapXml(entries);

    return res
      .status(200)
      .setHeader('Content-Type', 'text/xml')
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .send(xml);
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
