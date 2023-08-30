import '@sentry/tracing';

import { AlgorithmProvider } from '@lenster/data/enums';
import response from '@lenster/lib/response';

import k3lFeed from '../providers/k3l/k3lFeed';
import lensterFeed from '../providers/lenster/lensterFeed';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const transaction = request.sentry?.startTransaction({
    name: '@lenster/feeds/ids'
  });

  const provider = request.query.provider as string;
  const strategy = request.query.strategy as string;
  const profile = request.query.profile as string;
  const limit = (parseInt(request.query?.limit as string) || 50) as number;
  const offset = (parseInt(request.query?.offset as string) || 0) as number;

  if (!provider || !strategy) {
    return response({
      success: false,
      message: 'Missing required parameters!'
    });
  }

  try {
    const providerRequestSpan = transaction?.startChild({
      op: 'provider-request',
      description: provider
    });
    let ids: string[] = [];
    switch (provider) {
      case AlgorithmProvider.K3L:
        ids = await k3lFeed(strategy, profile, limit, offset);
        break;
      case AlgorithmProvider.LENSTER:
        ids = await lensterFeed(strategy, limit, offset, request.env);
        break;
      default:
        return response({ success: false, message: 'Invalid provider' });
    }
    providerRequestSpan?.finish();

    return response({ success: true, ids });
  } catch (error) {
    request.sentry?.captureException(error);
    throw error;
  } finally {
    transaction?.finish();
  }
};
