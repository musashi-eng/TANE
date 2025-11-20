---
inclusion: always
---

# 開発ガイド

このドキュメントでは、Tamaプロジェクトの開発に必要なコマンドとテスト方法を説明します。

## プロジェクト構成

- **フロントエンド**: Angular 20 + ng-zorro-antd（Ant Design）
- **ガントチャート**: dhtmlx-gantt
- **開発環境**: Docker Compose
- **テストフレームワーク**: Jasmine + Karma

## Angular 20の重要な設定

### Zoneless モード

このプロジェクトは**Zonelessモード**で動作しています。Zone.jsを使用せず、Angularの新しい変更検知メカニズムを採用しています。

**特徴：**
- Zone.jsの依存がないため、バンドルサイズが削減
- パフォーマンスが向上
- より予測可能な変更検知

**設定方法：**
```typescript
// src/app/app.config.ts
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // その他のプロバイダー
  ]
};
```

**注意事項：**
- `zone.js`をpackage.jsonから削除
- angular.jsonのpolyfillsから`zone.js`を削除
- テスト設定からも`zone.js/testing`を削除

### Signals ベースの開発

このプロジェクトでは**Signals**を主要な状態管理手法として使用します。

**基本的な使い方：**

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `
    <h1>{{ title() }}</h1>
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">Increment</button>
  `
})
export class ExampleComponent {
  // Signal の定義
  title = signal('Example Component');
  count = signal(0);
  
  // Computed Signal（派生値）
  doubleCount = computed(() => this.count() * 2);
  
  // Effect（副作用）
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
  
  // Signal の更新
  increment() {
    this.count.update(value => value + 1);
    // または
    // this.count.set(this.count() + 1);
  }
}
```

**Signalsを使うべき場面：**
- コンポーネントの状態管理
- 派生値の計算（computed）
- リアクティブな副作用（effect）
- 親子コンポーネント間のデータ共有

**従来の方法との比較：**

```typescript
// ❌ 従来の方法（使用しない）
export class OldComponent {
  title = 'Example';  // 通常のプロパティ
  count = 0;
}

// ✅ Signalsを使用（推奨）
export class NewComponent {
  title = signal('Example');  // Signal
  count = signal(0);
}
```

**テンプレートでの使用：**

```html
<!-- Signalは関数として呼び出す -->
<h1>{{ title() }}</h1>
<p>Count: {{ count() }}</p>

<!-- Computed Signalも同様 -->
<p>Double: {{ doubleCount() }}</p>
```

**RxJSとの併用：**

SignalsとRxJSは併用できます。必要に応じて`toSignal()`や`toObservable()`を使用します。

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// ObservableをSignalに変換
const data = toSignal(this.http.get('/api/data'));

// SignalをObservableに変換
const count$ = toObservable(this.count);
```

**ベストプラクティス：**
1. 新しいコンポーネントは必ずSignalsを使用する
2. 状態の更新は`set()`または`update()`を使用する
3. 派生値は`computed()`を使用する
4. 副作用は`effect()`を使用する（ただし、最小限に）
5. テンプレートでSignalを使用する際は必ず`()`を付けて呼び出す

## Docker環境

このプロジェクトはDocker Composeを使用して開発環境を構築しています。

### コンテナの起動

```bash
docker compose up -d
```

### コンテナの停止

```bash
docker compose down
```

### コンテナの状態確認

```bash
docker compose ps
```

## コマンド実行方法

**🚨 重要**: このプロジェクトはDocker環境で動作しています。**全てのnpmコマンドは必ずDockerコンテナ内で実行してください。**

### ❌ 間違った実行方法

```bash
# ❌ ローカル環境で直接実行しない
npm install
npm test
npm run build

# ❌ cdコマンドを使用しない
cd backend && npm test
```

### ✅ 正しい実行方法

```bash
# ✅ Dockerコンテナ内で実行
docker compose exec backend npm install
docker compose exec backend npm test
docker compose exec backend npm run build
```

