import { createClient } from '@clickhouse/client';

const clickhouseClient = createClient({
  compression: { request: true, response: true },
  keep_alive: { enabled: true },
  password: process.env.CLICKHOUSE_PASSWORD,
  url: 'http://clickhouse.railway.internal:8123',
  username: 'clickhouse'
});

export default clickhouseClient;
