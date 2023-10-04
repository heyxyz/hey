import { createData, EthereumSigner } from '@hey/bundlr';
import type { PublicationMetadataV2Input } from '@hey/lens';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const payload: PublicationMetadataV2Input = await request.json();
    const signer = new EthereumSigner(request.env.BUNDLR_PRIVATE_KEY);
    if (payload.content?.length) {
      try {
        const aiEndpoint = 'https://ai.hey.xyz';
        const fetchPayload = {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: payload.content })
        };

        const responses = await Promise.all([
          fetch(`${aiEndpoint}/tagger`, fetchPayload),
          fetch(`${aiEndpoint}/locale`, fetchPayload)
        ]);

        // Append Tags to metadata
        const taggerResponseJson: any = await responses[0].json();
        payload.tags = [
          ...new Set([
            ...(payload.tags || []),
            ...(taggerResponseJson.topics || [])
          ])
        ];

        // Append Locale to metadata
        const localeResponse: any = await responses[1].json();
        if (localeResponse.locale) {
          payload.locale = localeResponse.locale;
        }
      } catch {}
    }

    const tx = createData(JSON.stringify(payload), signer, {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'Hey.xyz' }
      ]
    });
    await tx.sign(signer);

    const bundlrRes = await fetch('http://node2.bundlr.network/tx/matic', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tx.getRaw()
    });

    if (bundlrRes.statusText === 'Created' || bundlrRes.statusText === 'OK') {
      return response({ success: true, id: tx.id, metadata: payload });
    } else {
      return response({ success: false, message: 'Bundlr error!', bundlrRes });
    }
  } catch (error) {
    throw error;
  }
};
