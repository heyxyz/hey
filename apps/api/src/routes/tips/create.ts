import type { Handler } from 'express';

import { Regex } from '@good/data/regex';
import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
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

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  const { amount, fromAddress, id, toAddress, tokenAddress, txHash } =
    body as ExtensionRequest;

  try {
    const identityToken = req.headers['x-identity-token'] as string;
    const payload = parseJwt(identityToken);

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
