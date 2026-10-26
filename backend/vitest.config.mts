import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

/**
 * Vitest 設定
 *
 * NestJS はデコレータのメタデータ (emitDecoratorMetadata) に依存するため、
 * unplugin-swc でトランスパイルして reflect-metadata を正しく出力させる。
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../coverage',
      include: ['src/**/*.(t|j)s'],
    },
  },
  plugins: [
    // SWC でトランスパイルし、NestJS のデコレータメタデータを保持する
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
