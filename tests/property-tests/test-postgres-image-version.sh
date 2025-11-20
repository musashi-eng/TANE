#!/bin/bash

# Feature: docker-infrastructure, Property 12: PostgreSQLイメージバージョン
# Validates: Requirements 10.3

set -e

echo "=== プロパティテスト: PostgreSQLイメージバージョン ==="
echo "検証要件: 要件10.3"
echo ""

# docker-compose.ymlファイルの存在確認
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlが見つかりません"
    exit 1
fi

# databaseサービスのイメージを取得
DATABASE_IMAGE=$(grep -A 20 "database:" docker-compose.yml | grep "image:" | head -n 1 | sed 's/.*image: *//' | tr -d '"' | tr -d "'")

echo "検出されたイメージ: $DATABASE_IMAGE"

# PostgreSQL 17のイメージであることを確認
if [[ "$DATABASE_IMAGE" =~ ^postgres:17 ]]; then
    echo "✅ 成功: PostgreSQL 17のイメージが使用されています"
    exit 0
else
    echo "❌ 失敗: PostgreSQL 17のイメージが使用されていません（検出: $DATABASE_IMAGE）"
    exit 1
fi
