#!/bin/bash

# Feature: docker-infrastructure, Property 11: Dockerfileのベースイメージ（Frontend部分）
# 検証要件: 要件10.1

set -e

echo "=== プロパティテスト: Dockerfileのベースイメージ（Frontend） ==="

# テスト: docker/frontend/DockerfileがNode.js 22をベースイメージとして使用しているか
if grep -q "FROM node:22" docker/frontend/Dockerfile; then
    echo "✓ Frontend DockerfileはNode.js 22をベースイメージとして使用しています"
else
    echo "✗ Frontend DockerfileはNode.js 22をベースイメージとして使用していません"
    exit 1
fi

echo "=== テスト成功 ==="
