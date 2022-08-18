import Bundlr from '@bundlr-network/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { APP_NAME, BUNDLR_CURRENCY, BUNDLR_NODE_URL, ERROR_MESSAGE } from 'src/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Invalid method!' });
  }

  if (!req.body) {
    return res.status(400).json({ success: false, message: 'Bad request!' });
  }

  const payload = JSON.stringify(req.body);

  try {
    const bundlr = new Bundlr(BUNDLR_NODE_URL, BUNDLR_CURRENCY, process.env.BUNDLR_PRIVATE_KEY);
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'App-Name', value: APP_NAME }
    ];

    const uploader = bundlr.uploader.chunkedUploader;
    const { data } = await uploader.uploadData(Buffer.from(payload), { tags });

    return res.status(200).json({ success: true, id: data.id });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: ERROR_MESSAGE });
  }
};

export default withSentry(handler);
