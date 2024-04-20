import { createClient } from '@clickhouse/client';

const createClickhouseClient = (username?: string, password?: string) => {
  password = password || process.env.CLICKHOUSE_PASSWORD;
  username = username || 'default';

  return createClient({
    database: 'default',
    password,
    url: 'http://clickhouse.hey.xyz:8123',
    username
  });
};

export default createClickhouseClient;
