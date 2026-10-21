import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.integration.ts'],
    setupFiles: ['./vitest.integration.setup.ts'],
    testTimeout: 60_000,
    coverage: {
      exclude: ['src/**/*.integration.ts'],
    },
  },
}); 