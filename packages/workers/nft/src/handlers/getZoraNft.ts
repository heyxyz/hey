import getZoraChainIsMainnet from '@hey/lib/nft/getZoraChainIsMainnet';
import response from '@hey/lib/response';
import urlcat from 'urlcat';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { chain, address, token } = request.query;

  if (!chain || !address) {
    return response({
      success: false,
      error: 'No chain and address provided'
    });
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

    return response({ success: true, nft: nft.collection || null });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
