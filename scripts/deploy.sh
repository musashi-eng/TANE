#!/bin/bash

# デプロイスクリプト
# 使用方法: ./scripts/deploy.sh [prod|test]

set -e  # エラーが発生したら即座に終了

# 色付きログ出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 引数チェック
if [ $# -eq 0 ]; then
    log_error "環境を指定してください: prod または test"
    echo "使用方法: ./scripts/deploy.sh [prod|test]"
    exit 1
fi

ENVIRONMENT=$1

# 環境の検証
if [ "$ENVIRONMENT" != "prod" ] && [ "$ENVIRONMENT" != "test" ]; then
    log_error "無効な環境: $ENVIRONMENT"
    echo "使用方法: ./scripts/deploy.sh [prod|test]"
    exit 1
fi

echo ""
echo "========================================="
echo "  デプロイスクリプト"
echo "  環境: $ENVIRONMENT"
echo "========================================="
echo ""

log_info "デプロイを開始します: 環境=$ENVIRONMENT"

# Docker Composeファイルの選択
if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.test.yml"
fi

log_info "使用するDocker Composeファイル: $COMPOSE_FILE"

# Docker Composeファイルの存在確認
if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "$COMPOSE_FILE が見つかりません"
    exit 1
fi

# 1. Gitから最新コードを取得
log_step "Gitリポジトリから最新コードを取得中..."
CURRENT_BRANCH=$(git branch --show-current)
log_info "現在のブランチ: $CURRENT_BRANCH"

if ! git pull origin "$CURRENT_BRANCH"; then
    log_error "Gitプルに失敗しました"
    exit 1
fi
log_info "✅ 最新コードの取得完了"
echo ""

# 2. 環境変数ファイルの存在確認
log_step "環境変数ファイルを確認中..."
if [ ! -f ".env" ]; then
    log_error ".envファイルが見つかりません"
    log_error "デプロイを続行できません"
    exit 1
fi
log_info "✅ 環境変数ファイルの確認完了"
echo ""

# 3. 既存のコンテナを停止
log_step "既存のコンテナを停止中..."
if ! docker compose -f "$COMPOSE_FILE" down; then
    log_warn "コンテナの停止に失敗しました（コンテナが存在しない可能性があります）"
fi
log_info "✅ コンテナの停止完了"
echo ""

# 4. Dockerイメージをビルド
log_step "Dockerイメージをビルド中（キャッシュなし）..."
if ! docker compose -f "$COMPOSE_FILE" build --no-cache; then
    log_error "Dockerビルドに失敗しました"
    exit 1
fi
log_info "✅ Dockerイメージのビルド完了"
echo ""

# 5. 新しいコンテナを起動
log_step "新しいコンテナを起動中..."
if [ "$ENVIRONMENT" = "prod" ]; then
    log_info "（本番環境では、マイグレーションはコンテナ起動時に自動実行されます）"
else
    log_info "（テスト環境では、マイグレーションはコンテナ起動時に自動実行されます）"
fi

if ! docker compose -f "$COMPOSE_FILE" up -d; then
    log_error "コンテナの起動に失敗しました"
    exit 1
fi
log_info "✅ コンテナの起動完了"
echo ""

# 6. ヘルスチェック確認（最大180秒待機）
log_step "ヘルスチェックを確認中（最大180秒待機）..."

# 環境別のポート設定
if [ "$ENVIRONMENT" = "prod" ]; then
    HEALTH_CHECK_URL="http://localhost:3000/health"
else
    HEALTH_CHECK_URL="http://localhost:3000/health"
fi

log_info "ヘルスチェックURL: $HEALTH_CHECK_URL"

MAX_ATTEMPTS=36  # 5秒間隔で36回 = 180秒
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    log_info "ヘルスチェック試行 $ATTEMPT/$MAX_ATTEMPTS..."
    
    # コンテナの状態を確認
    BACKEND_STATUS=$(docker compose -f "$COMPOSE_FILE" ps backend --format json 2>/dev/null | grep -o '"State":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
    log_info "バックエンドコンテナの状態: $BACKEND_STATUS"
    
    # curlでヘルスチェックエンドポイントを確認
    if curl -f -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
        log_info "✅ ヘルスチェック成功！"
        break
    fi
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        log_error "❌ ヘルスチェックが180秒後もタイムアウトしました"
        log_error "バックエンドコンテナのログ:"
        docker compose -f "$COMPOSE_FILE" logs --tail=50 backend
        exit 1
    fi
    
    sleep 5
done
echo ""

# 7. 古いDockerイメージのクリーンアップ
log_step "古いDockerイメージをクリーンアップ中..."
if ! docker image prune -f; then
    log_warn "イメージのクリーンアップに失敗しました"
fi
log_info "✅ クリーンアップ完了"
echo ""

# デプロイ完了
echo "========================================="
log_info "デプロイが正常に完了しました！"
echo "========================================="
echo ""
log_info "環境: $ENVIRONMENT"
log_info "デプロイ日時: $(date)"
log_info "コミット: $(git rev-parse --short HEAD)"
echo ""
log_info "コンテナの状態を確認: docker compose -f $COMPOSE_FILE ps"
log_info "ログを確認: docker compose -f $COMPOSE_FILE logs -f"
echo ""

exit 0