### 基本パターン

```bash
# フロントエンドのコマンド実行
docker compose exec frontend <コマンド>

# バックエンドのコマンド実行
docker compose exec backend <コマンド>

# データベースのコマンド実行
docker compose exec postgres <コマンド>
```

### コンテナ別の実行ルール

- **フロントエンド関連**: `docker compose exec frontend` を使用
- **バックエンド関連**: `docker compose exec backend` を使用
- **データベース関連**: `docker compose exec postgres` を使用

### よく使うコマンドの例

```bash
# フロントエンドのテスト実行
docker compose exec frontend npm test

# バックエンドのテスト実行
docker compose exec backend npm test

# バックエンドのビルド
docker compose exec backend npm run build

# パッケージのインストール
docker compose exec backend npm install <パッケージ名>
docker compose exec frontend npm install <パッケージ名>

# 開発サーバーの起動
docker compose exec backend npm run start:dev
docker compose exec frontend npm start
```

### よく使うコマンド

#### フロントエンド

##### 開発サーバーの起動（自動起動されます）

```bash
# docker-compose.ymlで自動的に実行されます
# 手動で起動する場合:
docker compose exec frontend npm start
```

開発サーバーは `http://localhost:4200` でアクセスできます。

##### 依存パッケージのインストール

```bash
docker compose exec frontend npm install
```

##### ビルド

```bash
# 開発ビルド
docker compose exec frontend npm run build

# 本番ビルド
docker compose exec frontend npm run build -- --configuration production
```

##### コードフォーマット

```bash
docker compose exec frontend npx prettier --write "src/**/*.{ts,html,css,scss}"
```

#### バックエンド

##### 開発サーバーの起動

```bash
# 開発モード（ホットリロード）
docker compose exec backend npm run start:dev

# 通常起動
docker compose exec backend npm start
```

バックエンドサーバーは `http://localhost:3000` でアクセスできます。

##### APIドキュメント（Swagger）

開発環境では、Swagger UIを使用してAPIドキュメントを確認できます：

- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

Swagger UIでは、以下のことができます：
- 全てのAPIエンドポイントの確認
- リクエスト/レスポンスの構造確認
- 「Try it out」機能で直接APIをテスト
- バリデーションルールの確認

**注意**: 本番環境（NODE_ENV=production）では、Swaggerは無効化されます。

##### 依存パッケージのインストール

```bash
docker compose exec backend npm install
```

##### ビルド

```bash
docker compose exec backend npm run build
```

##### テスト実行

```bash
# 全テスト実行
docker compose exec backend npm test

# 特定のテストファイル実行
docker compose exec backend npm test -- <ファイル名>

# カバレッジなしで実行
docker compose exec backend npm test -- --no-coverage
```

## テスト方法

### 単体テスト・統合テストの実行

このプロジェクトでは、Jasmine + Karmaを使用してテストを実行します。

#### テストの実行（CI/CD環境向け）

```bash
docker compose exec frontend npm test -- --watch=false --browsers=ChromeHeadless
```

**注意**: Docker環境ではChromeがインストールされていないため、ブラウザベースのテストは実行できません。
テストコードの構文チェックや型チェックには、以下の方法を使用してください。

#### テストファイルの構文チェック

#### フロントエンド

```bash
# TypeScriptコンパイラで型チェック
docker compose exec frontend npx tsc --noEmit

# 特定のファイルのみチェック
docker compose exec frontend npx tsc --noEmit src/app/integration.spec.ts
```

#### Lintチェック

```bash
# フロントエンド
docker compose exec frontend npx eslint "src/**/*.ts"

# バックエンド
docker compose exec backend npm run lint
```

### テストファイルの場所

- **統合テスト**: `tama/src/app/integration.spec.ts`
- **サービステスト**: `tama/src/app/core/services/*.spec.ts`
- **コンポーネントテスト**: `tama/src/app/features/**/*.spec.ts`

