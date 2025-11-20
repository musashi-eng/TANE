#!/bin/bash

# Feature: docker-infrastructure, Property 14: .gitignore設定
# Validates: Requirements 6.5

set -e

echo "=== プロパティテスト: .gitignore設定 ==="
echo ""

# テスト結果を格納する変数
PASSED=0
FAILED=0

# .gitignoreファイルの存在確認
echo "1. .gitignoreファイルの存在確認"
if [ -f ".gitignore" ]; then
    echo "  ✓ .gitignoreファイルが存在します"
    PASSED=$((PASSED + 1))
else
    echo "  ✗ .gitignoreファイルが存在しません"
    FAILED=$((FAILED + 1))
    echo ""
    echo "=== テスト結果 ==="
    echo "成功: $PASSED"
    echo "失敗: $FAILED"
    echo ""
    echo "✗ テストが失敗しました"
    exit 1
fi

# .envファイルが除外対象に含まれているか確認
echo ""
echo "2. .envファイルが除外対象に含まれているか確認"
if grep -q "^\.env$" .gitignore || grep -q "^\.env\s" .gitignore; then
    echo "  ✓ .envファイルが除外対象に含まれています"
    PASSED=$((PASSED + 1))
else
    echo "  ✗ .envファイルが除外対象に含まれていません"
    FAILED=$((FAILED + 1))
fi

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
