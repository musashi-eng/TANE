#!/bin/bash

# Feature: docker-infrastructure, Property 3: ポートマッピングの正確性（Backend部分）
# 検証要件: 要件3.1, 9.2

set -e

echo "プロパティテスト: ポートマッピングの正確性（Backend）"

# docker-compose.ymlの存在確認
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlが存在しません"
    exit 1
fi

# backendサービスのポート3000のマッピング確認
if ! grep -A 20 "backend:" docker-compose.yml | grep -q '"3000:3000"'; then
    echo "❌ エラー: backendサービスのポート3000がマッピングされていません"
    exit 1
fi

# backendサービスのポート9229（デバッグポート）のマッピング確認
if ! grep -A 20 "backend:" docker-compose.yml | grep -q '"9229:9229"'; then
    echo "❌ エラー: backendサービスのポート9229（デバッグポート）がマッピングされていません"
    exit 1
fi

echo "✅ 成功: backendサービスのポートマッピングが正しく設定されています（3000:3000, 9229:9229）"
exit 0
