declare namespace NodeJS {
  interface ProcessEnv {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    CLICKHOUSE_PASSWORD: string;
    DATABASE_URL: string;
    LENS_DATABASE_PASSWORD: string;
    REDIS_URL: string;
  }
}
