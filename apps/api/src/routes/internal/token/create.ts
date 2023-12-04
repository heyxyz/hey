import { Regex } from '@hey/data/regex';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import type { Handler } from 'express';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
};

const validationSchema = object({
  name: string().min(1).max(100),
  symbol: string().min(1).max(100),
  decimals: number().min(0).max(18),
  contractAddress: string()
    .min(1)
    .max(42)
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' })
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

  const { name, symbol, decimals, contractAddress } = body as ExtensionRequest;

  try {
    const token = await prisma.allowedToken.create({
      data: { name, symbol, decimals, contractAddress }
    });
    logger.info(`Created a token ${token.id}`);

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return catchedError(res, error);
  }
};
