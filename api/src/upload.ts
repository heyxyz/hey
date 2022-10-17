import Bundlr from '@bundlr-network/client';
import type { Request, Response } from 'express';

export const BUNDLR_CURRENCY = 'matic';
export const BUNDLR_NODE_URL = 'https://node2.bundlr.network';

const upload = async (req: Request, res: Response) => {
  if (!req) {
    return res.status(400).json({ success: false, message: 'Bad request!' });
  }

  const payload = JSON.stringify(req.body);

  try {
    const bundlr = new Bundlr(BUNDLR_NODE_URL, BUNDLR_CURRENCY, process.env.BUNDLR_PRIVATE_KEY);
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'App-Name', value: 'Lenster' }
    ];

    const uploader = bundlr.uploader.chunkedUploader;
    const { data } = await uploader.uploadData(Buffer.from(payload), { tags });

    return res.status(200).json({ success: true, id: data.id });
  } catch {
    return res.status(500).json({ success: false, message: 'Something went wrong!' });
  }
};

export default upload;
