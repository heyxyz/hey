import { createClient } from '@clickhouse/client-web';

import { CLICKHOUSE_URL } from './constants';

const createClickhouseClient = () => {
  return createClient({
    host: CLICKHOUSE_URL,
    database: 'default',
    password: process.env.CLICKHOUSE_PASSWORD
  });
};

export default createClickhouseClient;
