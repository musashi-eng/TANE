#!/bin/bash

# Feature: docker-infrastructure, Property 9: サービス依存関係の定義
# 検証要件: 要件8.4

set -e

echo "プロパティテスト: サービス依存関係の定義"

# docker-compose.ymlの存在確認
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlが存在しません"
    exit 1
fi

# backendサービスのdepends_on設定確認
if ! grep -A 30 "backend:" docker-compose.yml | grep -q "depends_on:"; then
    echo "❌ エラー: backendサービスにdepends_onが設定されていません"
    exit 1
fi

# databaseへの依存関係確認
if ! grep -A 35 "backend:" docker-compose.yml | grep -A 5 "depends_on:" | grep -q "database:"; then
    echo "❌ エラー: backendサービスがdatabaseサービスに依存していません"
    exit 1
fi

# ヘルスチェック条件の確認
if ! grep -A 35 "backend:" docker-compose.yml | grep -A 5 "depends_on:" | grep -q "condition: service_healthy"; then
    echo "❌ エラー: backendサービスのdepends_onにヘルスチェック条件が設定されていません"
    exit 1
fi

echo "✅ 成功: backendサービスがdatabaseサービスに正しく依存しています（ヘルスチェック条件付き）"
exit 0
