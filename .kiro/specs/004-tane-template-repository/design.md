# TANE テンプレートリポジトリ化 - 設計書

## アーキテクチャ概要

TANEは、Angular 20 + NestJS + PostgreSQLのフルスタックTypeScriptアプリケーションを素早く立ち上げるためのテンプレートリポジトリです。

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    TANE Template Repository                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Frontend    │  │   Backend    │  │  PostgreSQL  │      │
│  │  (Angular 20)│  │   (NestJS)   │  │  (Dev Only)  │      │
│  │              │  │              │  │              │      │
│  │  - Zoneless  │  │  - TypeORM   │  │  - Docker    │      │
│  │  - Signals   │  │  - Swagger   │  │  - Volume    │      │
│  │  - ng-zorro  │  │  - Health    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                      Docker Network                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 環境別構成

#### 開発環境（docker-compose.yml）
- フロントエンド（Angular）
- バックエンド（NestJS）
- PostgreSQL（Dockerコンテナ）

#### テスト・本番環境（docker-compose.test.yml / docker-compose.prod.yml）
- フロントエンド（Angular）
- バックエンド（NestJS）
- PostgreSQL（外部DB、.envで接続）

## コンポーネント設計

### 1. プロジェクト構造

```
tane/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # ビルド・テスト
│   │   ├── deploy-test.yml           # テスト環境デプロイ
│   │   └── deploy-production.yml     # 本番環境デプロイ
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── .kiro/
│   ├── settings/
│   └── steering/
│       ├── angular-guidelines.md
│       ├── development-guide.md
│       ├── project-conventions.md
│       └── swagger-guidelines.md
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── config/
│   │   ├── database/
│   │   ├── health/
│   │   └── swagger/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── core/
│   │   │   ├── features/
│   │   │   └── shared/
│   │   └── main.ts
│   └── package.json
├── docker/
│   ├── backend/
│   │   ├── Dockerfile              # 開発環境用
│   │   ├── Dockerfile.prod         # 本番環境用
│   │   └── .dockerignore
│   ├── frontend/
│   │   ├── Dockerfile              # 開発環境用
│   │   ├── Dockerfile.prod         # 本番環境用
│   │   └── .dockerignore
│   └── postgres/
│       ├── Dockerfile              # カスタムPostgreSQLイメージ
│       └── init/
│           ├── 00-set-timezone.sh  # タイムゾーン設定
│           └── 01-init.sql         # 初期化SQL
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   └── getting-started.md
├── scripts/
│   ├── setup.sh                      # 初期化スクリプト
│   └── deploy.sh                     # デプロイスクリプト
├── .env.example
├── .gitignore
├── docker-compose.yml                # 開発環境
├── docker-compose.test.yml           # テスト環境
├── docker-compose.prod.yml           # 本番環境
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

### 2. 初期化スクリプト（setup.sh）

#### 機能

1. **プロジェクト名の置換**
   - ユーザーに新しいプロジェクト名を入力させる
   - すべてのファイルで「TANE」を新しい名前に置換
   - package.json、docker-compose.yml、README.mdなどを更新

2. **環境変数ファイルの生成**
   - .env.exampleから.envを生成
   - ランダムなシークレットキーを生成
   - データベース接続情報の入力を促す

3. **依存パッケージのインストール**
   - フロントエンドとバックエンドのnpm install
   - Dockerコンテナ内で実行

4. **データベースの初期化**
   - PostgreSQLコンテナの起動
   - マイグレーションの実行
   - 初期データの投入（オプション）

5. **動作確認**
   - ヘルスチェックエンドポイントの確認
   - フロントエンドの起動確認

#### 実装例

```bash
#!/bin/bash

set -e

# 色付きログ
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# プロジェクト名の入力
read -p "新しいプロジェクト名を入力してください: " PROJECT_NAME

# プロジェクト名の検証
if [ -z "$PROJECT_NAME" ]; then
    log_error "プロジェクト名が空です"
    exit 1
fi

# プロジェクト名の置換
log_info "プロジェクト名を置換中..."
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" \
    -exec sed -i "s/TANE/$PROJECT_NAME/g" {} +
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" \
    -exec sed -i "s/tane/${PROJECT_NAME,,}/g" {} +

# 環境変数ファイルの生成
log_info "環境変数ファイルを生成中..."
cp .env.example .env

