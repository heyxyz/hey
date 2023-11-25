import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cid } = req.query;

  if (!cid) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const ipfsResponse = await fetch(
      `https://cl-api.ipfs-lens.dev/pins/${cid}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.LENS_IPFS_AUTH_KEY}`,
          'X-App': 'hey.xyz'
        }
      }
    );

    const json: { cid: string } = await ipfsResponse.json();

    return res.status(200).json({ success: true, cid: json.cid });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
