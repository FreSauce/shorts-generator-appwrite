declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RAPIDAPI_KEY: string;
    }
  }
}

export {};
