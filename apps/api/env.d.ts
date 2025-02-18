declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    LENS_DATABASE_PASSWORD: string;
    PRIVATE_KEY: string;
    SECRET: string;
    OPENAI_API_KEY: string;
  }
}
