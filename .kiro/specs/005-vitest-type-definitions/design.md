# Design Document

## Overview

GitHub ActionsでのTypeScriptコンパイラチェック（`npx tsc --noEmit`）において、Vitestのテスト関数の型定義が認識されないエラーが発生しています。この問題は、TypeScriptコンパイラがデフォルトで`tsconfig.json`を使用し、テスト用の型定義を含む`tsconfig.spec.json`を参照していないことが原因です。

この設計では、以下の3つのアプローチで問題を解決します：

1. **tsconfig.jsonの拡張**: メインのtsconfig.jsonにVitest型定義を追加
2. **グローバル型定義ファイルの作成**: test-setup.tsでのglobalThis型エラーを解決
3. **GitHub Actionsワークフローの改善**: 適切なtsconfig参照

## Architecture

### 現在の問題

```
GitHub Actions
  └─ npx tsc --noEmit
       └─ tsconfig.json を使用（デフォルト）
            └─ types: ["vitest/globals"] が含まれていない
                 └─ describe, it, expect などが未定義エラー
```

### 解決後のアーキテクチャ

```
GitHub Actions
  └─ npx tsc --noEmit --project tsconfig.spec.json
       └─ tsconfig.spec.json を使用
            ├─ tsconfig.json を継承
            └─ types: ["vitest/globals", "node"] を含む
                 └─ すべてのテスト関数の型が認識される
```

## Components and Interfaces

### 1. TypeScript設定ファイル

#### tsconfig.json（メイン設定）

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

#### tsconfig.spec.json（テスト用設定）

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["vitest/globals", "node"]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts",
    "src/test-setup.ts"
  ]
}
```

**変更点**:
- `types`に`"node"`を追加（globalThisの型定義のため）
- `include`に`"src/test-setup.ts"`を追加

### 2. グローバル型定義ファイル

#### src/vitest-global.d.ts（新規作成）

```typescript
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
```

**目的**:
- Vitestのグローバル関数の型定義を明示的に宣言
- TypeScriptコンパイラがこれらの関数を認識できるようにする

### 3. test-setup.ts（修正）

#### 現在のコード

```typescript
// グローバルなexpectとviを設定
globalThis.expect = expect;
globalThis.vi = vi;
```

**問題**: `globalThis`に対するインデックスシグネチャがないため、型エラーが発生

#### 修正後のコード

```typescript
// グローバルなexpectとviを設定
(globalThis as any).expect = expect;
(globalThis as any).vi = vi;
```

**または、より型安全な方法**:

```typescript
// グローバル型定義を拡張
declare global {
  var expect: typeof import('vitest').expect;
  var vi: typeof import('vitest').vi;
}

// グローバルなexpectとviを設定
globalThis.expect = expect;
globalThis.vi = vi;
```

### 4. GitHub Actionsワークフロー

#### .github/workflows/ci.yml（修正）

```yaml
- name: 型チェック
  working-directory: frontend
  run: npx tsc --noEmit --project tsconfig.spec.json
```

**変更点**:
- `--project tsconfig.spec.json`を追加して、テスト用の型定義を含む設定を使用

## Data Models

### TypeScript設定の継承関係

```
tsconfig.json (ベース設定)
  ↑
  | extends
  |
tsconfig.spec.json (テスト用設定)
  ├─ types: ["vitest/globals", "node"]
  └─ include: ["src/**/*.spec.ts", "src/**/*.d.ts", "src/test-setup.ts"]
```

### 型定義の解決順序

```
1. tsconfig.spec.json の types 配列を確認
   ├─ vitest/globals → node_modules/vitest/globals.d.ts
   └─ node → node_modules/@types/node/index.d.ts

2. include パターンに一致するファイルを確認
   ├─ src/**/*.spec.ts → すべてのテストファイル
   ├─ src/**/*.d.ts → すべての型定義ファイル
   └─ src/test-setup.ts → テストセットアップファイル

3. グローバル型定義ファイルを読み込み
   └─ src/vitest-global.d.ts → Vitestのグローバル関数の型定義
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: TypeScript型チェックの成功

*For any* テストファイル（*.spec.ts）について、TypeScriptコンパイラで型チェックを実行した時、Vitestのテスト関数（describe、it、expect、beforeEach）に関する型エラーが発生しないべきである

**Validates: Requirements 1.1, 1.3**

### Property 2: tsconfig.spec.jsonの型定義包含

*For any* tsconfig.spec.jsonファイルについて、そのファイルのtypes配列には"vitest/globals"と"node"が含まれるべきである

**Validates: Requirements 1.2**

### Property 3: グローバル変数の型安全性

*For any* test-setup.tsファイルについて、globalThisオブジェクトへのアクセス時に型エラーが発生しないべきである

**Validates: Requirements 3.1, 3.2**

### Property 4: CI環境での型チェック成功

