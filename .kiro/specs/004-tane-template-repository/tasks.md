# TANE テンプレートリポジトリ化 - タスク一覧

## フェーズ1: プロジェクト名の変更とクリーンアップ

### タスク1.1: プロジェクト名の一括置換

**説明**: すべてのファイルで「TAMA」「Tama」「tama」を「TANE」「Tane」「tane」に置換する

**ファイル**:
- [ ] `README.md`
- [ ] `frontend/package.json`
- [ ] `backend/package.json`
- [ ] `docker-compose.yml`
- [ ] `docker-compose.test.yml`（作成時）
- [ ] `docker-compose.prod.yml`（作成時）
- [ ] `.env.example`
- [ ] すべてのコンテナ名（docker-compose.yml内）
- [ ] すべてのドキュメントファイル

**コマンド例**:
```bash
# TAMAをTANEに置換
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" \
  -exec sed -i 's/TAMA/TANE/g' {} +

# tamaをtaneに置換
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" \
  -exec sed -i 's/tama/tane/g' {} +

# Tamaをtaneに置換（キャメルケース）
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" \
  -exec sed -i 's/Tama/Tane/g' {} +
```

**検証**:
```bash
# TAMAが残っていないことを確認
grep -r "TAMA\|Tama\|tama" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist
```

### タスク1.2: Tama固有のコード・ファイルを削除

**説明**: Tamaプロジェクト固有のコード、コンポーネント、機能を削除する

**削除対象**:
- [ ] フロントエンドのTama固有のコンポーネント
- [ ] バックエンドのTama固有のエンドポイント
- [ ] Tama固有のデータベーステーブル定義
- [ ] Tama固有のテストファイル
- [ ] 不要な依存パッケージ

**保持するもの**:
- [ ] Health Checkエンドポイント
- [ ] Swagger設定
- [ ] 基本的なCRUD操作のサンプル（Task）
- [ ] 認証・認可の基本実装（あれば）

### タスク1.3: .gitignoreの見直し

**説明**: .gitignoreファイルを見直し、不要なファイルを追加する

**追加項目**:
```
# 環境変数
.env
.env.local
.env.*.local

# ログ
*.log
logs/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# ビルド成果物
dist/
build/
*.tgz

# テストカバレッジ
coverage/
.nyc_output/

# 一時ファイル
tmp/
temp/
```

## フェーズ2: ドキュメントの整備

### タスク2.1: README.mdの更新

**説明**: テンプレートリポジトリとしてのREADME.mdを作成する

**セクション**:
- [ ] プロジェクト概要（TANEの説明）
- [ ] 技術スタック
- [ ] 機能一覧
- [ ] クイックスタート
- [ ] 環境構築手順
- [ ] 開発ガイド
- [ ] デプロイ方法
- [ ] ライセンス情報

**テンプレート**:
```markdown
# TANE - Template for Angular NestJS Environment

TANEは、Angular 20 + NestJS + PostgreSQLのフルスタックTypeScriptアプリケーションを素早く立ち上げるためのテンプレートリポジトリです。

## 技術スタック

- **フロントエンド**: Angular 20 (Zoneless + Signals)
- **UIライブラリ**: ng-zorro-antd (Ant Design)
- **バックエンド**: NestJS
- **データベース**: PostgreSQL
- **コンテナ**: Docker + Docker Compose
- **言語**: TypeScript

## クイックスタート

1. このテンプレートを使用して新しいリポジトリを作成
2. 初期化スクリプトを実行
3. 開発を開始

詳細は[Getting Started](docs/getting-started.md)を参照してください。
```

### タスク2.2: CONTRIBUTING.mdの作成

**説明**: コントリビューションガイドラインを作成する

**内容**:
- [ ] コントリビューション方法
- [ ] コーディング規約
- [ ] プルリクエストの作成方法
- [ ] イシューの報告方法
- [ ] コミットメッセージの規約

