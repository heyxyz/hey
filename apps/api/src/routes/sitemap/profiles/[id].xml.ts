import type { Handler } from 'express';

import lensPg from '@hey/db/lensPg';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import {
  CACHE_AGE_1_DAY,
  CACHE_AGE_INDEFINITE,
  SITEMAP_BATCH_SIZE
} from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';
import { buildUrlsetXml } from 'src/helpers/sitemap/buildSitemap';

export const config = {
  api: { responseLimit: '8mb' }
};

export const get: Handler = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return noBody(res);
  }

  const user_agent = req.headers['user-agent'];

  try {
    const offset = (Number(id) - 1) * SITEMAP_BATCH_SIZE || 0;

    const response = await lensPg.query(
      `
        SELECT h.local_name, hl.block_timestamp
        FROM namespace.handle h
        JOIN namespace.handle_link hl ON h.handle_id = hl.handle_id
        JOIN profile.record p ON hl.token_id = p.profile_id
        WHERE p.is_burnt = false
        ORDER BY p.block_timestamp
        LIMIT $1
        OFFSET $2;
      `,
      [SITEMAP_BATCH_SIZE, offset]
    );

    const entries = response.map((handle) => ({
      lastmod: handle.block_timestamp
        .toISOString()
        .replace('T', ' ')
        .replace('.000Z', '')
        .split(' ')[0],
      loc: `https://hey.xyz/u/${handle.local_name}`
    }));

    const xml = buildUrlsetXml(entries);

    logger.info(
      `[Lens] Fetched profiles sitemap for batch ${id} having ${response.length} entries from user-agent: ${user_agent}`
    );
    console.log(response.length === SITEMAP_BATCH_SIZE);
    return res
      .status(200)
      .setHeader('Content-Type', 'text/xml')
      .setHeader(
        'Cache-Control',
        response.length === SITEMAP_BATCH_SIZE
          ? CACHE_AGE_INDEFINITE
          : CACHE_AGE_1_DAY
      )
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
