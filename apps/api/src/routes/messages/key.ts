import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import Cryptr from 'cryptr';
import catchedError from 'src/lib/catchedError';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import prisma from 'src/lib/prisma';
import { notAllowed } from 'src/lib/responses';
import { generatePrivateKey } from 'viem/accounts';

export const get: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;
  const cryptr = new Cryptr(process.env.SALT_HASH as string);

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  try {
    const payload = parseJwt(accessToken);
    const profileId = payload.id;
    const privateKey = cryptr.encrypt(await generatePrivateKey());

    const data = await prisma.privateKey.findFirst({
      where: { profileId }
    });

    if (!data) {
      const newData = await prisma.privateKey.create({
        data: { key: privateKey, profileId }
      });

      const key = cryptr.decrypt(newData.key);
      logger.info(`Generated new XMTP key for profile ${profileId}`);

      return res.status(200).json({ key, success: true });
    }

    const key = cryptr.decrypt(data.key);
    logger.info(`Fetched existing XMTP key for profile ${profileId}`);

    return res.status(200).json({ key, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