### テストの種類

#### 1. 統合テスト（integration.spec.ts）

コンポーネント間の連携を確認するテストです。以下の項目をテストしています：

- GanttComponent → TaskDialogComponent の連携
- TaskDialogComponent → TaskService の連携
- TaskService → モックデータ の連携
- 基本操作（追加・編集・削除）
- 進捗管理（協力型・個別型）
- 高度な機能（依存関係・マイルストーン・チェックリスト）

#### 2. 単体テスト（*.service.spec.ts）

個別のサービスやコンポーネントの機能をテストします。

#### 3. 手動統合テスト（integration-test-manual.ts）

ブラウザのコンソールで実行できる手動テストスクリプトです。

```typescript
// ブラウザのコンソールで実行
runIntegrationTests();
```

## デバッグ方法

### ブラウザの開発者ツール

1. ブラウザで `http://localhost:4200` を開く
2. F12キーで開発者ツールを開く
3. Consoleタブでログを確認
4. Sourcesタブでブレークポイントを設定

### Angularのデバッグモード

開発サーバーはデフォルトでデバッグモードで起動されます。
コンソールに詳細なログが出力されます。

### ログの確認

```bash
# フロントエンドコンテナのログを表示
docker compose logs -f frontend

# バックエンドコンテナのログを表示
docker compose logs -f backend

# 最新100行のログを表示
docker compose logs --tail=100 frontend
docker compose logs --tail=100 backend

# 全コンテナのログを表示
docker compose logs -f
```

## トラブルシューティング

### ポート4200が既に使用されている

```bash
# 使用中のプロセスを確認
lsof -i :4200

# コンテナを再起動
docker compose restart frontend
```

### node_modulesの問題

```bash
# フロントエンドのnode_modulesを削除して再インストール
docker compose exec frontend rm -rf node_modules package-lock.json
docker compose exec frontend npm install

# バックエンドのnode_modulesを削除して再インストール
docker compose exec backend rm -rf node_modules package-lock.json
docker compose exec backend npm install
```

### コンテナの完全リセット

```bash
# コンテナとボリュームを削除
docker compose down -v

# イメージを再ビルド
docker compose build --no-cache

# コンテナを起動
docker compose up -d
```

## コード品質

### TypeScriptの型チェック

```bash
# フロントエンド
docker compose exec frontend npx tsc --noEmit

# バックエンド
docker compose exec backend npx tsc --noEmit
```

### コードスタイルのチェック

```bash
# フロントエンド
docker compose exec frontend npx prettier --check "src/**/*.{ts,html,css,scss}"

# バックエンド
docker compose exec backend npx prettier --check "src/**/*.ts"
```

### 自動フォーマット

```bash
# フロントエンド
docker compose exec frontend npx prettier --write "src/**/*.{ts,html,css,scss}"

# バックエンド
docker compose exec backend npm run format
```

## ベストプラクティス

1. **Docker環境でのコマンド実行**
   - 全てのコマンドは必ず `docker compose exec` を使用
   - フロントエンド: `docker compose exec frontend`
   - バックエンド: `docker compose exec backend`
   - ローカル環境で直接コマンドを実行しない

2. **コミット前のチェック**
   - TypeScriptの型チェックを実行
   - コードフォーマットを実行
   - テストファイルの構文チェックを実行

3. **テスト駆動開発**
   - 新機能を実装する前にテストを書く
   - テストが失敗することを確認
   - 実装してテストを通す

4. **コードレビュー**
   - 変更内容が要件を満たしているか確認
   - テストが適切に書かれているか確認
   - コードスタイルが統一されているか確認

## 参考リンク

- [Angular公式ドキュメント](https://angular.dev/)
- [ng-zorro-antd公式ドキュメント](https://ng.ant.design/)
- [dhtmlx-gantt公式ドキュメント](https://docs.dhtmlx.com/gantt/)
- [Jasmine公式ドキュメント](https://jasmine.github.io/)
