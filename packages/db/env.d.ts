declare namespace NodeJS {
  interface ProcessEnv {
    CLICKHOUSE_PASSWORD: string;
    REDIS_URL: string;
  }
}
