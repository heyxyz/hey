import type { Handler } from 'express';

import { Regex } from '@hey/data/regex';
import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  contractAddress: string;
  decimals: number;
  name: string;
  symbol: string;
};

const validationSchema = object({
  contractAddress: string()
    .min(1)
    .max(42)
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' }),
  decimals: number().min(0).max(18),
  name: string().min(1).max(100),
  symbol: string().min(1).max(100)
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

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { contractAddress, decimals, name, symbol } = body as ExtensionRequest;

  try {
    const token = await heyPg.query(
      `
        INSERT INTO "AllowedToken" ("contractAddress", "decimals", "name", "symbol")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [contractAddress, decimals, name, symbol]
    );

    logger.info(`Created a token ${token[0]?.id}`);

    return res.status(200).json({ success: true, token: token[0] });
  } catch (error) {
    return catchedError(res, error);
  }
};
