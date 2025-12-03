# Implementation Plan

- [x] 1. tsconfig.spec.jsonの修正
  - tsconfig.spec.jsonのtypes配列に"node"を追加
  - includeパターンに"src/test-setup.ts"を追加
  - _Requirements: 1.2, 3.3_

- [x] 2. グローバル型定義ファイルの作成
  - src/vitest-global.d.tsファイルを作成
  - Vitestのグローバル関数（describe、it、expect、beforeEach、afterEach、beforeAll、afterAll）の型定義を追加
  - _Requirements: 1.1, 1.3_

- [x] 3. test-setup.tsの修正
  - globalThisへのアクセスを型安全にする
  - グローバル型定義を拡張する方法を採用
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. GitHub Actionsワークフローの修正
  - .github/workflows/ci.ymlのフロントエンド型チェックステップを修正
  - `--project tsconfig.spec.json`オプションを追加
  - _Requirements: 1.4, 2.1_

- [x] 5. ローカル環境での検証
  - docker compose exec frontend npx tsc --noEmit --project tsconfig.spec.jsonを実行
  - 型エラーが発生しないことを確認
  - _Requirements: 1.3, 2.1_

- [x] 6. テストの実行確認
  - docker compose exec frontend npm testを実行
  - すべてのテストが正常に実行されることを確認
  - _Requirements: 1.3_

- [-] 7. CI環境での検証
  - 変更をコミットしてプッシュ
  - GitHub Actionsが成功することを確認
  - _Requirements: 1.4, 2.1, 2.2_
