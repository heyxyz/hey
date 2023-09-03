import '@sentry/tracing';

import response from '@lenster/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const transaction = request.sentry?.startTransaction({
    name: '@lenster/zora/getNft'
  });

  const { network, chain, address } = request.query;

  if (!network || !chain || !address) {
    return response({
      success: false,
      error: 'No network, chain and address provided'
    });
  }

  try {
    const zoraResponse = await fetch(
      `https://${
        network === 'testnet' ? 'testnet.' : ''
      }zora.co/api/personalize/collection/${chain}:${address}`
    );
    const nft: { collection: any } = await zoraResponse.json();

    return response({ success: true, nft: nft.collection || null });
  } catch (error) {
    request.sentry?.captureException(error);
    throw error;
  } finally {
    transaction?.finish();
  }
};
