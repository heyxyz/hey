import type { Request, Response } from 'express';

import getIp from '@hey/helpers/getIp';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { invalidBody, noBody } from 'src/helpers/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
  viewer_id: string;
};

const validationSchema = object({
  ids: array(string()),
  viewer_id: string()
});

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const ip = getIp(req);
    const cfIpCity = req.headers['cf-ipcity'];
    const cfIpCountry = req.headers['cf-ipcountry'];

    const { ids, viewer_id } = body as ExtensionRequest;

    try {
      const values = ids.map((id) => ({
        city: cfIpCity || null,
        country: cfIpCountry || null,
        ip: ip || null,
        publication_id: id,
        viewer_id
      }));

      const client = createClickhouseClient();
      const result = await client.insert({
        format: 'JSONEachRow',
        table: 'impressions',
        values
      });
      logger.info(
        `Ingested ${result.summary?.result_rows} impressions to Leafwatch`
      );

      return res.status(200).json({ id: result.query_id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
