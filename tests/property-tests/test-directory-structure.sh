#!/bin/bash

# Feature: docker-infrastructure, Property 13: ディレクトリ構造の完全性
# Validates: Requirements 11.1, 11.2, 11.6, 11.7

set -e

echo "=== プロパティテスト: ディレクトリ構造の完全性 ==="
echo ""

# テスト結果を格納する変数
PASSED=0
FAILED=0

# 必要なディレクトリのリスト
REQUIRED_DIRS=(
    "docker/frontend"
    "docker/backend"
    "docker/postgres"
    "frontend"
    "backend"
)

echo "検証対象のディレクトリ:"
for dir in "${REQUIRED_DIRS[@]}"; do
    echo "  - $dir"
done
echo ""

# 各ディレクトリの存在を確認
echo "ディレクトリの存在確認:"
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir が存在します"
        PASSED=$((PASSED + 1))
    else
        echo "  ✗ $dir が存在しません"
        FAILED=$((FAILED + 1))
    fi
done

echo ""
echo "=== テスト結果 ==="
echo "成功: $PASSED"
echo "失敗: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✓ 全てのテストが成功しました"
    exit 0
else
    echo "✗ テストが失敗しました"
    exit 1
fi
