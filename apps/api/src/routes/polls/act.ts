import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  option: string;
  poll: string;
};

const validationSchema = object({
  option: string().uuid(),
  poll: string().uuid()
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

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  const { option, poll } = body as ExtensionRequest;

  try {
    const identityToken = req.headers['x-identity-token'] as string;
    const payload = parseJwt(identityToken);

    const expired = await goodPg.exists(
      `
        SELECT * FROM "Poll"
        WHERE id = $1
        AND ("endsAt" < CURRENT_TIMESTAMP OR "endsAt" IS NULL)
        LIMIT 1;
      `,
      [poll]
    );

    if (expired) {
      return res.status(400).json({ error: 'Poll expired.', success: false });
    }
    // End: Check if the poll expired

    // Begin: Check if the poll exists and delete the existing response
    const existingResponse = await goodPg.query(
      `
        SELECT pr.*
        FROM "PollResponse" AS pr
        JOIN "PollOption" AS o ON pr."optionId" = o.id
        WHERE o."pollId" = $1 AND pr."profileId" = $2
        LIMIT 1;
      `,
      [poll, payload.id]
    );

    if (existingResponse[0]?.id) {
      await goodPg.query(
        `
          DELETE FROM "PollResponse"
          WHERE "id" = $1;
        `,
        [existingResponse[0].id]
      );
    }
    // End: Check if the poll exists and delete the existing response

    const data = await goodPg.query(
      `
        INSERT INTO "PollResponse" ("optionId", "profileId")
        VALUES ($1, $2)
        ON CONFLICT ("optionId", "profileId") DO NOTHING
        RETURNING *;
      `,
      [option, payload.id]
    );

    logger.info(`Responded to a poll ${option}:${data[0]?.id}`);

    return res.status(200).json({ id: data[0]?.id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