### タスク2.3: CHANGELOG.mdの作成

**説明**: 変更履歴を記録するファイルを作成する

**フォーマット**:
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0] - 2025-XX-XX

### Added
- 初回リリース
- Angular 20 + NestJS + PostgreSQLのテンプレート
- Docker環境
- CI/CD設定
```

### タスク2.4: docs/ディレクトリの作成

**説明**: 詳細ドキュメントを格納するディレクトリを作成する

**ファイル**:
- [ ] `docs/getting-started.md` - 環境構築ガイド
- [ ] `docs/architecture.md` - アーキテクチャ図と説明
- [ ] `docs/deployment.md` - デプロイガイド
- [ ] `docs/development.md` - 開発ガイド
- [ ] `docs/api.md` - API仕様（Swaggerへのリンク）

### タスク2.5: LICENSEファイルの作成

**説明**: ライセンスファイルを作成する

**推奨**: MIT License

## フェーズ3: スクリプトの作成

### タスク3.1: setup.shスクリプトの作成

**説明**: 初期化スクリプトを作成する

**場所**: `scripts/setup.sh`

**機能**:
- [ ] プロジェクト名の入力と置換
- [ ] .envファイルの生成
- [ ] ランダムなシークレットキーの生成
- [ ] データベース接続情報の入力
- [ ] Dockerコンテナの起動
- [ ] 依存パッケージのインストール
- [ ] データベースのマイグレーション
- [ ] ヘルスチェック

**実装**:
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
log_info "========================================="
log_info "TANE 初期化スクリプト"
log_info "========================================="
echo ""

read -p "新しいプロジェクト名を入力してください: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    log_error "プロジェクト名が空です"
    exit 1
fi

# プロジェクト名の置換
log_info "プロジェクト名を置換中..."
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" \
    -exec sed -i "s/TANE/$PROJECT_NAME/g" {} + 2>/dev/null || true
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" \
    -exec sed -i "s/tane/${PROJECT_NAME,,}/g" {} + 2>/dev/null || true

# 環境変数ファイルの生成
log_info "環境変数ファイルを生成中..."
if [ ! -f .env ]; then
    cp .env.example .env
    
    # ランダムなシークレットキーを生成
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/your-secret-key-here/$JWT_SECRET/g" .env
    
    log_info "✅ .envファイルを生成しました"
else
    log_warn ".envファイルは既に存在します。スキップします。"
fi

# Dockerコンテナの起動
log_info "Dockerコンテナを起動中..."
docker compose up -d

# 依存パッケージのインストール
log_info "依存パッケージをインストール中..."
log_info "バックエンド..."
docker compose exec backend npm install
log_info "フロントエンド..."
docker compose exec frontend npm install

# データベースのマイグレーション
log_info "データベースをマイグレーション中..."
docker compose exec backend npm run migration:run || log_warn "マイグレーションに失敗しました（初回起動時は正常です）"

# ヘルスチェック
log_info "ヘルスチェック中..."
sleep 10

MAX_ATTEMPTS=12
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_info "✅ セットアップが完了しました！"
        echo ""
        log_info "========================================="
        log_info "アクセス情報"
        log_info "========================================="
        log_info "フロントエンド: http://localhost:4200"
        log_info "バックエンド: http://localhost:3000"
        log_info "Swagger: http://localhost:3000/api"
        log_info "========================================="
        exit 0
    fi
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        log_error "❌ ヘルスチェックに失敗しました"
        log_error "ログを確認してください: docker compose logs backend"
        exit 1
    fi
    
    log_info "ヘルスチェック試行 $ATTEMPT/$MAX_ATTEMPTS..."
    sleep 5
done
```

**実行権限の付与**:
```bash
chmod +x scripts/setup.sh
```

### タスク3.2: deploy.shスクリプトの作成

**説明**: デプロイスクリプトを作成する（kuraプロジェクトを参考）

**場所**: `scripts/deploy.sh`

