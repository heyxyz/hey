import { createData, EthereumSigner } from '@lenster/bundlr';
import type { PublicationMetadataV2Input } from '@lenster/lens';
import type { IRequest } from 'itty-router';

import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  try {
    const payload: PublicationMetadataV2Input = await request.json();
    const signer = new EthereumSigner(env.BUNDLR_PRIVATE_KEY);
    const aiEndpoint = 'https://ai.lenster.xyz';
    const fetchPayload = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: payload.content })
    };

    const responses = await Promise.all([
      fetch(`${aiEndpoint}/tagger`, fetchPayload),
      fetch(`${aiEndpoint}/locale`, fetchPayload)
    ]);

    const taggerResponseJson: any = await responses[0].json();
    payload.tags = taggerResponseJson.topics;

    const localeResponse: any = await responses[1].json();
    if (localeResponse.locale) {
      payload.locale = localeResponse.locale;
    }

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
        JSON.stringify({ success: true, id: tx.id, metadata: payload })
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
