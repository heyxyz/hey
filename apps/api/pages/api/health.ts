import allowCors from '@utils/allowCors';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    // TODO: Add database, redis and clickhouse health checks
    res.status(200).json({ ping: 'pong' });
  } catch {
    res.status(500).json({ success: false });
  }
};

export default allowCors(handler);
