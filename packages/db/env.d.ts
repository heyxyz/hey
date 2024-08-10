declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    LEAFWATCH_DATABASE_URL: string;
    LENS_DATABASE_PASSWORD: string;
    NODE_ENV: string;
    REDIS_URL: string;
  }
}
