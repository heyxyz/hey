export const isNightly = process.env.NIGHTLY === 'true';
export const WEB_BASE_URL = isNightly
  ? 'https://lenster.xyz'
  : 'http://localhost:4783';
