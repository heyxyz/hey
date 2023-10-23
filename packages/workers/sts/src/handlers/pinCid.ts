import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const cid = request.query.cid as string;

    const ipfsResponse = await fetch(
      `https://cl-api.ipfs-lens.dev/pins/${cid}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${request.env.LENS_IPFS_AUTH_LEY}`,
          'X-App': 'hey.xyz'
        }
      }
    );

    const json: {
      cid: string;
    } = await ipfsResponse.json();

    return response({ success: true, cid: json.cid });
  } catch (error) {
    return response({ success: false });
  }
};
