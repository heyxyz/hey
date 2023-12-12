import type { Handler } from 'express';

export const get: Handler = async (_, res) => {
  res.json({ message: 'Hey API ✨' });
};
