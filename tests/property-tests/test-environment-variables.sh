#!/bin/bash

# Feature: docker-infrastructure, Property 7: 環境変数の提供
# 検証要件: 要件3.6, 6.2

set -e

echo "プロパティテスト: 環境変数の提供"

# docker-compose.ymlの存在確認
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlが存在しません"
    exit 1
fi

# backendサービスの環境変数確認
required_vars=(
    "DATABASE_HOST"
    "DATABASE_PORT"
    "DATABASE_USER"
    "DATABASE_PASSWORD"
    "DATABASE_NAME"
)

for var in "${required_vars[@]}"; do
    if ! grep -A 30 "backend:" docker-compose.yml | grep -q "$var"; then
        echo "❌ エラー: backendサービスに環境変数 $var が設定されていません"
        exit 1
    fi
done

echo "✅ 成功: backendサービスに必要な環境変数が全て設定されています"
exit 0
