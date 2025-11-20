#!/bin/bash

# Feature: docker-infrastructure, Property 5: ソースコードマウントの正確性（Backend部分）
# 検証要件: 要件3.4, 11.9

set -e

echo "プロパティテスト: ソースコードマウントの正確性（Backend）"

# docker-compose.ymlの存在確認
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlが存在しません"
    exit 1
fi

# backendサービスのボリュームマウント確認（./backend:/app）
if ! grep -A 30 "backend:" docker-compose.yml | grep -q "./backend:/app"; then
    echo "❌ エラー: backendサービスのボリュームマウント（./backend:/app）が設定されていません"
    exit 1
fi

echo "✅ 成功: backendサービスのボリュームマウントが正しく設定されています（./backend:/app）"
exit 0
