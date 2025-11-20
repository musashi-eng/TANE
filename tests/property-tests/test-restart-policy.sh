#!/bin/bash

# Feature: docker-infrastructure, Property 15: 再起動ポリシー
# Validates: Requirements 9.5

set -e

echo "=== プロパティテスト: 再起動ポリシー ==="
echo "検証要件: 要件9.5"
echo ""

# docker-compose.ymlファイルの存在確認
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlが見つかりません"
    exit 1
fi

# 全てのサービス名を取得
SERVICES=$(grep -E "^  [a-z]+:" docker-compose.yml | sed 's/://g' | sed 's/  //g' | grep -v "^networks$" | grep -v "^volumes$")

echo "検出されたサービス: $SERVICES"
echo ""

ALL_PASSED=true

# 各サービスの再起動ポリシーを確認
for SERVICE in $SERVICES; do
    echo "サービス: $SERVICE"
    
    # サービスのセクションを抽出
    SERVICE_SECTION=$(sed -n "/^  $SERVICE:/,/^  [a-z]/p" docker-compose.yml)
    
    # 再起動ポリシーを確認
    if echo "$SERVICE_SECTION" | grep -q "restart:.*unless-stopped"; then
        echo "  ✅ 再起動ポリシーが unless-stopped に設定されています"
    else
        echo "  ❌ 失敗: 再起動ポリシーが unless-stopped に設定されていません"
        ALL_PASSED=false
    fi
    echo ""
done

if [ "$ALL_PASSED" = true ]; then
    echo "✅ 成功: 全てのサービスの再起動ポリシーが正しく設定されています"
    exit 0
else
    echo "❌ 失敗: 一部のサービスの再起動ポリシーが正しく設定されていません"
    exit 1
fi
