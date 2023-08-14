import { ClickHouse } from 'clickhouse';

import server from '../server.js';

const createClickHouseClient = () => {
  return new ClickHouse({
    url: 'http://clickhouse.lenster.xyz',
    port: 8123,
    debug: false,
    basicAuth: {
      username: server.config.CLICKHOUSE_USERNAME,
      password: server.config.CLICKHOUSE_PASSWORD
    },
    isUseGzip: false,
    trimQuery: false,
    usePost: false,
    format: 'json',
    raw: false,
    config: {
      session_timeout: 60,
      output_format_json_quote_64bit_integers: 0,
      enable_http_compression: 0,
      database: 'default'
    }
  });
};

export default createClickHouseClient;
