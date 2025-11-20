#!/bin/bash

# Feature: docker-infrastructure, Property 11: Dockerfileのベースイメージ（Backend部分）
# 検証要件: 要件10.2

set -e

echo "プロパティテスト: Dockerfileのベースイメージ（Backend）"

# Backend用Dockerfileの存在確認
if [ ! -f "docker/backend/Dockerfile" ]; then
    echo "❌ エラー: docker/backend/Dockerfileが存在しません"
    exit 1
fi

# ベースイメージの確認（node:22を含むか）
if ! grep -q "FROM node:22" docker/backend/Dockerfile; then
    echo "❌ エラー: docker/backend/Dockerfileがnode:22をベースイメージとして使用していません"
    exit 1
fi

echo "✅ 成功: docker/backend/Dockerfileがnode:22をベースイメージとして使用しています"
exit 0
