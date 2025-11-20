#!/bin/bash

# Feature: docker-infrastructure, Property 3: ポートマッピングの正確性（Frontend部分）
# 検証要件: 要件2.1

set -e

echo "=== プロパティテスト: ポートマッピングの正確性（Frontend） ==="

# docker-compose.ymlが存在するか確認
if [ ! -f "docker-compose.yml" ]; then
    echo "✗ docker-compose.ymlが存在しません"
    exit 1
fi

# yqがインストールされているか確認
if ! command -v yq &> /dev/null; then
    echo "⚠ yqがインストールされていないため、grepで検証します"
    # grepで簡易チェック
    if grep -A 10 "  frontend:" docker-compose.yml | grep -q '4200:4200'; then
        echo "✓ Frontendのポートマッピング（4200:4200）が正しく設定されています"
    else
        echo "✗ Frontendのポートマッピングが正しく設定されていません"
        exit 1
    fi
else
    # yqで正確にチェック
    FRONTEND_PORT=$(yq eval '.services.frontend.ports[0]' docker-compose.yml)
    if [ "$FRONTEND_PORT" = "4200:4200" ]; then
        echo "✓ Frontendのポートマッピング（4200:4200）が正しく設定されています"
    else
        echo "✗ Frontendのポートマッピングが正しく設定されていません（実際: $FRONTEND_PORT）"
        exit 1
    fi
fi

echo "=== テスト成功 ==="
