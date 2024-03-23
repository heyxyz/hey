import type { Handler } from 'express';

import Cryptr from 'cryptr';
import catchedError from 'src/lib/catchedError';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';
import { privateKeyToAddress } from 'viem/accounts';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  const cryptr = new Cryptr(process.env.SALT_HASH as string);

  try {
    const data = await prisma.privateKey.findFirst({
      where: { profileId: id as string }
    });

    if (!data) {
      return res.status(400).json({ error: 'Not found.', success: false });
    }

    const privateKey = cryptr.decrypt(data.key) as `0x${string}`;
    const address = privateKeyToAddress(privateKey);

    return res.status(200).json({ address, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
