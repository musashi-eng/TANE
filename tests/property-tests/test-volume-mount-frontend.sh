#!/bin/bash

# Feature: docker-infrastructure, Property 5: ソースコードマウントの正確性（Frontend部分）
# 検証要件: 要件2.4, 11.9

set -e

echo "=== プロパティテスト: ソースコードマウントの正確性（Frontend） ==="

# docker-compose.ymlが存在するか確認
if [ ! -f "docker-compose.yml" ]; then
    echo "✗ docker-compose.ymlが存在しません"
    exit 1
fi

# yqがインストールされているか確認
if ! command -v yq &> /dev/null; then
    echo "⚠ yqがインストールされていないため、grepで検証します"
    # grepで簡易チェック
    if grep -A 15 "  frontend:" docker-compose.yml | grep -q './frontend:/app'; then
        echo "✓ Frontendのソースコードマウント（./frontend:/app）が正しく設定されています"
    else
        echo "✗ Frontendのソースコードマウントが正しく設定されていません"
        exit 1
    fi
else
    # yqで正確にチェック
    FRONTEND_VOLUME=$(yq eval '.services.frontend.volumes[0]' docker-compose.yml)
    if [ "$FRONTEND_VOLUME" = "./frontend:/app" ]; then
        echo "✓ Frontendのソースコードマウント（./frontend:/app）が正しく設定されています"
    else
        echo "✗ Frontendのソースコードマウントが正しく設定されていません（実際: $FRONTEND_VOLUME）"
        exit 1
    fi
fi

echo "=== テスト成功 ==="
