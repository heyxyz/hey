import esbuild from 'esbuild';
import { getFilesInDirectory } from './utils.mjs';
import dotenv from 'dotenv'
dotenv.config()

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
    'process.env.STATIC_ASSETS': JSON.stringify(STATIC_ASSETS),
    'process.env.LATEST_GIT_COMMIT_SHA': JSON.stringify(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? '0.0.1')
  },
  minify: true
});