import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: { "@helpers": "/src/helpers" },
    globals: true,
    testTimeout: 30000
  }
});
