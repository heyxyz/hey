import type { Handler } from 'express';

import { Regex } from '@hey/data/regex';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  amount: number;
  fromAddress: string;
  id: string;
  toAddress: string;
  tokenAddress: string;
  txHash: string;
};

const validationSchema = object({
  amount: number(),
  fromAddress: string().regex(Regex.ethereumAddress),
  id: string(),
  toAddress: string().regex(Regex.ethereumAddress),
  tokenAddress: string().regex(Regex.ethereumAddress),
  txHash: string().regex(Regex.txHash)
});

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

  const { amount, fromAddress, id, toAddress, tokenAddress, txHash } =
    body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    const data = await prisma.tip.create({
      data: {
        amount,
        fromAddress,
        fromProfileId: payload.id,
        publicationId: id,
        toAddress,
        tokenAddress,
        toProfileId: id.split('-')[0],
        txHash
      }
    });

    logger.info(`Created a tip ${data.id}`);

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
