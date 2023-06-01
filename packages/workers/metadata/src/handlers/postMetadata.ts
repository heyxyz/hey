import { createData, EthereumSigner } from '@lenster/bundlr';
import type { IRequest } from 'itty-router';

import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  try {
    const payload = await request.json();
    const signer = new EthereumSigner(env.BUNDLR_PRIVATE_KEY);
    const tx = createData(JSON.stringify(payload), signer, {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'Lenster' }
      ]
    });
    await tx.sign(signer);
    const bundlrRes = await fetch('http://node2.bundlr.network/tx/matic', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tx.getRaw()
    });

    if (bundlrRes.statusText === 'Created' || bundlrRes.statusText === 'OK') {
      return new Response(JSON.stringify({ success: true, id: tx.id }));
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Bundlr error!', bundlrRes })
      );
    }
  } catch (error) {
    console.error('Failed to create metadata data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
