import { join } from 'path';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { readFileSync } from 'fs';
import * as cheerio from 'cheerio';

dotenv.config();

const appDir = process.cwd();

const outfile = join(appDir, 'dist', 'sw.js');
const manifest = JSON.parse(
  readFileSync(join(appDir, 'dist', '.vite', 'ssr-manifest.json'), 'utf8')
);
const buffer = readFileSync(join(appDir, 'dist', 'index.html'));
const $ = cheerio.load(buffer);

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
    SW_CACHE_JSON: `'${[
      ...new Set(
        [...Object.values(manifest), $('[type="module"]').attr('src')].flat()
      )
    ].join(',')}'`
  }
});
