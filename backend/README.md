# Tane Backend API

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
- ✅ Swagger/OpenAPI ドキュメント（開発環境のみ）

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
- **Swagger UI**: http://localhost:3000/api（開発環境のみ）
- **OpenAPI JSON**: http://localhost:3000/api-json（開発環境のみ）
- **デバッグポート**: 9229

## 環境変数

以下の環境変数を`.env`ファイルで設定できます：

```env
# Node環境
# development: Swaggerが有効化されます
# production: Swaggerが無効化されます
NODE_ENV=development

# データベース接続
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db

# フロントエンドURL（CORS設定用）
FRONTEND_URL=http://localhost:4200

# サーバーポート
PORT=3000
```

### 環境別の動作

- **開発環境（NODE_ENV=development）**:
  - Swagger UIが有効化されます
  - `/api`でSwagger UIにアクセス可能
  - `/api-json`でOpenAPI仕様JSONを取得可能

- **本番環境（NODE_ENV=production）**:
  - Swaggerは完全に無効化されます
  - `/api`と`/api-json`は404を返します
  - セキュリティリスクを回避

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

## Swagger/OpenAPI ドキュメント

開発環境では、Swagger UIを使用してAPIドキュメントを確認し、インタラクティブにAPIをテストできます。

### アクセス方法

開発環境でアプリケーションを起動後、以下のURLにアクセスできます：

- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

### Swagger UIの使い方

1. ブラウザで http://localhost:3000/api を開く
2. エンドポイント一覧が表示されます
3. 各エンドポイントをクリックして詳細を確認
4. 「Try it out」ボタンでAPIを直接テスト可能

### 機能

- **自動ドキュメント生成**: コードから自動的にAPIドキュメントを生成
- **インタラクティブテスト**: Swagger UIから直接APIをテスト
- **OpenAPI 3.0準拠**: 標準仕様に準拠したAPI定義
- **リクエスト/レスポンス例**: 各エンドポイントの使用例を表示
- **バリデーションルール**: 入力値の制約を明示

### 環境別の動作

- **開発環境**: Swaggerが有効（NODE_ENV=development）
- **本番環境**: Swaggerが無効（NODE_ENV=production）

本番環境では、セキュリティのためSwaggerは完全に無効化されます。

### APIドキュメントの更新

新しいエンドポイントやDTOを追加する際は、以下のデコレーターを使用してドキュメント化してください：

```typescript
// コントローラー
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  @Get()
  @ApiOperation({ summary: 'タスク一覧取得' })
  @ApiResponse({ status: 200, description: '成功', type: [TaskDto] })
  findAll() {
    // 実装
  }
}

// DTO
export class CreateTaskDto {
  @ApiProperty({
    description: 'タスク名',
    example: 'プロジェクト計画書の作成',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

詳細は `.kiro/steering/swagger-guidelines.md` を参照してください。

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
