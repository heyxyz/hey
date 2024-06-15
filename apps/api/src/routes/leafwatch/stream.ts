import type { Handler } from 'express';

import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';

export const get: Handler = async (req, res) => {
  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `SELECT * FROM events ORDER BY created DESC LIMIT 50;`
    });
    const result = await rows.json<any>();

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
