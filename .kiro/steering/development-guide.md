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

Docker環境でコマンドを実行する場合は、必ず `docker compose exec frontend` を先頭に付けてください。

### 基本パターン

```bash
docker compose exec frontend <コマンド>
```

### よく使うコマンド

#### 開発サーバーの起動（自動起動されます）

```bash
# docker-compose.ymlで自動的に実行されます
# 手動で起動する場合:
docker compose exec frontend npm start
```

開発サーバーは `http://localhost:4200` でアクセスできます。

#### 依存パッケージのインストール

```bash
docker compose exec frontend npm install
```

#### ビルド

```bash
# 開発ビルド
docker compose exec frontend npm run build

# 本番ビルド
docker compose exec frontend npm run build -- --configuration production
```

#### コードフォーマット

```bash
docker compose exec frontend npx prettier --write "src/**/*.{ts,html,css,scss}"
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

```bash
# TypeScriptコンパイラで型チェック
docker compose exec frontend npx tsc --noEmit

# 特定のファイルのみチェック
docker compose exec frontend npx tsc --noEmit src/app/integration.spec.ts
```

#### Lintチェック

```bash
docker compose exec frontend npx eslint "src/**/*.ts"
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

# 最新100行のログを表示
docker compose logs --tail=100 frontend
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
# node_modulesを削除して再インストール
docker compose exec frontend rm -rf node_modules package-lock.json
docker compose exec frontend npm install
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
docker compose exec frontend npx tsc --noEmit
```

### コードスタイルのチェック

```bash
docker compose exec frontend npx prettier --check "src/**/*.{ts,html,css,scss}"
```

### 自動フォーマット

```bash
docker compose exec frontend npx prettier --write "src/**/*.{ts,html,css,scss}"
```

## ベストプラクティス

1. **コミット前のチェック**
   - TypeScriptの型チェックを実行
   - コードフォーマットを実行
   - テストファイルの構文チェックを実行

2. **テスト駆動開発**
   - 新機能を実装する前にテストを書く
   - テストが失敗することを確認
   - 実装してテストを通す

3. **コードレビュー**
   - 変更内容が要件を満たしているか確認
   - テストが適切に書かれているか確認
   - コードスタイルが統一されているか確認

## 参考リンク

- [Angular公式ドキュメント](https://angular.dev/)
- [ng-zorro-antd公式ドキュメント](https://ng.ant.design/)
- [dhtmlx-gantt公式ドキュメント](https://docs.dhtmlx.com/gantt/)
- [Jasmine公式ドキュメント](https://jasmine.github.io/)
