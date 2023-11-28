import fs from 'fs';
import react from '@vitejs/plugin-react-swc';
import * as dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite';
import fg from 'fast-glob';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

dotenv.config();

// let entries = fg.sync(['src/components/*'], { deep: 0, onlyDirectories: true });

fs.writeFileSync('./test.txt', '', 'utf8');

// https://vitejs.dev/config/
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
            if (id.includes('node_modules')) {
              return 'node_modules';
            }
            if (id.includes('hey/apps')) {
              return 'apps';
            }
            if (id.includes('hey/packages')) {
              return 'packages';
            }
            fs.appendFileSync('./test.txt', id + '\n', 'utf8');
          }
        }
      }
    }
  };
});
