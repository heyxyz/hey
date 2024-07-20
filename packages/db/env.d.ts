declare namespace NodeJS {
  interface ProcessEnv {
    CLICKHOUSE_PASSWORD: string;
    CLICKHOUSE_URL: string;
    DATABASE_URL: string;
    LENS_DATABASE_PASSWORD: string;
    REDIS_URL: string;
  }
}
