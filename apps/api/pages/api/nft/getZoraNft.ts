import { Errors } from '@hey/data/errors';
import getZoraChainIsMainnet from '@hey/lib/nft/getZoraChainIsMainnet';
import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';
import urlcat from 'urlcat';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chain, address, token } = req.query;

  if (!chain || !address) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const network = getZoraChainIsMainnet(chain as string) ? '' : 'testnet.';
    const zoraResponse = await fetch(
      urlcat(
        `https://${network}zora.co/api/personalize/collection/:chain::address/:token`,
        { chain, address, token: token || 0 }
      )
    );
    const nft: { collection: any } = await zoraResponse.json();

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, nft: nft.collection || null });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
