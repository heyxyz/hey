import { createData, EthereumSigner } from '@hey/irys';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const payload = await request.json();
    const signer = new EthereumSigner(request.env.IRYS_PRIVATE_KEY);

    const tx = createData(JSON.stringify(payload), signer, {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'Hey.xyz' }
      ]
    });
    await tx.sign(signer);

    const irysRes = await fetch('http://node2.irys.xyz/tx/matic', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tx.getRaw()
    });

    if (irysRes.statusText === 'Created' || irysRes.statusText === 'OK') {
      return response({ success: true, id: tx.id, metadata: payload });
    } else {
      return response({ success: false, message: 'Irys error!', irysRes });
    }
  } catch (error) {
    throw error;
  }
};
