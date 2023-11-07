import { createClient } from '@clickhouse/client';

const ingestImpression = async (payload: any, ws: any) => {
  if (payload.viewer_id && payload.publication_id) {
    const { viewer_id, publication_id } = payload;
    const client = createClient({
      host: 'http://clickhouse.hey.xyz:8123',
      database: 'default',
      password: process.env.CLICKHOUSE_PASSWORD
    });
    const result = await client.insert({
      table: 'impressions',
      values: [{ viewer_id, publication_id }],
      format: 'JSONEachRow'
    });

    ws.send(JSON.stringify({ id: publication_id, query: result.query_id }));
  }
};

export default ingestImpression;
