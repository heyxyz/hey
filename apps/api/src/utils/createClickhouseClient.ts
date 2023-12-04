import { createClient } from '@clickhouse/client';

import { CLICKHOUSE_URL } from './constants';

const createClickhouseClient = () => {
  return createClient({
    database: 'default',
    host: CLICKHOUSE_URL,
    password: process.env.CLICKHOUSE_PASSWORD
  });
};

export default createClickhouseClient;
