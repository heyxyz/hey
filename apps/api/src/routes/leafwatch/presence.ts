import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import requestIp from 'request-ip';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import urlcat from 'urlcat';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { id } = body as ExtensionRequest;

  const ip = requestIp.getClientIp(req);

  try {
    // Extract IP data
    let ipData: {
      city: string;
      country: string;
      regionName: string;
    } | null = null;

    try {
      const ipResponse = await fetch(
        urlcat('https://pro.ip-api.com/json/:ip', {
          ip,
          key: process.env.IPAPI_KEY
        })
      );
      ipData = await ipResponse.json();
    } catch (error) {
      return catchedError(res, error);
    }

    const client = createClickhouseClient();
    const result = await client.command({
      query: `
        INSERT INTO presence
        (id, ip, city, country, region, last_seen)
        VALUES
        (
          '${id}',
          '${ip}',
          '${ipData?.city || null}',
          '${ipData?.country || null}',
          '${ipData?.regionName || null}',
          now()
        )
      `
    });
    logger.info('Ingested presence to Leafwatch');

    return res.status(200).json({ id: result.query_id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
