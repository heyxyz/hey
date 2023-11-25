import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import getZoraChainIsMainnet from '@hey/lib/nft/getZoraChainIsMainnet';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from '@utils/constants';
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
    logger.info(`Nft fetched from Zora ${chain}/${address}:${token}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, nft: nft.collection || null });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
