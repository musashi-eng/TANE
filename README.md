# TANE - Template for Angular NestJS Environment

**TANE**は、Angular 20 + NestJS + PostgreSQLのフルスタックTypeScriptアプリケーションを素早く立ち上げるためのテンプレートリポジトリです。

プロジェクトの「種（たね）」という意味を込めて、新しいプロジェクトの出発点として使用できます。

## 🚀 技術スタック

### フロントエンド
- **Angular 20** - Zoneless + Signals アーキテクチャ
- **ng-zorro-antd** - Ant Design UIコンポーネント
- **TypeScript 5.8** - 型安全な開発
- **RxJS 7** - リアクティブプログラミング

### バックエンド
- **NestJS 11** - スケーラブルなNode.jsフレームワーク
- **TypeORM** - TypeScript ORM
- **Swagger/OpenAPI** - API ドキュメント自動生成
- **class-validator** - バリデーション

### データベース
- **PostgreSQL 17** - リレーショナルデータベース
- **日本語ロケール対応** - Asia/Tokyoタイムゾーン

### インフラ
- **Docker + Docker Compose** - コンテナ化
- **GitHub Actions** - CI/CD
- **AWS SSM** - デプロイ自動化

## ✨ 機能

- ✅ Zoneless + Signals による高速なAngular 20
- ✅ NestJS 11 による堅牢なバックエンド
- ✅ Swagger UIによるインタラクティブなAPIドキュメント
- ✅ Docker環境による簡単なセットアップ
- ✅ 環境別設定（開発・テスト・本番）
- ✅ GitHub Actionsによる自動CI/CD
- ✅ ヘルスチェック機能
- ✅ 日本語ドキュメント

## 🎯 このテンプレートの使い方

### 1. テンプレートからリポジトリを作成

GitHubで「**Use this template**」ボタンをクリックして、新しいリポジトリを作成します。

### 2. リポジトリをクローン

```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

### 3. 初期化スクリプトを実行

```bash
./scripts/setup.sh
```

このスクリプトは以下を自動的に実行します：
- プロジェクト名の置換
- 環境変数ファイル（.env）の生成
- JWT_SECRETの自動生成
- Dockerコンテナの起動
- 依存パッケージのインストール
- データベースのマイグレーション
- ヘルスチェック

### 4. 開発を開始！

セットアップが完了したら、以下のURLにアクセスできます：

- **フロントエンド**: http://localhost:4200
- **バックエンド**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432

## 📦 環境構築（手動）

初期化スクリプトを使わない場合は、以下の手順で環境を構築できます。

### 前提条件

- Docker Desktop
- Node.js 22以上（ローカル開発の場合）
- Git

### セットアップ手順

1. **環境変数ファイルを作成**

```bash
cp .env.example .env
```

2. **Dockerコンテナを起動**

```bash
docker compose up -d
```

3. **依存パッケージをインストール**

```bash
# バックエンド
docker compose exec backend npm install

# フロントエンド
docker compose exec frontend npm install
```

4. **データベースのマイグレーション**

```bash
docker compose exec backend npm run migration:run
```

5. **ヘルスチェック**

```bash
curl http://localhost:3000/health
```

## 🛠️ 開発

### よく使うコマンド

```bash
# コンテナの起動
docker compose up -d

# コンテナの停止
docker compose down

# ログの確認
docker compose logs -f

# バックエンドのテスト
docker compose exec backend npm test

# フロントエンドのビルド
docker compose exec frontend npm run build

# Lintチェック
docker compose exec backend npm run lint
docker compose exec frontend npm run lint

# 型チェック
docker compose exec backend npx tsc --noEmit
docker compose exec frontend npx tsc --noEmit
```

### ディレクトリ構造

```
.
├── .github/              # GitHub Actions ワークフロー
├── backend/              # NestJS バックエンド
│   └── src/
│       ├── config/       # 設定ファイル
│       ├── database/     # データベース関連
│       ├── health/       # ヘルスチェック
│       └── swagger/      # Swagger設定
├── frontend/             # Angular フロントエンド
│   └── src/
│       └── app/
│           ├── core/     # コアモジュール
│           ├── features/ # 機能モジュール
│           └── shared/   # 共有モジュール
├── docker/               # Dockerファイル
│   ├── backend/
│   ├── frontend/
│   └── postgres/
├── scripts/              # スクリプト
│   ├── setup.sh          # 初期化スクリプト
│   └── deploy.sh         # デプロイスクリプト
└── docs/                 # ドキュメント
```

## 🚢 デプロイ

### テスト環境

```bash
./scripts/deploy.sh test
```

### 本番環境

```bash
./scripts/deploy.sh prod
```

### GitHub Actionsによる自動デプロイ

- **testブランチ**にプッシュ → テスト環境に自動デプロイ
- **mainブランチ**にプッシュ → 本番環境に自動デプロイ

詳細は[デプロイガイド](docs/deployment.md)を参照してください。

## 📚 ドキュメント

- [環境構築ガイド](docs/getting-started.md)
- [アーキテクチャ](docs/architecture.md)
- [デプロイガイド](docs/deployment.md)
- [開発ガイド](docs/development.md)
- [コントリビューションガイド](CONTRIBUTING.md)

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください。

## 📝 ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 🙏 謝辞

このテンプレートは、以下のオープンソースプロジェクトを使用しています：

- [Angular](https://angular.dev/)
- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [ng-zorro-antd](https://ng.ant.design/)
- [Docker](https://www.docker.com/)

## 📞 サポート

問題が発生した場合は、[イシュー](https://github.com/your-username/your-project-name/issues)を作成してください。
