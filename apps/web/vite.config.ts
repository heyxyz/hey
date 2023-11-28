import react from '@vitejs/plugin-react-swc';
import * as dotenv from 'dotenv';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

dotenv.config();

export default defineConfig(() => {
  return {
    plugins: [nodePolyfills(), react(), tsconfigPaths()],
    define: {
      'process.env.LENS_NETWORK': `'${process.env.LENS_NETWORK}'`,
      'process.env.IS_PRODUCTION': `'${process.env.IS_PRODUCTION}'`
    },
    server: {
      open: true,
      port: 4783,
      host: '0.0.0.0'
    },
    preview: {
      open: true,
      port: 4783,
      host: '0.0.0.0'
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('date-fns')) {
              return '_date-fns';
            }
            if (id.includes('@aws-sdk')) {
              return '_aws_sdk';
            }
            if (id.includes('livepeer') || id.includes('hls')) {
              return '_livepeer';
            }
            if (id.includes('bn.js')) {
              return '_bn';
            }
            if (id.includes('zod')) {
              return '_zod';
            }
            if (id.includes('plyr')) {
              return '_plyr';
            }
          }
        }
      }
    }
  };
});
