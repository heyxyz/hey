import { Errors } from '@hey/data/errors';
import hasOwnedLensProfiles from '@hey/lib/hasOwnedLensProfiles';
import response from '@hey/lib/response';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const accessToken = request.headers.get('X-Access-Token');
  const network = request.headers.get('X-Lens-Network');
  if (!accessToken || !network) {
    return response({ success: false, error: Errors.NoProperHeaders });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { id } = body as ExtensionRequest;
  const isMainnet = network === 'mainnet';

  try {
    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(
      payload.evmAddress,
      id,
      isMainnet
    );
    if (!hasOwned) {
      return response({ success: false, error: Errors.InvalidProfileId });
    }

    const livepeerResponse = await fetch('https://livepeer.studio/api/stream', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${request.env.LIVEPEER_API_KEY}`
      },
      body: JSON.stringify({
        name: `${id}-${crypto.randomUUID()}`,
        profiles: [
          { name: '720p0', fps: 0, bitrate: 3000000, width: 1280, height: 720 }
        ]
      })
    });

    const result = await livepeerResponse.json();

    return response({ success: true, result: result });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
