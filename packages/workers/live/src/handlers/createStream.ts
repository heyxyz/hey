import { Errors } from '@hey/data/errors';
import parseJwt from '@hey/lib/parseJwt';
import response from '@hey/lib/response';
import { boolean, object } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  record: boolean;
};

const validationSchema = object({
  record: boolean()
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const accessToken = request.headers.get('X-Access-Token');
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { record } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken as string);
    const livepeerResponse = await fetch('https://livepeer.studio/api/stream', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${request.env.LIVEPEER_API_KEY}`
      },
      body: JSON.stringify({
        name: `${payload.id}-${crypto.randomUUID()}`,
        record,
        profiles: [
          { name: '720p0', fps: 0, bitrate: 3000000, width: 1280, height: 720 },
          {
            name: '1080p0',
            fps: 0,
            bitrate: 6000000,
            width: 1920,
            height: 1080
          }
        ]
      })
    });

    const result = await livepeerResponse.json();

    return response({ success: true, result: result });
  } catch (error) {
    throw error;
  }
};
