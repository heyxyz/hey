import logger from '@hey/lib/logger';
import getZoraChainIsMainnet from '@hey/lib/nft/getZoraChainIsMainnet';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from '@utils/constants';
import { noBody } from '@utils/responses';
import type { Handler } from 'express';
import urlcat from 'urlcat';

export const get: Handler = async (req, res) => {
  const { chain, address, token } = req.query;

  if (!chain || !address) {
    return noBody(res);
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
