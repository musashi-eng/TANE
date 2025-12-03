import type { expect as vitestExpect, vi as vitestVi } from 'vitest';

declare global {
  const expect: typeof vitestExpect;
  const vi: typeof vitestVi;
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;
  const beforeAll: typeof import('vitest').beforeAll;
  const afterAll: typeof import('vitest').afterAll;
}

export {};
