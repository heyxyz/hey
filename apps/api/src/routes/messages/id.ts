import type { Handler } from 'express';

import catchedError from 'src/lib/catchedError';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return noBody(res);
  }

  try {
    const data = await prisma.privateKey.findFirst({
      where: { address: address as string }
    });

    if (!data) {
      return res.status(400).json({ error: 'Not found.', success: false });
    }

    return res.status(200).json({ id: data.profileId, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
