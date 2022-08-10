import WebBundlr from '@bundlr-network/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { ALCHEMY_RPC, BUNDLR_CURRENCY, BUNDLR_NODE_URL, ERROR_MESSAGE } from 'src/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Invalid method!' });
  }

  if (!req.body) {
    return res.status(400).json({ success: false, message: 'Bad request!' });
  }

  const data = JSON.stringify(req.body);

  try {
    const bundlr = new WebBundlr(BUNDLR_NODE_URL, BUNDLR_CURRENCY, process.env.BUNDLR_PRIVATE_KEY, {
      providerUrl: ALCHEMY_RPC
    });
    const tags = [{ name: 'Content-Type', value: 'application/json' }];
    const tx = bundlr.createTransaction(data, { tags });
    await tx.sign();
    await tx.upload();

    return res.status(200).json({ success: true, id: tx.id });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: ERROR_MESSAGE });
  }
};

export default withSentry(handler);
