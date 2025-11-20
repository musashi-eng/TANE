#!/bin/bash

# Feature: docker-infrastructure, Property 10: Dockerfileの存在と配置（Backend部分）
# 検証要件: 要件11.4

set -e

echo "プロパティテスト: Dockerfileの存在と配置（Backend）"

# Backend用Dockerfileの存在確認
if [ ! -f "docker/backend/Dockerfile" ]; then
    echo "❌ エラー: docker/backend/Dockerfileが存在しません"
    exit 1
fi

echo "✅ 成功: docker/backend/Dockerfileが存在します"
exit 0
