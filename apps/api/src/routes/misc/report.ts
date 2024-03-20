import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  reason: string;
};

const validationSchema = object({
  id: string(),
  reason: string()
});

// TODO: add tests
export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { id, reason } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const actor = payload.id;

    const client = createClickhouseClient();

    // Do not allow to report the same publication twice
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        SELECT * FROM reports
        WHERE publication_id = '${id}'
        AND actor = '${actor}'
        LIMIT 1;
      `
    });

    const reports = await rows.json<Array<any>>();

    if (reports.length > 0) {
      return res.status(200).json({
        message: 'You already reported this publication!',
        success: false
      });
    }

    const result = await client.insert({
      format: 'JSONEachRow',
      table: 'reports',
      values: [{ actor, publication_id: id, reason }]
    });

    logger.info(`Reported ${id} by profile: ${actor}`);

    return res.status(200).json({ id: result.query_id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
