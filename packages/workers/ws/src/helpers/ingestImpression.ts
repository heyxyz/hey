import type { Env } from '../types';

const ingestImpression = async (payload: any, env: Env) => {
  const values = payload
    .map((msg: any) => `('${msg.viewer_id}', '${msg.publication_id}')`)
    .join(', ');

  await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `
      INSERT INTO impressions (
        viewer_id,
        publication_id
      ) VALUES ${values};
    `
  });
};

export default ingestImpression;
