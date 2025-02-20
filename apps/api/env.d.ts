declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PRIVATE_KEY: string;
    SECRET: string;
    OPENAI_API_KEY: string;
  }
}
