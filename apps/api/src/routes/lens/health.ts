import type { Handler } from 'express';

import lensPrisma from 'src/lib/lensPrisma';

export const get: Handler = async (_, res) => {
  try {
    const db = await lensPrisma.$queryRaw<
      { count: number }[]
    >`SELECT count(*) as count from publication.record;`;

    const count = Number(db[0].count);

    if (count < 100) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ ping: 'pong' });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
