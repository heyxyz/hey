import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'cypress';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  projectId: 'v8tv5e',
  video: false,
  screenshotOnRunFailure: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    URL: process.env.NEXT_PUBLIC_URL ?? 'http://localhost:4783',
    is_mainnet: process.env.NEXT_PUBLIC_IS_MAINNET === 'true'
  },
  e2e: {
    setupNodeEvents() {
      //do nothing
    }
  }
});
