declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_PRIVATE_KEY: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    CLICKHOUSE_PASSWORD: string;
    CLICKHOUSE_URL: string;
    DATABASE_URL: string;
    EVER_ACCESS_KEY: string;
    EVER_ACCESS_SECRET: string;
    GITLAB_ACCESS_TOKEN: string;
    LENS_DATABASE_PASSWORD: string;
    PRIVATE_KEY: string;
    SECRET: string;
    SLACK_WEBHOOK_URL: string;
  }
}
