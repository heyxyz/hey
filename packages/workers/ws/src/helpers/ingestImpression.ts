import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';

import type { Env } from '../types';

const ingestImpression = async (payload: any, websocket: any, env: Env) => {
  if (payload.viewer_id && payload.publication_id) {
    const { viewer_id, publication_id } = payload;
    const client = createClickhouseClient(env.CLICKHOUSE_PASSWORD);
    const result = await client.insert({
      table: 'impressions',
      values: [{ viewer_id, publication_id }],
      format: 'JSONEachRow'
    });

    websocket.send(
      JSON.stringify({ id: publication_id, query: result.query_id })
    );
  }
};

export default ingestImpression;