**機能**:
- [ ] 環境の検証（prod/test）
- [ ] Gitからの最新コード取得
- [ ] Dockerイメージのビルド
- [ ] コンテナの停止と起動
- [ ] ヘルスチェック
- [ ] ロールバック機能

**実装**: design.mdの実装例を参照

**実行権限の付与**:
```bash
chmod +x scripts/deploy.sh
```

## フェーズ4: Docker設定の整備

### タスク4.1: docker-compose.ymlの更新

**説明**: 開発環境用のdocker-compose.ymlを更新する

**変更点**:
- [ ] コンテナ名をTANEに変更
- [ ] 環境変数を整理
- [ ] ヘルスチェックを追加
- [ ] コメントを追加

**実装**: design.mdの設定例を参照

### タスク4.2: docker-compose.test.ymlの作成

**説明**: テスト環境用のdocker-compose.ymlを作成する

**特徴**:
- [ ] PostgreSQLコンテナなし
- [ ] 外部DBに接続
- [ ] 本番用Dockerfileを使用
- [ ] ヘルスチェック付き

**実装**:
```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile.prod
    container_name: tane-frontend-test
    ports:
      - "80:80"
    environment:
      - NODE_ENV=test
      - API_URL=${API_URL}
      - TZ=Asia/Tokyo
    depends_on:
      - backend
    networks:
      - app-network
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
    container_name: tane-backend-test
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
      - DATABASE_HOST=${DATABASE_HOST}
      - DATABASE_PORT=${DATABASE_PORT}
      - DATABASE_USER=${DATABASE_USER}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
      - DATABASE_NAME=${DATABASE_NAME}
      - TZ=Asia/Tokyo
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  app-network:
    driver: bridge
```

### タスク4.3: docker-compose.prod.ymlの作成

**説明**: 本番環境用のdocker-compose.ymlを作成する

**特徴**:
- [ ] PostgreSQLコンテナなし
- [ ] 外部DBに接続
- [ ] 本番用Dockerfileを使用
- [ ] ヘルスチェック付き
- [ ] リソース制限（オプション）

**実装**: docker-compose.test.ymlとほぼ同じ（NODE_ENV=production）

### タスク4.4: Dockerfile.prodの作成

**説明**: 本番環境用のDockerfileを作成する

**場所**:
- `docker/frontend/Dockerfile.prod`
- `docker/backend/Dockerfile.prod`

**フロントエンド（docker/frontend/Dockerfile.prod）**:
```dockerfile
# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# 実行ステージ
FROM nginx:alpine

COPY --from=builder /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**バックエンド（docker/backend/Dockerfile.prod）**:
```dockerfile
# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 実行ステージ
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### タスク4.5: nginx.confの作成

**説明**: フロントエンド用のNginx設定ファイルを作成する

**場所**: `docker/frontend/nginx.conf`

**実装**:
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name _;

        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # キャッシュ設定
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## フェーズ5: CI/CD設定

### タスク5.1: .github/workflows/ci.ymlの作成

**説明**: ビルド・テスト用のワークフローを作成する

**場所**: `.github/workflows/ci.yml`

**実装**: design.mdの設定例を参照

### タスク5.2: .github/workflows/deploy-test.ymlの作成

**説明**: テスト環境デプロイ用のワークフローを作成する

**場所**: `.github/workflows/deploy-test.yml`

**実装**: kuraプロジェクトの設定を参考

**変更点**:
- [ ] プロジェクト名をTANEに変更
- [ ] シークレット名を更新
- [ ] デプロイパスを更新

### タスク5.3: .github/workflows/deploy-production.ymlの作成

**説明**: 本番環境デプロイ用のワークフローを作成する

**場所**: `.github/workflows/deploy-production.yml`

**実装**: kuraプロジェクトの設定を参考

**変更点**:
- [ ] プロジェクト名をTANEに変更
- [ ] シークレット名を更新
- [ ] デプロイパスを更新
- [ ] タグ名を更新

