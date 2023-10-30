import response from '@hey/lib/response';
import jwt from '@tsndr/cloudflare-worker-jwt';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const accessToken = request.headers.get('X-Access-Token');

  try {
    const { payload } = jwt.decode(accessToken as string);
    const livepeerResponse = await fetch('https://livepeer.studio/api/stream', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${request.env.LIVEPEER_API_KEY}`
      },
      body: JSON.stringify({
        name: `${payload.id}-${crypto.randomUUID()}`,
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
