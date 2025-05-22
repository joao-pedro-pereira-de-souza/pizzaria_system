declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      RATE_LIMIT_TIME?: string ;
      RATE_LIMIT_LIMIT_REQUESTS?: string ;
      CRYPTO_SECURITY: string;

      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;

      DATABASE_URL: string;
    }
  }
}

export {};
