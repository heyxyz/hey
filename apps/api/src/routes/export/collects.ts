import type { Request, Response } from 'express';

import lensPg from '@hey/db/lensPg';
import logger from '@hey/helpers/logger';
import { Parser } from '@json2csv/plainjs';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS } from 'src/helpers/constants';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { noBody } from 'src/helpers/responses';

// TODO: add tests
export const get = [
  rateLimiter({ requests: 10, within: 1 }),
  // validateLensAccount,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const response = await lensPg.query(
        `
          SELECT po.owner_address as address
          FROM publication.open_action_module_collect_nft_ownership AS po
          WHERE po.publication_id = $1;
        `,
        [id]
      );

      const fields = ['address'];
      const parser = new Parser({ fields });
      const csv = parser.parse(response);

      logger.info(`[Lens] Exported collect addresses list for ${id}`);

      return res
        .status(200)
        .setHeader('Content-Type', 'text/csv')
        .setHeader(
          'Content-Disposition',
          `attachment; filename="collect_addresses_${id}.csv"`
        )
        .setHeader('Cache-Control', CACHE_AGE_30_MINS)
        .send(csv);
    } catch (error) {
      catchedError(res, error);
    }
  }
];
