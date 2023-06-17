import { createData, EthereumSigner } from '@lenster/bundlr';
import type { PublicationMetadataV2Input } from '@lenster/lens';
import type { IRequest } from 'itty-router';

import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  try {
    const payload: PublicationMetadataV2Input = await request.json();
    const signer = new EthereumSigner(env.BUNDLR_PRIVATE_KEY);

    // Generate tags using HuggingFace API
    const taggerResponse = await fetch(
      'https://r35q1d9vdewm7xr4.us-east-1.aws.endpoints.huggingface.cloud',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: payload.content,
          parameters: { top_k: 2 }
        })
      }
    );

    const taggerResponseJson: any = await taggerResponse.json();
    let labels;
    if ('error' in taggerResponseJson) {
      labels = null;
    } else {
      labels = taggerResponseJson[0].slice(0, 2).map((item: any) => item.label);
    }

    payload.tags = labels;

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
      return new Response(
        JSON.stringify({
          success: true,
          id: tx.id,
          metadata: payload,
          taggerResponseJson
        })
      );
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
