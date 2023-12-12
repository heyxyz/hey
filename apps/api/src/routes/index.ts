import type { Handler } from 'express';

export const get: Handler = (_, res) => {
  return res.json({ message: 'Hey API ✨' });
};
