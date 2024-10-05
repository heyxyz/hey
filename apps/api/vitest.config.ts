import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({ override: true });

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30000
  }
});
