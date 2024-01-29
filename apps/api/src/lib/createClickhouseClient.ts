import { createClient } from '@clickhouse/client';

import { CLICKHOUSE_URL } from './constants';

const createClickhouseClient = (username?: string, password?: string) => {
  password = password || process.env.CLICKHOUSE_PASSWORD;
  username = username || 'default';

  return createClient({
    database: 'default',
    host: CLICKHOUSE_URL,
    password,
    username
  });
};

export default createClickhouseClient;
