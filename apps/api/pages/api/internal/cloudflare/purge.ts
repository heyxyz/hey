import { Errors } from '@hey/data/errors';
import HeyEndpoint from '@hey/data/hey-endpoints';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { secret } = req.query;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidSecret });
  }

  try {
    const type = req.body?.type;
    const evironment = req.body?.environment?.name;

    if (type !== 'DEPLOY') {
      return res.status(200).json({ success: true, skipped: true });
    }

    if (!evironment) {
      return res.status(200).json({ success: false, skipped: true });
    }

    const endpoint =
      evironment === 'mainnet'
        ? HeyEndpoint.Mainnet
        : evironment === 'testnet'
          ? HeyEndpoint.Testnet
          : HeyEndpoint.Staging;

    return res.status(200).json({ success: true, purgedEndpoint: endpoint });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
