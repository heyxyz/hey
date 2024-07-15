import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

import { CLICKHOUSE_URL } from './constants';

dotenv.config({ override: true });

const createClickhouseClient = (password?: string) => {
  password = password || process.env.CLICKHOUSE_PASSWORD;

  return createClient({
    database: 'clickhouse',
    password,
    url: CLICKHOUSE_URL,
    username: 'clickhouse'
  });
};

export default createClickhouseClient;
