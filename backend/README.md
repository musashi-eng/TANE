# Tama Backend API

NestJS 11を使用したバックエンドAPIサーバー

## 技術スタック

- **フレームワーク**: NestJS 11
- **データベース**: PostgreSQL 17
- **ORM**: TypeORM
- **言語**: TypeScript 5.1+
- **Node.js**: 22

## 機能

- ✅ データベース接続（PostgreSQL）
- ✅ ヘルスチェックエンドポイント
- ✅ CORS設定
- ✅ 環境変数による設定管理

## 開発環境のセットアップ

### 前提条件

- Docker & Docker Compose

### 起動方法

プロジェクトルートで以下のコマンドを実行：

```bash
docker compose up -d
```

バックエンドサーバーは自動的に起動します。

### アクセス

- **API**: http://localhost:3000
- **ヘルスチェック**: http://localhost:3000/health
- **デバッグポート**: 9229

## 環境変数

以下の環境変数を`.env`ファイルで設定できます：

```env
# Node環境
NODE_ENV=development

# データベース接続
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db

# フロントエンドURL（CORS設定用）
FRONTEND_URL=http://localhost:4200

# サーバーポート
PORT=3000
```

## 開発コマンド

Docker環境で実行する場合は、`docker compose exec backend`を先頭に付けてください。

```bash
# 開発サーバー起動（自動起動されます）
docker compose exec backend npm run start:dev

# ビルド
docker compose exec backend npm run build

# テスト実行
docker compose exec backend npm test

# Lint
docker compose exec backend npm run lint

# フォーマット
docker compose exec backend npm run format
```

## プロジェクト構造

```
backend/
├── src/
│   ├── config/           # 設定ファイル
│   │   └── database.config.ts
│   ├── database/         # データベースモジュール
│   │   └── database.module.ts
│   ├── health/           # ヘルスチェック
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── app.module.ts     # ルートモジュール
│   └── main.ts           # エントリーポイント
├── nest-cli.json         # NestJS CLI設定
├── package.json          # 依存パッケージ
├── tsconfig.json         # TypeScript設定
└── README.md
```

## ヘルスチェック

`/health`エンドポイントでアプリケーションとデータベースの健全性を確認できます。

```bash
curl http://localhost:3000/health
```

レスポンス例：

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

## トラブルシューティング

### データベース接続エラー

データベースコンテナが起動しているか確認：

```bash
docker compose ps
```

データベースのログを確認：

```bash
docker compose logs database
```

### ポート競合

ポート3000が既に使用されている場合は、`.env`ファイルで`PORT`を変更してください。

## ライセンス

UNLICENSED
