#!/bin/bash

# Feature: docker-infrastructure, Property 6: ネットワーク設定の一貫性
# 検証要件: 要件5.1

set -e

echo "=== プロパティテスト: ネットワーク設定の一貫性 ==="

# プロジェクトルートに移動
cd "$(dirname "$0")/../.."

# テスト1: networksセクションが存在するか
echo "テスト1: networksセクションの存在確認..."
if ! grep -q "^networks:" docker-compose.yml; then
    echo "❌ エラー: networksセクションが見つかりません"
    exit 1
fi
echo "✅ networksセクションが存在します"

# テスト2: app-networkが定義されているか
echo "テスト2: app-networkの定義確認..."
if ! docker compose config | grep -A 5 "^networks:" | grep -q "app-network:"; then
    echo "❌ エラー: app-networkが定義されていません"
    exit 1
fi
echo "✅ app-networkが定義されています"

# テスト3: frontendサービスがapp-networkに接続されているか
echo "テスト3: frontendサービスのネットワーク接続確認..."
if ! docker compose config | grep -A 30 "frontend:" | grep -A 5 "networks:" | grep -q "app-network"; then
    echo "❌ エラー: frontendサービスがapp-networkに接続されていません"
    exit 1
fi
echo "✅ frontendサービスがapp-networkに接続されています"

# テスト4: backendサービスがapp-networkに接続されているか
echo "テスト4: backendサービスのネットワーク接続確認..."
if ! docker compose config | grep -A 30 "backend:" | grep -A 5 "networks:" | grep -q "app-network"; then
    echo "❌ エラー: backendサービスがapp-networkに接続されていません"
    exit 1
fi
echo "✅ backendサービスがapp-networkに接続されています"

# テスト5: databaseサービスがapp-networkに接続されているか
echo "テスト5: databaseサービスのネットワーク接続確認..."
if ! docker compose config | grep -A 30 "database:" | grep -A 5 "networks:" | grep -q "app-network"; then
    echo "❌ エラー: databaseサービスがapp-networkに接続されていません"
    exit 1
fi
echo "✅ databaseサービスがapp-networkに接続されています"

# テスト6: 全てのサービスが同一のネットワークに接続されているか
echo "テスト6: 全サービスの同一ネットワーク接続確認..."
FRONTEND_NETWORK=$(docker compose config | grep -A 30 "frontend:" | grep -A 5 "networks:" | grep -o "app-network" | head -1)
BACKEND_NETWORK=$(docker compose config | grep -A 30 "backend:" | grep -A 5 "networks:" | grep -o "app-network" | head -1)
DATABASE_NETWORK=$(docker compose config | grep -A 30 "database:" | grep -A 5 "networks:" | grep -o "app-network" | head -1)

if [ "$FRONTEND_NETWORK" != "app-network" ] || [ "$BACKEND_NETWORK" != "app-network" ] || [ "$DATABASE_NETWORK" != "app-network" ]; then
    echo "❌ エラー: 全てのサービスが同一のネットワークに接続されていません"
    exit 1
fi
echo "✅ 全てのサービスが同一のネットワーク（app-network）に接続されています"

# テスト7: ネットワークドライバーがbridgeか
echo "テスト7: ネットワークドライバーの確認..."
if ! docker compose config | grep -A 5 "app-network:" | grep -q "driver: bridge"; then
    echo "❌ エラー: app-networkのドライバーがbridgeではありません"
    exit 1
fi
echo "✅ app-networkのドライバーがbridgeです"

echo ""
echo "🎉 全てのテストが成功しました！"
echo "プロパティ6: ネットワーク設定の一貫性 - 検証完了"