# ランダムなシークレットキーを生成
JWT_SECRET=$(openssl rand -base64 32)
sed -i "s/your-secret-key-here/$JWT_SECRET/g" .env

# データベース接続情報の入力
read -p "データベースホスト [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}
sed -i "s/DB_HOST=.*/DB_HOST=$DB_HOST/g" .env

# Dockerコンテナの起動
log_info "Dockerコンテナを起動中..."
docker compose up -d

# 依存パッケージのインストール
log_info "依存パッケージをインストール中..."
docker compose exec backend npm install
docker compose exec frontend npm install

# データベースのマイグレーション
log_info "データベースをマイグレーション中..."
docker compose exec backend npm run migration:run

# ヘルスチェック
log_info "ヘルスチェック中..."
sleep 5
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    log_info "✅ セットアップが完了しました！"
    log_info "フロントエンド: http://localhost:4200"
    log_info "バックエンド: http://localhost:3000"
    log_info "Swagger: http://localhost:3000/api"
else
    log_error "❌ ヘルスチェックに失敗しました"
    exit 1
fi
```

### 3. デプロイスクリプト（deploy.sh）

#### 機能

1. **環境の検証**
   - 引数で環境（prod/test）を指定
   - 環境変数ファイルの存在確認

2. **Gitからの最新コード取得**
   - git pull で最新コードを取得

3. **Dockerイメージのビルド**
   - キャッシュなしでビルド
   - 環境別のDockerfileを使用

4. **コンテナの起動**
   - 既存コンテナの停止
   - 新しいコンテナの起動

5. **ヘルスチェック**
   - 最大180秒待機
   - ヘルスチェックエンドポイントの確認

6. **ロールバック**
   - ヘルスチェック失敗時に自動ロールバック
   - 前のイメージに戻す

#### 実装例（kuraプロジェクトを参考）

```bash
#!/bin/bash

set -e

# 環境の検証
ENVIRONMENT=$1
if [ "$ENVIRONMENT" != "prod" ] && [ "$ENVIRONMENT" != "test" ]; then
    log_error "無効な環境: $ENVIRONMENT"
    exit 1
fi

# Docker Composeファイルの選択
if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.test.yml"
fi

# Gitから最新コードを取得
log_info "最新コードを取得中..."
git pull origin $(git branch --show-current)

# 既存のコンテナを停止
log_info "既存のコンテナを停止中..."
docker compose -f "$COMPOSE_FILE" down

# Dockerイメージをビルド
log_info "Dockerイメージをビルド中..."
docker compose -f "$COMPOSE_FILE" build --no-cache

# 新しいコンテナを起動
log_info "新しいコンテナを起動中..."
docker compose -f "$COMPOSE_FILE" up -d

# ヘルスチェック
log_info "ヘルスチェック中..."
MAX_ATTEMPTS=36
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_info "✅ デプロイが完了しました！"
        exit 0
    fi
    
    sleep 5
done

log_error "❌ ヘルスチェックに失敗しました"
exit 1
```

### 4. Docker設定

#### 開発環境（docker-compose.yml）

```yaml
services:
  # Frontend Container - Angular 20
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile
    container_name: tane-frontend
    ports:
      - "4200:4200"
    volumes:
      - ./frontend:/app
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - API_URL=${API_URL:-http://backend:3000}
      - TZ=${TZ:-Asia/Tokyo}
    networks:
      - app-network
    restart: unless-stopped
    depends_on:
      - backend

  # Backend Container - NestJS
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile
    container_name: tane-backend
    ports:
      - "3000:3000"
      - "9229:9229"  # デバッグポート
    volumes:
      - ./backend:/app
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - DATABASE_HOST=${DATABASE_HOST:-database}
      - DATABASE_PORT=${DATABASE_PORT:-5432}
      - DATABASE_USER=${DATABASE_USER:-postgres}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD:-postgres}
      - DATABASE_NAME=${DATABASE_NAME:-app_db}
      - TZ=${TZ:-Asia/Tokyo}
    networks:
      - app-network
    restart: unless-stopped
    depends_on:
      database:
        condition: service_healthy

  # Database Container - PostgreSQL
  database:
    build:
      context: ./docker/postgres
      dockerfile: Dockerfile
    container_name: tane-database
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docker/postgres/init:/docker-entrypoint-initdb.d
    environment:
      - POSTGRES_USER=${DATABASE_USER:-postgres}
      - POSTGRES_PASSWORD=${DATABASE_PASSWORD:-postgres}
      - POSTGRES_DB=${DATABASE_NAME:-app_db}
      - POSTGRES_INITDB_ARGS=--encoding=UTF8 --lc-collate=C --lc-ctype=C
      - TZ=${TZ:-Asia/Tokyo}
      - PGTZ=${TZ:-Asia/Tokyo}
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USER:-postgres}"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
```

#### テスト・本番環境（docker-compose.test.yml / docker-compose.prod.yml）

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile.prod
    container_name: tane-frontend-prod
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - tane-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.prod
    container_name: tane-backend-prod
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    networks:
      - tane-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  tane-network:
    driver: bridge
```

