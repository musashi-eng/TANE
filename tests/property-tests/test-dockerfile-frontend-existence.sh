#!/bin/bash

# Feature: docker-infrastructure, Property 10: Dockerfileの存在と配置（Frontend部分）
# 検証要件: 要件11.3

set -e

echo "=== プロパティテスト: Dockerfileの存在と配置（Frontend） ==="

# テスト: docker/frontend/Dockerfileが存在するか
if [ -f "docker/frontend/Dockerfile" ]; then
    echo "✓ docker/frontend/Dockerfileが存在します"
else
    echo "✗ docker/frontend/Dockerfileが存在しません"
    exit 1
fi

echo "=== テスト成功 ==="
