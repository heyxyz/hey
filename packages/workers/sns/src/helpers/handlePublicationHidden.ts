import { Errors } from '@lenster/data/errors';

import type { Env } from '../types';

interface PublicationHidden {
  serverPubId?: string;
}

const handlePublicationHidden = async (data: PublicationHidden, env: Env) => {
  const { serverPubId } = data;

  const response = await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `
      ALTER TABLE firehose
      DELETE WHERE pubId = '${serverPubId}';
    `
  });

  if (response.status !== 200) {
    return new Response(
      JSON.stringify({ success: false, error: Errors.StatusCodeIsNot200 })
    );
  }
};

export default handlePublicationHidden;
