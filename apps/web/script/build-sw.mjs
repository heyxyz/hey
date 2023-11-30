import { join } from 'path';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { readFileSync } from 'fs';

dotenv.config();

const outfile = join(process.cwd(), 'dist', 'sw.js');
const manifest = JSON.parse(
  readFileSync(
    join(process.cwd(), 'dist', '.vite', 'ssr-manifest.json'),
    'utf8'
  )
);

esbuild.build({
  target: 'es2020',
  platform: 'browser',
  entryPoints: ['./src/service-workers/index.ts'],
  outfile,
  allowOverwrite: true,
  format: 'esm',
  bundle: true,
  minify: true,
  define: {
    SW_UNQIUE_BUILD_ID: `'${new Date().getTime()}'`,
    SW_CACHE_JSON: `'${[...new Set(Object.values(manifest).flat())].join(',')}'`
  }
});
