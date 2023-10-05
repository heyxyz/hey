require('dotenv').config();
const esbuild = require('esbuild');
const { getFilesInDirectory } = require('./utils');

const STATIC_ASSETS = getFilesInDirectory('public/');

const outfile = !!process.env.NEXT_PUBLIC_IS_PRODUCTION
  ? '.vercel/output/static/sw.js' // this vary based deployment environment
  : 'public/sw.js';

esbuild
  .build({
    target: 'es2020',
    platform: 'browser',
    entryPoints: ['./src/sw/index.ts'],
    outfile,
    allowOverwrite: true,
    format: 'esm',
    bundle: true,
    define: {
      'process.env.STATIC_ASSETS': JSON.stringify(STATIC_ASSETS)
    },
    minify: true
  })
  .then(() => {});
