import type { Handler } from 'express';

import { Regex } from '@hey/data/regex';
import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import createStackClient from 'src/lib/score/createStackClient';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  address: string;
  availabePoints: number;
};

const validationSchema = object({
  address: string().regex(Regex.ethereumAddress),
  availabePoints: number().min(0)
});

// TODO: add tests
export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const network = req.headers['x-lens-network'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { address, availabePoints } = body as ExtensionRequest;

  try {
    const pointSystemId = network === 'mainnet' ? 1464 : 691;
    const client = createStackClient(pointSystemId);
    client.track('Abuse', { account: address, points: -availabePoints });

    logger.info(`Resetted score for ${address} by ${availabePoints}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
