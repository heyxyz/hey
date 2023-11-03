import response from '@hey/lib/response';
import { XMLBuilder } from 'fast-xml-parser';

import type { WorkerRequest } from '../types';

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

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({
      success: false,
      message: 'Missing required parameters!'
    });
  }

  try {
    const range = 'A1:B5000';
    const apiKey = request.env.GOOGLE_API_KEY;

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

    return new Response(xml, {
      headers: { 'content-type': 'application/xml' }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
