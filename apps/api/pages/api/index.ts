import allowCors from '@utils/allowCors';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json({
      message: 'Hey API ✨'
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

export default allowCors(handler);