### 5. CI/CD設定

#### ビルド・テスト（.github/workflows/ci.yml）

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  frontend:
    name: フロントエンドのビルド・テスト
    runs-on: ubuntu-latest
    
    steps:
      - name: コードをチェックアウト
        uses: actions/checkout@v4
      
      - name: Node.jsをセットアップ
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: 依存パッケージをインストール
        working-directory: frontend
        run: npm ci
      
      - name: Lintチェック
        working-directory: frontend
        run: npm run lint
      
      - name: 型チェック
        working-directory: frontend
        run: npx tsc --noEmit
      
      - name: ビルド
        working-directory: frontend
        run: npm run build

  backend:
    name: バックエンドのビルド・テスト
    runs-on: ubuntu-latest
    
    steps:
      - name: コードをチェックアウト
        uses: actions/checkout@v4
      
      - name: Node.jsをセットアップ
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: 依存パッケージをインストール
        working-directory: backend
        run: npm ci
      
      - name: Lintチェック
        working-directory: backend
        run: npm run lint
      
      - name: 型チェック
        working-directory: backend
        run: npx tsc --noEmit
      
      - name: テスト
        working-directory: backend
        run: npm test
      
      - name: ビルド
        working-directory: backend
        run: npm run build
```

#### テスト環境デプロイ（.github/workflows/deploy-test.yml）

kuraプロジェクトの設定を参考に、AWS SSMを使用したデプロイを実装。

#### 本番環境デプロイ（.github/workflows/deploy-production.yml）

kuraプロジェクトの設定を参考に、AWS SSMを使用したデプロイとGitタグの作成を実装。

### 6. 環境変数設定

#### .env.example

```bash
# プロジェクト設定
PROJECT_NAME=TANE
NODE_ENV=development

# タイムゾーン設定
TZ=Asia/Tokyo

# データベース設定（開発環境）
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db

# データベース設定（テスト・本番環境）
# DATABASE_HOST=your-external-db-host
# DATABASE_PORT=5432
# DATABASE_USER=your-db-user
# DATABASE_PASSWORD=your-db-password
# DATABASE_NAME=your-db-name

# JWT設定
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d

# API設定
API_URL=http://backend:3000

