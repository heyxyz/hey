import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { globals: true, testTimeout: 30000 },
  resolve: {
    alias: {
      '@utils': fileURLToPath(new URL('./utils', import.meta.url))
    }
  }
});
