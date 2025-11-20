#!/bin/bash

# Feature: docker-infrastructure, Property 8: データベースヘルスチェックの設定
# Validates: Requirements 8.1, 8.2, 8.3

set -e

echo "=== プロパティテスト: データベースヘルスチェックの設定 ==="
echo "検証要件: 要件8.1, 8.2, 8.3"
echo ""

# docker-compose.ymlファイルの存在確認
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlが見つかりません"
    exit 1
fi

# databaseサービスのhealthcheckセクションを抽出
HEALTHCHECK_SECTION=$(sed -n '/^  database:/,/^  [a-z]/p' docker-compose.yml | sed -n '/healthcheck:/,/^    [a-z]/p')

if [ -z "$HEALTHCHECK_SECTION" ]; then
    echo "❌ 失敗: databaseサービスにhealthcheckが設定されていません"
    exit 1
fi

echo "検出されたヘルスチェック設定:"
echo "$HEALTHCHECK_SECTION"
echo ""

# pg_isreadyコマンドが使用されているか確認
if echo "$HEALTHCHECK_SECTION" | grep -q "pg_isready"; then
    echo "✅ pg_isreadyコマンドが使用されています"
else
    echo "❌ 失敗: pg_isreadyコマンドが使用されていません"
    exit 1
fi

# 30秒間隔の確認
if echo "$HEALTHCHECK_SECTION" | grep -q "interval:.*30s"; then
    echo "✅ ヘルスチェック間隔が30秒に設定されています"
else
    echo "❌ 失敗: ヘルスチェック間隔が30秒に設定されていません"
    exit 1
fi

# 3回リトライの確認
if echo "$HEALTHCHECK_SECTION" | grep -q "retries:.*3"; then
    echo "✅ リトライ回数が3回に設定されています"
else
    echo "❌ 失敗: リトライ回数が3回に設定されていません"
    exit 1
fi

echo ""
echo "✅ 成功: データベースヘルスチェックが正しく設定されています"
exit 0
