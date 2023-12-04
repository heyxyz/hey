import createClickhouseClient from '@utils/createClickhouseClient';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  try {
    // Postgres
    const db = await prisma.feature.count();

    // Clickhouse
    const clickhouse = createClickhouseClient();
    const rows = await clickhouse.query({
      query: 'SELECT count(*) from events;',
      format: 'JSONEachRow'
    });

    if (db <= 0 || !rows.json) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ ping: 'pong' });
  } catch {
    return res.status(500).json({ success: false });
  }
};
