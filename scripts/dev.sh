#!/bin/bash

# TANE 開発サーバー起動スクリプト
# 使用方法: ./scripts/dev.sh
#
# 初回セットアップ（./scripts/setup.sh）の後、2回目以降の起動に使う。
# フロントエンドは @musashi-eng/design-system を GitHub Packages から取得するため
# NODE_AUTH_TOKEN が必要。このスクリプトが gh CLI から自動で用意する。

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# GitHub Packages 認証トークンを用意（未設定なら gh CLI から取得）
if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
    if command -v gh >/dev/null 2>&1; then
        NODE_AUTH_TOKEN=$(gh auth token 2>/dev/null) || true
        export NODE_AUTH_TOKEN
    fi
fi

if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
    log_error "NODE_AUTH_TOKEN を用意できませんでした。"
    log_error "次のいずれかを実行してください:"
    log_error "  - gh auth login でログイン（read:packages 権限が必要）"
    log_error "  - export NODE_AUTH_TOKEN=\$(gh auth token) を手動で実行"
    exit 1
fi

# .npmrc が無ければ雛形から作成
if [ ! -f frontend/.npmrc ] && [ -f frontend/.npmrc.example ]; then
    cp frontend/.npmrc.example frontend/.npmrc
    log_info ".npmrc を .npmrc.example から作成しました"
fi

log_info "Dockerコンテナを起動します..."
docker compose up -d

log_info "✅ 起動しました"
echo ""
log_info "アクセス情報:"
echo "  - フロントエンド: http://localhost:4200"
echo "  - バックエンド:   http://localhost:3000"
echo "  - Swagger:        http://localhost:3000/api"
echo ""
log_info "ログを見る:   docker compose logs -f"
log_info "停止する:     docker compose down"
