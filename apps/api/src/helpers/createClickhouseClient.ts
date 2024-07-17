import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const createClickhouseClient = () => {
  return createClient({
    compression: {
      request: true,
      response: true
    },
    password: process.env.CLICKHOUSE_PASSWORD,
    url: 'http://clickhouse.railway.internal:8123',
    username: 'clickhouse'
  });
};

export default createClickhouseClient;