*For any* GitHub Actionsワークフローの実行について、`npx tsc --noEmit --project tsconfig.spec.json`コマンドが終了コード0で完了するべきである

**Validates: Requirements 1.4**

### Property 5: ローカルとCI環境の一貫性

*For any* TypeScript設定ファイルについて、ローカル環境とCI環境で同じ設定が使用され、同じ型チェック結果が得られるべきである

**Validates: Requirements 2.1, 2.2**

## Error Handling

### TypeScript型エラー

**エラー**: `Cannot find name 'describe'`

**原因**: Vitestの型定義が読み込まれていない

**対処**:
1. tsconfig.spec.jsonのtypes配列に"vitest/globals"を追加
2. vitest-global.d.tsでグローバル型定義を明示的に宣言

### globalThis型エラー

**エラー**: `Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature`

**原因**: globalThisオブジェクトに対する動的なプロパティアクセスが型安全でない

**対処**:
1. `as any`でキャストする（簡易的）
2. グローバル型定義を拡張する（推奨）

### CI環境での型チェック失敗

**エラー**: GitHub Actionsで`npx tsc --noEmit`が失敗

**原因**: デフォルトでtsconfig.jsonが使用され、テスト用の型定義が含まれていない

**対処**:
1. `--project tsconfig.spec.json`オプションを追加
2. テスト用の型定義を含む設定を明示的に指定

## Testing Strategy

### 単体テスト

このspecでは、設定ファイルの修正が主な作業のため、単体テストは最小限にします。

**テスト対象**:
- TypeScript設定ファイルの構文チェック
- 型定義ファイルの構文チェック

**テスト方法**:
```bash
# TypeScript設定の検証
npx tsc --noEmit --project tsconfig.spec.json

# 型定義ファイルの検証
npx tsc --noEmit src/vitest-global.d.ts
```

### プロパティベーステスト

**使用ライブラリ**: fast-check（ただし、このspecでは設定ファイルの修正が主なため、プロパティベーステストは実施しない）

**理由**: 設定ファイルの正確性は、TypeScriptコンパイラ自体が検証するため、追加のプロパティベーステストは不要

### 統合テスト

**テスト内容**:
1. ローカル環境でのTypeScript型チェック
2. CI環境でのTypeScript型チェック
3. テストファイルのコンパイル

**テスト手順**:

```bash
# 1. ローカル環境でのテスト
docker compose exec frontend npx tsc --noEmit --project tsconfig.spec.json

# 2. テストファイルの実行
docker compose exec frontend npm test

# 3. GitHub Actionsでの検証
# （プルリクエストを作成して自動実行）
```

**期待される結果**:
- すべてのコマンドが終了コード0で完了
- 型エラーが発生しない
- テストが正常に実行される

## Implementation Notes

### 実装の優先順位

1. **高優先度**: tsconfig.spec.jsonの修正（即座にCI環境のエラーを解決）
2. **中優先度**: vitest-global.d.tsの作成（型安全性の向上）
3. **低優先度**: test-setup.tsの修正（既存コードの改善）

### 互換性の考慮

- **Angular 20**: Zonelessモードとの互換性を維持
- **Vitest**: グローバルモード（globals: true）を継続使用
- **TypeScript**: strict モードを維持

### パフォーマンスへの影響

- **型チェック時間**: わずかに増加（追加の型定義ファイルを読み込むため）
- **ビルド時間**: 影響なし
- **テスト実行時間**: 影響なし

## Alternative Approaches

### アプローチ1: tsconfig.jsonに直接型定義を追加

**メリット**:
- 設定ファイルが1つで済む
- シンプルな構成

**デメリット**:
- 本番ビルドにテスト用の型定義が含まれる
- 関心の分離ができない

**結論**: 採用しない

### アプローチ2: Vitestのグローバルモードを無効化

**メリット**:
- 明示的なインポートで型安全性が向上
- グローバル汚染を避けられる

**デメリット**:
- すべてのテストファイルでインポートが必要
- 既存のテストコードを大幅に修正する必要がある

**結論**: 採用しない（既存のコードベースとの互換性を優先）

### アプローチ3: 現在の設計（採用）

**メリット**:
- 既存のコードベースとの互換性を維持
- 関心の分離（本番用とテスト用の設定を分離）
- CI環境での型チェックが正常に動作

**デメリット**:
- 設定ファイルが複数必要
- GitHub Actionsワークフローの修正が必要

**結論**: 採用

## Summary

この設計では、以下の3つの主要な変更を行います：

1. **tsconfig.spec.jsonの拡張**: `types`配列に`"node"`を追加し、`include`に`test-setup.ts`を追加
2. **vitest-global.d.tsの作成**: Vitestのグローバル関数の型定義を明示的に宣言
3. **GitHub Actionsワークフローの修正**: `--project tsconfig.spec.json`オプションを追加

これにより、ローカル環境とCI環境の両方で、TypeScriptの型チェックが正常に動作するようになります。
