import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '.'),
          },
        },
        test: {
          name: 'node',
          environment: 'node',
          include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'lib/**/*.test.ts'],
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '.'),
          },
        },
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['components/**/*.test.tsx'],
          setupFiles: ['./vitest.setup.dom.ts'],
          globals: true,
        },
      },
    ],
  },
});
