import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

import { CLICKHOUSE_URL } from './constants';

dotenv.config({ override: true });

const createClickhouseClient = () => {
  return createClient({
    database: 'clickhouse',
    password: process.env.CLICKHOUSE_PASSWORD,
    url: CLICKHOUSE_URL,
    username: 'clickhouse'
  });
};

export default createClickhouseClient;
