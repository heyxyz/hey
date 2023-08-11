import { Errors } from '@lenster/data/errors';
import sanitizeDStorageUrl from '@lenster/lib/sanitizeDStorageUrl';
import type { IRequest } from 'itty-router';

import type { Env } from '../types';

type ExtensionRequest = {
  profileId?: string;
  serverPubId?: string;
  contentURI?: string;
  collectModule?: string;
  collectModuleReturnData?: string;
  referenceModule?: string;
  referenceModuleReturnData?: string;
  timestamp?: string;
};

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return new Response(
      JSON.stringify({ success: false, error: Errors.NoBody })
    );
  }

  const {
    profileId,
    serverPubId,
    contentURI,
    collectModule,
    collectModuleReturnData,
    referenceModule,
    referenceModuleReturnData,
    timestamp
  } = body as ExtensionRequest;

  try {
    // Extract metadata
    let metadata;
    try {
      const contentURIResponse = await fetch(sanitizeDStorageUrl(contentURI));
      metadata = await contentURIResponse.json();
    } catch {}

    const response = await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `
        INSERT INTO firehose (
          profileId,
          pubId,
          contentURI,
          metadata,
          collectModule,
          collectModuleReturnData,
          referenceModule,
          referenceModuleReturnData,
          timestamp
        ) VALUES (
          ${profileId ? `'${profileId}'` : null},
          ${serverPubId ? `'${serverPubId}'` : null},
          ${contentURI ? `'${contentURI}'` : null},
          ${metadata ? `'${JSON.stringify(metadata)}'` : null},
          ${collectModule ? `'${collectModule}'` : null},
          ${collectModuleReturnData ? `'${collectModuleReturnData}'` : null},
          ${referenceModule ? `'${referenceModule}'` : null},
          ${
            referenceModuleReturnData ? `'${referenceModuleReturnData}'` : null
          },
          ${timestamp ? `'${timestamp}'` : null}
        )
      `
    });

    if (response.status !== 200) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.StatusCodeIsNot200 })
      );
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    throw error;
  }
};
