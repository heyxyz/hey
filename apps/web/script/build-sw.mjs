import dotenv from 'dotenv';
import esbuild from 'esbuild';

dotenv.config();

const outfile = 'public/sw.js';

esbuild.build({
  allowOverwrite: true,
  bundle: true,
  entryPoints: ['./src/service-workers/index.ts'],
  format: 'esm',
  minify: true,
  outfile,
  platform: 'browser',
  target: 'es2020'
});
