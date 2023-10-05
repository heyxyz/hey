const esbuild = require('esbuild');
const { getFilesInDirectory } = require('./utils');

const STATIC_ASSETS = getFilesInDirectory('public/');

const outfile = 'public/sw.js'

esbuild.build({
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
});
