import { AlgorithmProvider } from '@hey/data/enums';
import response from '@hey/lib/response';

import heyFeed from '../providers/hey/heyFeed';
import k3lFeed from '../providers/k3l/k3lFeed';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
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
    let ids: string[] = [];
    switch (provider) {
      case AlgorithmProvider.K3L:
        ids = await k3lFeed(strategy, profile, limit, offset);
        break;
      case AlgorithmProvider.HEY:
        ids = await heyFeed(strategy, limit, offset, request.env);
        break;
      default:
        return response({ success: false, message: 'Invalid provider' });
    }

    return response({ success: true, ids });
  } catch (error) {
    throw error;
  }
};
