import type { Handler } from 'express';

export const get: Handler = async (_req, res) => {
  res.json({ ping: 'pong' });
};
