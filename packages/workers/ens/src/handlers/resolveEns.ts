import { Errors } from '@lenster/data/errors';
import getRpc from '@lenster/lib/getRpc';
import response from '@lenster/lib/response';
import type { IRequest } from 'itty-router';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { array, object, string } from 'zod';

import { resolverAbi } from '../resolverAbi';

type ExtensionRequest = {
  addresses: string[];
};

const validationSchema = object({
  addresses: array(string().regex(/^(0x)?[\da-f]{40}$/i)).max(50, {
    message: 'Too many addresses!'
  })
});

export default async (request: IRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { addresses } = body as ExtensionRequest;

  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(getRpc(1))
    });

    const data = await client.readContract({
      address: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
      abi: resolverAbi,
      args: [addresses],
      functionName: 'getNames'
    });

    return response({ success: true, data });
  } catch (error) {
    throw error;
  }
};