# Swagger設定（開発環境のみ）
SWAGGER_ENABLED=true
SWAGGER_TITLE=TANE API
SWAGGER_DESCRIPTION=TANE API Documentation
SWAGGER_VERSION=1.0
```

### 7. ヘルスチェックエンドポイント

#### バックエンド（backend/src/health/health.controller.ts）

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ 
    summary: 'ヘルスチェック',
    description: 'アプリケーションとデータベースの状態を確認します'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'ヘルスチェック成功'
  })
  @ApiResponse({ 
    status: 503, 
    description: 'サービス利用不可'
  })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

### 8. サンプルコード

#### 最小限のCRUDサンプル

フロントエンドとバックエンドで、基本的なCRUD操作のサンプルを提供：

- **エンティティ**: Task（タスク）
- **操作**: 作成、読み取り、更新、削除
- **機能**: 
  - リスト表示
  - 詳細表示
  - 作成フォーム
  - 編集フォーム
  - 削除確認

## 正確性プロパティ

### プロパティ1: プロジェクト名の完全置換

*任意の*ファイルについて、そのファイルに「TAMA」「Tama」「tama」が含まれる場合、setup.shスクリプト実行後にすべて新しいプロジェクト名に置換されるべきである

**検証方法**:
```bash
# TAMAが残っていないことを確認
grep -r "TAMA\|Tama\|tama" . --exclude-dir=node_modules --exclude-dir=.git
```

### プロパティ2: 環境別のDB設定

*任意の*環境について、その環境が開発環境の場合はPostgreSQLコンテナを使用し、テスト・本番環境の場合は外部DBを使用するべきである

**検証方法**:
- docker-compose.yml にはpostgresサービスが存在する
- docker-compose.test.yml にはpostgresサービスが存在しない
- docker-compose.prod.yml にはpostgresサービスが存在しない

### プロパティ3: ヘルスチェックの成功

*任意の*デプロイについて、そのデプロイが成功した場合、ヘルスチェックエンドポイントが200を返すべきである

**検証方法**:
```bash
curl -f http://localhost:3000/health
# ステータスコード200を返すこと
```

### プロパティ4: 初期化スクリプトの完了時間

*任意の*初期化について、そのsetup.shスクリプトの実行時間は5分以内であるべきである

**検証方法**:
```bash
time ./scripts/setup.sh
# 実行時間が5分以内であること
```

### プロパティ5: CI/CDの自動実行

*任意の*プッシュについて、そのプッシュがmainブランチへの場合、CI/CDワークフローが自動実行されるべきである

**検証方法**:
- GitHub Actionsのワークフローが実行される
- すべてのジョブが成功する

### プロパティ6: ドキュメントの完全性

*任意の*機能について、その機能がREADME.mdまたはdocs/ディレクトリに記載されているべきである

**検証方法**:
- README.mdに機能一覧が記載されている
- docs/ディレクトリに詳細ドキュメントが存在する

### プロパティ7: テンプレートリポジトリとしての使用可能性

*任意の*ユーザーについて、そのユーザーがGitHubでテンプレートリポジトリとして使用できるべきである

**検証方法**:
- GitHubリポジトリ設定で「Template repository」が有効
- 「Use this template」ボタンが表示される

## 実装タスク

### フェーズ1: プロジェクト名の変更とクリーンアップ

1. プロジェクト名を「TAMA」から「TANE」に変更
2. Tama固有のコード・ファイルを削除
3. .gitignoreの見直し

### フェーズ2: ドキュメントの整備

1. README.mdの更新
2. CONTRIBUTING.mdの作成
3. CHANGELOG.mdの作成
4. docs/ディレクトリの作成
5. アーキテクチャ図の追加

### フェーズ3: スクリプトの作成

1. setup.shスクリプトの作成
2. deploy.shスクリプトの作成
3. スクリプトのテスト

### フェーズ4: Docker設定の整備

1. docker-compose.ymlの更新（開発環境）
2. docker-compose.test.ymlの作成（テスト環境）
3. docker-compose.prod.ymlの作成（本番環境）
4. Dockerfile.prodの作成

### フェーズ5: CI/CD設定

1. .github/workflows/ci.ymlの作成
2. .github/workflows/deploy-test.ymlの作成
3. .github/workflows/deploy-production.ymlの作成
4. GitHub Secretsの設定手順を記載

### フェーズ6: サンプルコードの整理

1. フロントエンドのサンプルコンポーネントを最小限に
2. バックエンドのサンプルエンドポイントを最小限に
3. 基本的なCRUD操作のサンプルを残す

### フェーズ7: テストと検証

1. 初期化スクリプトのテスト
2. デプロイスクリプトのテスト
3. CI/CDのテスト
4. ドキュメントのレビュー

### フェーズ8: GitHub Template設定

1. .github/ISSUE_TEMPLATE/の作成
2. .github/PULL_REQUEST_TEMPLATE.mdの作成
3. リポジトリをテンプレートとして設定

## 依存関係

- フェーズ1が完了してから、フェーズ2〜6を並行実行可能
- フェーズ7はすべてのフェーズが完了してから実行
- フェーズ8は最後に実行

## リスクと対策

### リスク1: プロジェクト名の置換漏れ

**対策**: 
- 正規表現で徹底的に検索
- 手動レビューを実施

### リスク2: 環境別のDB設定ミス

**対策**:
- 各環境でテストを実施
- ヘルスチェックで接続確認

### リスク3: CI/CDの設定ミス

**対策**:
- テスト環境で先に検証
- ロールバック手順を用意

### リスク4: ドキュメントの不足

**対策**:
- 初心者にレビューを依頼
- 実際にセットアップしてもらう

## 成功の測定

1. **セットアップ時間**: 10分以内
2. **初期化スクリプトの成功率**: 100%
3. **CI/CDの成功率**: 95%以上
4. **ドキュメントの完全性**: すべての機能が記載されている
5. **テンプレートとしての使用可能性**: GitHubで「Use this template」が使える
