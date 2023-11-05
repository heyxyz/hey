import type { Env } from '../types';

const ingestImpression = async (payload: any, websocket: any, env: Env) => {
  if (payload.viewer_id && payload.publication_id) {
    const { viewer_id, publication_id } = payload;
    const clickhouseResponse = await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
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

    if (clickhouseResponse.status !== 200) {
      websocket.send(JSON.stringify({ error: 'Insert error' }));
    } else {
      websocket.send(
        JSON.stringify({
          id: clickhouseResponse.headers.get('x-clickhouse-query-id')
        })
      );
    }
  }
};

export default ingestImpression;
