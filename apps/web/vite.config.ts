import react from '@vitejs/plugin-react-swc';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

import devFont from './src/lib/font/vite-dev-font';

dotenv.config();

const chunkDefinitions = [
  { name: 'date-fns', criterion: 'date-fns' },
  { name: 'aws-sdk', criterion: '@aws-sdk' },
  { name: 'livepeer-hls', criterion: ['livepeer', 'hls'] },
  { name: 'bn', criterion: 'bn.js' },
  { name: 'zod', criterion: ['zod', 'chroma-js'] },
  { name: 'plyr', criterion: 'plyr' }
];

export default defineConfig(() => {
  return {
    plugins: [nodePolyfills(), react(), tsconfigPaths(), devFont],
    define: {
      'process.env.LENS_NETWORK': `'${process.env.LENS_NETWORK}'`,
      'process.env.IS_PRODUCTION': `'${process.env.IS_PRODUCTION}'`
    },
    server: { open: true, port: 4783, host: '0.0.0.0' },
    preview: { open: true, port: 4783, host: '0.0.0.0' },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            for (const chunkDef of chunkDefinitions) {
              if (Array.isArray(chunkDef.criterion)) {
                if (chunkDef.criterion.some((crit) => id.includes(crit))) {
                  return chunkDef.name;
                }
              } else if (id.includes(chunkDef.criterion)) {
                return chunkDef.name;
              }
            }
          }
        }
      }
    }
  };
});
