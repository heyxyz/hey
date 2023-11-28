import react from '@vitejs/plugin-react-swc';
import * as dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

dotenv.config();

export default defineConfig(() => {
  return {
    plugins: [nodePolyfills(), react()],
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, './src/lib'),
        '@gql': path.resolve(__dirname, './src/gql'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@store': path.resolve(__dirname, './src/store'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@enums': path.resolve(__dirname, './src/enums'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@generated': path.resolve(__dirname, './src/generated'),
        '@components': path.resolve(__dirname, './src/components'),
        '@persisted': path.resolve(__dirname, './src/store/persisted')
      }
    },
    define: {
      global: {},
      'process.env': process.env,
      'process.env.NEXT_PUBLIC_LENS_NETWORK': `'${process.env.NEXT_PUBLIC_LENS_NETWORK}'`,
      'process.env.NEXT_PUBLIC_IS_PRODUCTION': `'${process.env.NEXT_PUBLIC_IS_PRODUCTION}'`
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
          chunkFileNames: 'chunk-[name].[hash].js',
          entryFileNames: 'entry-[name].[hash].js',
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
