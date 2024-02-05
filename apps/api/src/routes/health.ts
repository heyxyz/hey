import type { Handler } from 'express';

import createClickhouseClient from 'src/lib/createClickhouseClient';
import prisma from 'src/lib/prisma';

export const get: Handler = async (_, res) => {
  try {
    // Postgres
    const db = await prisma.feature.count();

    // Clickhouse
    const clickhouse = createClickhouseClient();
    const rows = await clickhouse.query({
      format: 'JSONEachRow',
      query: 'SELECT count(*) from events;'
    });

    if (db <= 0 || !rows.json) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ ping: 'pong' });
  } catch {
    return res.status(500).json({ success: false });
  }
};