### タスク5.4: GitHub Secretsの設定手順を記載

**説明**: README.mdまたはdocs/deployment.mdにGitHub Secretsの設定手順を記載する

**必要なSecrets**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `TEST_EC2_INSTANCE_ID`
- `TEST_DEPLOY_PATH`
- `PROD_EC2_INSTANCE_ID`
- `PROD_DEPLOY_PATH`

## フェーズ6: サンプルコードの整理

### タスク6.1: フロントエンドのサンプルコンポーネント整理

**説明**: 最小限のサンプルコンポーネントを残す

**保持するもの**:
- [ ] ホームページ
- [ ] タスク一覧ページ（CRUD操作のサンプル）
- [ ] タスク詳細ページ
- [ ] タスク作成・編集フォーム

**削除するもの**:
- [ ] Tama固有のコンポーネント
- [ ] 不要なページ
- [ ] 不要なサービス

### タスク6.2: バックエンドのサンプルエンドポイント整理

**説明**: 最小限のサンプルエンドポイントを残す

**保持するもの**:
- [ ] Health Checkエンドポイント
- [ ] Taskエンドポイント（CRUD操作のサンプル）
  - GET /tasks
  - GET /tasks/:id
  - POST /tasks
  - PUT /tasks/:id
  - DELETE /tasks/:id

**削除するもの**:
- [ ] Tama固有のエンドポイント
- [ ] 不要なモジュール
- [ ] 不要なサービス

### タスク6.3: データベーススキーマの整理

**説明**: 最小限のテーブル定義を残す

**保持するもの**:
- [ ] tasksテーブル（サンプル）

**削除するもの**:
- [ ] Tama固有のテーブル

### タスク6.4: テストファイルの整理

**説明**: サンプルのテストファイルを整理する

**保持するもの**:
- [ ] Health Checkのテスト
- [ ] Taskエンドポイントのテスト（サンプル）

**削除するもの**:
- [ ] Tama固有のテスト

## フェーズ7: テストと検証

### タスク7.1: 初期化スクリプトのテスト

**説明**: setup.shスクリプトが正常に動作することを確認する

**テスト手順**:
1. [ ] 新しいディレクトリにリポジトリをクローン
2. [ ] `./scripts/setup.sh`を実行
3. [ ] プロジェクト名の置換を確認
4. [ ] .envファイルの生成を確認
5. [ ] Dockerコンテナの起動を確認
6. [ ] ヘルスチェックの成功を確認
7. [ ] フロントエンドへのアクセスを確認
8. [ ] Swaggerへのアクセスを確認

**検証**:
```bash
# 実行時間を測定
time ./scripts/setup.sh

# ヘルスチェック
curl http://localhost:3000/health

# フロントエンドアクセス
curl http://localhost:4200

# Swaggerアクセス
curl http://localhost:3000/api
```

### タスク7.2: デプロイスクリプトのテスト

**説明**: deploy.shスクリプトが正常に動作することを確認する

**テスト手順**:
1. [ ] テスト環境でdeploy.shを実行
2. [ ] ヘルスチェックの成功を確認
3. [ ] ロールバック機能のテスト

### タスク7.3: CI/CDのテスト

**説明**: GitHub Actionsのワークフローが正常に動作することを確認する

**テスト手順**:
1. [ ] developブランチにプッシュしてCIを確認
2. [ ] testブランチにプッシュしてテスト環境デプロイを確認
3. [ ] mainブランチにプッシュして本番環境デプロイを確認

### タスク7.4: ドキュメントのレビュー

**説明**: すべてのドキュメントをレビューする

**チェック項目**:
- [ ] README.mdが分かりやすいか
- [ ] 環境構築手順が正確か
- [ ] デプロイ手順が正確か
- [ ] すべての機能が記載されているか
- [ ] リンク切れがないか

### タスク7.5: 初心者による検証

**説明**: 初心者に実際にセットアップしてもらい、フィードバックを得る

