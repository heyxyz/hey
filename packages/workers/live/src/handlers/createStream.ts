import parseJwt from '@hey/lib/parseJwt';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const accessToken = request.headers.get('X-Access-Token');

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
