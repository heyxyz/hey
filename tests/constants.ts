export const isNightly = process.env.NIGHTLY === 'true';
export const WEB_BASE_URL = isNightly ? 'https://lenster.xyz' : 'http://localhost:4783';
export const PRERENDER_BASE_URL = isNightly ? 'https://prerender.lenster.xyz' : 'http://localhost:4784';
export const METADATA_BASE_URL = isNightly ? 'https://metadata.lenster.xyz' : 'http://localhost:8083';
