import response from '@lenster/lib/response';

import haveMintedZoraNft from '../helpers/haveMintedZoraNft';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const by = request.query.by as `0x${string}`;
  const contract = request.query.contract as `0x${string}`;

  try {
    return response({
      success: true,
      isMember: await haveMintedZoraNft(by, contract)
    });
  } catch (error) {
    throw error;
  }
};
