import type { Env } from '../types';

const ingestImpression = async (payload: any, websocket: any, env: Env) => {
  if (payload.viewer_id && payload.publication_id) {
    const { viewer_id, publication_id } = payload;
    const insertedRecently = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `
        SELECT 
          count(*)
        FROM impressions
        WHERE viewer_id = '${viewer_id}' AND
        publication_id = '${publication_id}' AND
        viewed_at > now64(3) - INTERVAL 20 SECOND;
      `
      }
    );
    const json: {
      data: [string][];
    } = await insertedRecently.json();

    if (parseInt(json.data[0][0]) < 1) {
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
    } else {
      websocket.send(
        JSON.stringify({ message: 'Already seen less than 10 seconds!' })
      );
    }
  }
};

export default ingestImpression;
