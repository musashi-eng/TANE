# TAMA プロジェクト

Angular 20、NestJS 11、PostgreSQL 17を使用したコンテナベースのアプリケーション基盤です。

## プロジェクト概要

このプロジェクトは、Docker Composeを使用して3層アーキテクチャ（フロントエンド、バックエンド、データベース）を提供します。

### 技術スタック

- **フロントエンド**: Angular 20 (Zoneless + Signals)
- **バックエンド**: NestJS 11
- **データベース**: PostgreSQL 17
- **開発環境**: Docker Compose
- **言語**: TypeScript 5.8+

### Angular 20の特徴

このプロジェクトは、Angular 20の最新機能を採用しています：

- ✨ **Zonelessモード**: Zone.jsを使用せず、パフォーマンスを最適化
- 🎯 **Signalsベース**: 状態管理にSignalsを使用し、細かい粒度の変更検知
- 🚀 **スタンドアロンコンポーネント**: NgModuleを使用しない新しいアーキテクチャ
- 📝 **新しい制御フロー構文**: `@if`, `@for`, `@switch`を使用
- 📦 **バンドルサイズ削減**: Zone.jsの削除により約50KB削減

## クイックスタート

### 前提条件

- Docker Desktop がインストールされていること
- Git がインストールされていること

### 環境構築

1. リポジトリをクローン

```bash
git clone <repository-url>
cd TAMA.new
```

2. 環境変数ファイルを作成

```bash
cp .env.example .env
```

3. コンテナを起動

```bash
docker compose up -d
```

4. アプリケーションにアクセス

- フロントエンド: http://localhost:4200
- バックエンド: http://localhost:3000
- データベース: localhost:5432

### コンテナの管理

```bash
# コンテナの起動
docker compose up -d

# コンテナの停止
docker compose down

# コンテナの状態確認
docker compose ps

# ログの確認
docker compose logs -f

# 特定のサービスのログを確認
docker compose logs -f frontend
```

## 開発ガイド

### フロントエンド開発

フロントエンドはAngular 20を使用しています。

```bash
# コンテナ内でコマンドを実行
docker compose exec frontend npm install
docker compose exec frontend npm run build

# TypeScriptの型チェック
docker compose exec frontend npx tsc --noEmit
```

詳細は[開発ガイド](.kiro/steering/development-guide.md)を参照してください。

### Angular開発ガイドライン

このプロジェクトでは、Zoneless + Signalsアーキテクチャを採用しています。

詳細なガイドラインは[Angularガイドライン](.kiro/steering/angular-guidelines.md)を参照してください。

**重要なポイント:**

- 状態管理には必ずSignalsを使用する
- Zone.jsは使用しない
- 新しい制御フロー構文（`@if`, `@for`, `@switch`）を使用する
- テンプレートでSignalを使用する際は`()`を付けて呼び出す

### バックエンド開発

バックエンドはNestJS 11を使用しています。

```bash
# コンテナ内でコマンドを実行
docker compose exec backend npm install
docker compose exec backend npm run build
```

### データベース

PostgreSQL 17を使用しています。

```bash
# データベースに接続
docker compose exec database psql -U postgres -d app_db

# データベースのバックアップ
docker compose exec database pg_dump -U postgres app_db > backup.sql
```

## プロジェクト構造

```
TAMA.new/
├── .kiro/                      # Kiro設定ファイル
│   ├── specs/                  # 仕様書
│   └── steering/               # 開発ガイドライン
├── docker/                     # Docker関連ファイル
│   ├── frontend/               # Frontend用Dockerfile
│   ├── backend/                # Backend用Dockerfile
│   └── postgres/               # PostgreSQL設定
├── frontend/                   # Angularソースコード
│   ├── src/
│   ├── angular.json
│   └── package.json
├── backend/                    # NestJSソースコード
│   ├── src/
│   └── package.json
├── tests/                      # テストファイル
│   └── property-tests/         # プロパティベーステスト
├── docker-compose.yml          # Docker Compose設定
├── .env                        # 環境変数（gitignore対象）
└── .env.example                # 環境変数のサンプル
```

## テスト

### プロパティベーステスト

```bash
# すべてのプロパティテストを実行
./tests/property-tests/test-*.sh

# 特定のテストを実行
./tests/property-tests/test-docker-compose-services.sh
```

### フロントエンドのテスト

```bash
# 単体テストの実行
docker compose exec frontend npm test

# TypeScriptの型チェック
docker compose exec frontend npx tsc --noEmit
```

## トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のプロセスを確認
lsof -i :4200
lsof -i :3000
lsof -i :5432

# コンテナを再起動
docker compose restart
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

## ドキュメント

- [要件定義書](.kiro/specs/001-docker-infrastructure/requirements.md)
- [設計書](.kiro/specs/001-docker-infrastructure/design.md)
- [実装計画](.kiro/specs/001-docker-infrastructure/tasks.md)
- [開発ガイド](.kiro/steering/development-guide.md)
- [Angularガイドライン](.kiro/steering/angular-guidelines.md)
- [プロジェクト規約](.kiro/steering/project-conventions.md)

## 参考リンク

- [Angular公式ドキュメント](https://angular.dev/)
- [NestJS公式ドキュメント](https://nestjs.com/)
- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/)
- [Docker公式ドキュメント](https://docs.docker.com/)

## ライセンス

このプロジェクトは私的利用のためのものです。
