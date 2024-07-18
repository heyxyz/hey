declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DECENT_API_KEY: string;
    NEXT_PUBLIC_IS_PRODUCTION: string;
    NEXT_PUBLIC_LENS_NETWORK: 'mainnet' | 'testnet';
    NEXT_PUBLIC_OPENSEA_API_KEY: string;
    NEXT_PUBLIC_RARIBLE_API_KEY: string;
    NEXT_PUBLIC_THIRDWEB_TOKEN: string;
  }
}
