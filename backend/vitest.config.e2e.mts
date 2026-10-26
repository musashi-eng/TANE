import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

/**
 * Vitest E2E 設定
 *
 * E2E テストは test/**\/*.e2e-spec.ts に配置する。
 * (現時点では E2E テストは未配置。追加時にこの設定が使われる)
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
