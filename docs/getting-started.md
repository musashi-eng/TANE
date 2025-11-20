# 環境構築ガイド

このガイドでは、TANEプロジェクトの環境構築方法を説明します。

## 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Docker Desktop** 4.0以上
- **Git** 2.0以上
- **Node.js** 22以上（ローカル開発の場合）

## クイックスタート

### 1. リポジトリをクローン

```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

### 2. 初期化スクリプトを実行

```bash
./scripts/setup.sh
```

このスクリプトは以下を自動的に実行します：

1. プロジェクト名の入力と置換
2. 環境変数ファイル（.env）の生成
3. JWT_SECRETの自動生成
4. Dockerコンテナの起動
5. 依存パッケージのインストール
6. データベースのマイグレーション
7. ヘルスチェック

### 3. アクセス確認

セットアップが完了したら、以下のURLにアクセスできます：

- **フロントエンド**: http://localhost:4200
- **バックエンド**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432

## 手動セットアップ

初期化スクリプトを使わない場合は、以下の手順で環境を構築できます。

### 1. 環境変数ファイルを作成

```bash
cp .env.example .env
```

`.env`ファイルを編集して、必要な環境変数を設定します：

```bash
# プロジェクト設定
PROJECT_NAME=your-project-name
NODE_ENV=development

# タイムゾーン設定
TZ=Asia/Tokyo

# データベース設定（開発環境）
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db

# JWT設定
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d

# API設定
API_URL=http://backend:3000

# Swagger設定（開発環境のみ）
SWAGGER_ENABLED=true
SWAGGER_TITLE=Your Project API
SWAGGER_DESCRIPTION=Your Project API Documentation
SWAGGER_VERSION=1.0
```

### 2. Dockerコンテナを起動

```bash
docker compose up -d
```

### 3. 依存パッケージをインストール

```bash
# バックエンド
docker compose exec backend npm install

# フロントエンド
docker compose exec frontend npm install
```

### 4. データベースのマイグレーション

```bash
docker compose exec backend npm run migration:run
```

### 5. ヘルスチェック

```bash
curl http://localhost:3000/health
```

正常に動作している場合、以下のようなレスポンスが返ります：

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

## トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のポートを確認
lsof -i :4200
lsof -i :3000
lsof -i :5432

# コンテナを再起動
docker compose restart
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

### データベース接続エラー

```bash
# データベースコンテナのログを確認
docker compose logs database

# データベースコンテナの状態を確認
docker compose ps database

# データベースに直接接続して確認
docker compose exec database psql -U postgres -d app_db
```

## 次のステップ

環境構築が完了したら、以下のドキュメントを参照してください：

- [開発ガイド](development.md) - 開発方法とよく使うコマンド
- [アーキテクチャ](architecture.md) - プロジェクトの構造と設計
- [デプロイガイド](deployment.md) - デプロイ方法
