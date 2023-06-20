export const isNightly = process.env.NIGHTLY === 'true';
export const PRERENDER_BASE_URL = isNightly
  ? 'https://prerender.lenster.xyz'
  : 'http://localhost:4784';
export const METADATA_BASE_URL = isNightly
  ? 'https://metadata.lenster.xyz'
  : 'http://localhost:8083';
export const OEMBED_BASE_URL = isNightly
  ? 'https://oembed.lenster.xyz'
  : 'http://localhost:8087';
