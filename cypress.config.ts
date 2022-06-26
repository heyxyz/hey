import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'v8tv5e',
  video: false,
  screenshotOnRunFailure: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    setupNodeEvents(on, config) {
      config.env = process.env
    }
  }
})
