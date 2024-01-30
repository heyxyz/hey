import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import validateIsGardener from 'src/lib/middlewares/validateIsGardener';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  looksGood: boolean;
};

const validationSchema = object({
  id: string(),
  looksGood: boolean()
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

  if (!(await validateIsGardener(req))) {
    return notAllowed(res);
  }

  const { id, looksGood } = body as ExtensionRequest;

  try {
    const client = createClickhouseClient();

    if (looksGood) {
      await client.command({
        query: `DELETE FROM trusted_reports WHERE publication_id = '${id}';`
      });
      logger.info('Deleted report from trusted reports');
    } else {
      await client.command({
        query: `
          ALTER TABLE trusted_reports
          UPDATE resolved = 1
          WHERE publication_id = '${id}';
        `
      });
      logger.info('Marked trusted report as resolved');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
