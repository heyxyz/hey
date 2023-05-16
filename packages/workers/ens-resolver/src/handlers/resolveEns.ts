import type { IRequest } from 'itty-router';
import { error } from 'itty-router';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

import { keysValidator } from '../helpers/keysValidator';
import { resolverAbi } from '../resolverAbi';

type ExtensionRequest = {
  addresses: string[];
};

const requiredKeys: (keyof ExtensionRequest)[] = ['addresses'];

export default async (request: IRequest) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { addresses } = body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  if (addresses.length > 50) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many addresses!' })
    );
  }

  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http()
    });

    const data = await client.readContract({
      address: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
      abi: resolverAbi,
      args: [addresses],
      functionName: 'getNames'
    });

    return new Response(JSON.stringify({ success: true, data }));
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