**フィードバック項目**:
- [ ] README.mdの分かりやすさ
- [ ] セットアップの難易度
- [ ] エラーメッセージの分かりやすさ
- [ ] ドキュメントの充実度

## フェーズ8: GitHub Template設定

### タスク8.1: .github/ISSUE_TEMPLATE/の作成

**説明**: イシューテンプレートを作成する

**ファイル**:
- [ ] `.github/ISSUE_TEMPLATE/bug_report.md`
- [ ] `.github/ISSUE_TEMPLATE/feature_request.md`

**bug_report.md**:
```markdown
---
name: バグ報告
about: バグを報告する
title: '[BUG] '
labels: bug
assignees: ''
---

## バグの説明
バグの内容を簡潔に説明してください。

## 再現手順
1. 
2. 
3. 

## 期待される動作
期待される動作を説明してください。

## 実際の動作
実際の動作を説明してください。

## 環境
- OS: 
- Node.js: 
- Docker: 

## スクリーンショット
可能であれば、スクリーンショットを添付してください。
```

**feature_request.md**:
```markdown
---
name: 機能リクエスト
about: 新しい機能を提案する
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 機能の説明
提案する機能を簡潔に説明してください。

## 動機
なぜこの機能が必要なのか説明してください。

## 提案する解決策
どのように実装するか提案してください。

## 代替案
他に考えられる解決策があれば説明してください。
```

### タスク8.2: .github/PULL_REQUEST_TEMPLATE.mdの作成

**説明**: プルリクエストテンプレートを作成する

**実装**:
```markdown
## 変更内容
変更内容を簡潔に説明してください。

## 関連するイシュー
関連するイシューがあれば記載してください。
Closes #

## 変更の種類
- [ ] バグ修正
- [ ] 新機能
- [ ] ドキュメント更新
- [ ] リファクタリング
- [ ] その他

## チェックリスト
- [ ] コードが正常に動作することを確認した
- [ ] テストを追加・更新した
- [ ] ドキュメントを更新した
- [ ] Lintチェックが通ることを確認した
- [ ] 型チェックが通ることを確認した

## スクリーンショット
可能であれば、スクリーンショットを添付してください。
```

### タスク8.3: リポジトリをテンプレートとして設定

**説明**: GitHubリポジトリの設定でテンプレートリポジトリとして有効化する

**手順**:
1. [ ] GitHubリポジトリのSettingsを開く
2. [ ] "Template repository"にチェックを入れる
3. [ ] 変更を保存

**確認**:
- [ ] リポジトリページに"Use this template"ボタンが表示される

### タスク8.4: README.mdにテンプレート使用方法を記載

**説明**: README.mdにテンプレートとしての使用方法を記載する

**セクション**:
```markdown
## このテンプレートの使い方

1. GitHubで「Use this template」ボタンをクリック
2. 新しいリポジトリ名を入力
3. リポジトリをクローン
4. 初期化スクリプトを実行

\`\`\`bash
./scripts/setup.sh
\`\`\`

5. 開発を開始！
```

## 完了条件

すべてのタスクが完了し、以下の条件を満たすこと：

- [ ] プロジェクト名がTANEに変更されている
- [ ] Tama固有のコードが削除されている
- [ ] すべてのドキュメントが整備されている
- [ ] 初期化スクリプトが正常に動作する
- [ ] デプロイスクリプトが正常に動作する
- [ ] CI/CDが正常に動作する
- [ ] GitHubテンプレートリポジトリとして設定されている
- [ ] 初心者がセットアップできることを確認済み
- [ ] すべてのテストが通る

## 推定工数

- フェーズ1: 4時間
- フェーズ2: 8時間
- フェーズ3: 6時間
- フェーズ4: 6時間
- フェーズ5: 4時間
- フェーズ6: 4時間
- フェーズ7: 4時間
- フェーズ8: 2時間

**合計**: 約38時間（5営業日）
