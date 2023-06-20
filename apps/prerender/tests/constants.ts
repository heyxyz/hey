export const isNightly = process.env.NIGHTLY === 'true';
export const PRERENDER_BASE_URL = isNightly
  ? 'https://prerender.lenster.xyz'
  : 'http://localhost:4784';
