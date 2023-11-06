import { createClient } from '@clickhouse/client-web';

import { CLICKHOUSE_URL } from './constants';

const createClickhouseClient = (password: string) => {
  return createClient({
    host: CLICKHOUSE_URL,
    database: 'default',
    password
  });
};

export default createClickhouseClient;
