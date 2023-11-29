import react from '@vitejs/plugin-react-swc';
import * as dotenv from 'dotenv';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

dotenv.config();

const randomChunkNames = new Array(10)
  .fill(0)
  .map((i) => (Math.random() + 1).toString(36).substring(7));

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
              return randomChunkNames[0];
            }
            if (id.includes('@aws-sdk')) {
              return randomChunkNames[1];
            }
            if (id.includes('livepeer') || id.includes('hls')) {
              return randomChunkNames[2];
            }
            if (id.includes('bn.js')) {
              return randomChunkNames[3];
            }
            if (id.includes('zod')) {
              return randomChunkNames[4];
            }
            if (id.includes('plyr')) {
              return randomChunkNames[5];
            }
          }
        }
      }
    }
  };
});
