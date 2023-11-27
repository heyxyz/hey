import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  try {
    // TODO: Add database, redis and clickhouse health checks
    res.status(200).json({ ping: 'pong' });
  } catch {
    res.status(500).json({ success: false });
  }
};
