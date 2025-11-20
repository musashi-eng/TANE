#!/bin/bash

# Feature: docker-infrastructure, Property 2: 3つのサービス定義
# 検証要件: 要件1.1

set -e

echo "=== プロパティテスト: 3つのサービス定義 ==="

# プロジェクトルートに移動
cd "$(dirname "$0")/../.."

# テスト1: docker-compose.ymlにservicesセクションが存在するか
echo "テスト1: servicesセクションの存在確認..."
if ! grep -q "^services:" docker-compose.yml; then
    echo "❌ エラー: servicesセクションが見つかりません"
    exit 1
fi
echo "✅ servicesセクションが存在します"

# テスト2: frontendサービスが定義されているか
echo "テスト2: frontendサービスの確認..."
if ! docker compose config --services | grep -q "^frontend$"; then
    echo "❌ エラー: frontendサービスが定義されていません"
    exit 1
fi
echo "✅ frontendサービスが定義されています"

# テスト3: backendサービスが定義されているか
echo "テスト3: backendサービスの確認..."
if ! docker compose config --services | grep -q "^backend$"; then
    echo "❌ エラー: backendサービスが定義されていません"
    exit 1
fi
echo "✅ backendサービスが定義されています"

# テスト4: databaseサービスが定義されているか
echo "テスト4: databaseサービスの確認..."
if ! docker compose config --services | grep -q "^database$"; then
    echo "❌ エラー: databaseサービスが定義されていません"
    exit 1
fi
echo "✅ databaseサービスが定義されています"

# テスト5: サービス数が正確に3つか
echo "テスト5: サービス数の確認..."
SERVICE_COUNT=$(docker compose config --services | wc -l)
if [ "$SERVICE_COUNT" -ne 3 ]; then
    echo "❌ エラー: サービス数が3つではありません（現在: $SERVICE_COUNT）"
    exit 1
fi
echo "✅ サービス数が正確に3つです"

# テスト6: 各サービスが必須の設定を持っているか
echo "テスト6: 各サービスの基本設定確認..."

# frontendの確認
if ! docker compose config | grep -A 20 "frontend:" | grep -q "ports:"; then
    echo "❌ エラー: frontendサービスにportsが定義されていません"
    exit 1
fi

# backendの確認
if ! docker compose config | grep -A 20 "backend:" | grep -q "ports:"; then
    echo "❌ エラー: backendサービスにportsが定義されていません"
    exit 1
fi

# databaseの確認
if ! docker compose config | grep -A 20 "database:" | grep -q "image:"; then
    echo "❌ エラー: databaseサービスにimageが定義されていません"
    exit 1
fi

echo "✅ 各サービスが必須の設定を持っています"

echo ""
echo "🎉 全てのテストが成功しました！"
echo "プロパティ2: 3つのサービス定義 - 検証完了"
