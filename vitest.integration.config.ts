import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.integration.ts'],
    coverage: {
      exclude: ['src/**/*.integration.ts'],
    },
  },
}); 