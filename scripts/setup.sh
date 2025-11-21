#!/bin/bash

# TANE 初期化スクリプト
# 使用方法: ./scripts/setup.sh

set -e

# 色付きログ出力用
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ出力関数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# ヘッダー表示
echo ""
echo "========================================="
echo "  TANE 初期化スクリプト"
echo "  Template for Angular NestJS Environment"
echo "========================================="
echo ""

# プロジェクト名の入力
log_step "プロジェクト名の設定"
read -p "新しいプロジェクト名を入力してください (例: my-project): " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    log_error "プロジェクト名が空です"
    exit 1
fi

# プロジェクト名の検証（英数字とハイフンのみ）
if ! [[ "$PROJECT_NAME" =~ ^[a-zA-Z0-9-]+$ ]]; then
    log_error "プロジェクト名は英数字とハイフン(-)のみ使用できます"
    exit 1
fi

log_info "プロジェクト名: $PROJECT_NAME"
echo ""

# プロジェクト名の置換
log_step "プロジェクト名を置換中..."
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.angular/*" -not -path "*/coverage/*" -not -path "*/.kiro/specs/*" -not -path "*/scripts/setup.sh" \
    -exec sed -i "s/TANE/$PROJECT_NAME/g" {} \; 2>/dev/null || true
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.angular/*" -not -path "*/coverage/*" -not -path "*/.kiro/specs/*" -not -path "*/scripts/setup.sh" \
    -exec sed -i "s/tane/${PROJECT_NAME,,}/g" {} \; 2>/dev/null || true
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.angular/*" -not -path "*/coverage/*" -not -path "*/.kiro/specs/*" -not -path "*/scripts/setup.sh" \
    -exec sed -i "s/Tane/${PROJECT_NAME^}/g" {} \; 2>/dev/null || true

log_info "✅ プロジェクト名の置換が完了しました"
echo ""

# 環境変数ファイルの生成
log_step "環境変数ファイルの生成"
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        
        # ランダムなシークレットキーを生成
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i "s|your-secret-key-here|$JWT_SECRET|g" .env
        
        log_info "✅ .envファイルを生成しました"
        log_info "JWT_SECRETを自動生成しました"
    else
        log_warn ".env.exampleが見つかりません。.envファイルを手動で作成してください。"
    fi
else
    log_warn ".envファイルは既に存在します。スキップします。"
fi
echo ""

# Dockerコンテナの起動
log_step "Dockerコンテナを起動中..."
if ! docker compose up -d; then
    log_error "Dockerコンテナの起動に失敗しました"
    log_error "Docker Desktopが起動しているか確認してください"
    exit 1
fi
log_info "✅ Dockerコンテナを起動しました"
echo ""

# コンテナの起動を待つ
log_info "コンテナの起動を待っています..."
sleep 5

# 依存パッケージのインストール
log_step "依存パッケージをインストール中..."

log_info "バックエンドのパッケージをインストール中..."
# 既存のnode_modulesを削除してクリーンインストール
if docker compose exec backend sh -c "rm -rf node_modules package-lock.json && npm install"; then
    log_info "✅ バックエンドのパッケージをインストールしました"
else
    log_warn "バックエンドのパッケージインストールに失敗しました"
fi

log_info "フロントエンドのパッケージをインストール中..."
# 既存のnode_modulesを削除してクリーンインストール
if docker compose exec frontend sh -c "rm -rf node_modules package-lock.json && npm install"; then
    log_info "✅ フロントエンドのパッケージをインストールしました"
else
    log_warn "フロントエンドのパッケージインストールに失敗しました"
fi
echo ""

# データベースのマイグレーション
log_step "データベースをマイグレーション中..."
# migration:runスクリプトが存在するか確認
if docker compose exec backend npm run | grep -q "migration:run"; then
    if docker compose exec backend npm run migration:run 2>/dev/null; then
        log_info "✅ データベースのマイグレーションが完了しました"
    else
        log_warn "マイグレーションに失敗しました"
    fi
else
    log_info "migration:runスクリプトが見つかりません。スキップします。"
fi
echo ""

# ヘルスチェック
log_step "ヘルスチェック中..."
MAX_ATTEMPTS=12
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_info "✅ ヘルスチェックに成功しました"
        echo ""
        echo "========================================="
        echo "  セットアップが完了しました！"
        echo "========================================="
        echo ""
        log_info "アクセス情報:"
        echo "  - フロントエンド: http://localhost:4200"
        echo "  - バックエンド:   http://localhost:3000"
        echo "  - Swagger:        http://localhost:3000/api"
        echo "  - PostgreSQL:     localhost:5432"
        echo ""
        log_info "開発を開始してください！"
        echo ""
        exit 0
    fi
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        log_error "❌ ヘルスチェックに失敗しました"
        log_error "ログを確認してください: docker compose logs backend"
        echo ""
        log_info "コンテナの状態:"
        docker compose ps
        exit 1
    fi
    
    log_info "ヘルスチェック試行 $ATTEMPT/$MAX_ATTEMPTS..."
    sleep 5
done
