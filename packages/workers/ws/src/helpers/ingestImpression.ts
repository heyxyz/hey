import type { Env } from '../types';

const ingestImpression = (payload: any, websocket: any, env: Env) => {
  if (payload.viewer_id && payload.publication_id) {
    const { viewer_id, publication_id } = payload;
    fetch(env.CLICKHOUSE_REST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `
          INSERT INTO impressions (
            viewer_id,
            publication_id
          ) VALUES (
            '${viewer_id}',
            '${publication_id}'
          )
        `
    });

    websocket.send(JSON.stringify({ id: crypto.randomUUID() }));
  }
};

export default ingestImpression;
