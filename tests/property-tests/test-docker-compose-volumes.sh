#!/bin/bash

# Feature: docker-infrastructure, Property 4: ボリューム定義の完全性
# 検証要件: 要件7.1

set -e

echo "=== プロパティテスト: ボリューム定義の完全性 ==="

# プロジェクトルートに移動
cd "$(dirname "$0")/../.."

# テスト1: docker-compose.ymlにvolumesセクションが存在するか
echo "テスト1: volumesセクションの存在確認..."
if ! grep -q "^volumes:" docker-compose.yml; then
    echo "❌ エラー: volumesセクションが見つかりません"
    exit 1
fi
echo "✅ volumesセクションが存在します"

# テスト2: postgres-dataボリュームが定義されているか
echo "テスト2: postgres-dataボリュームの確認..."
if ! docker compose config --volumes | grep -q "^postgres-data$"; then
    echo "❌ エラー: postgres-dataボリュームが定義されていません"
    exit 1
fi
echo "✅ postgres-dataボリュームが定義されています"

# テスト3: postgres-dataボリュームがdatabaseサービスで使用されているか
echo "テスト3: postgres-dataボリュームの使用確認..."
if ! docker compose config | grep -A 30 "database:" | grep -A 10 "volumes:" | grep -q "postgres-data"; then
    echo "❌ エラー: postgres-dataボリュームがdatabaseサービスで使用されていません"
    exit 1
fi
echo "✅ postgres-dataボリュームがdatabaseサービスで使用されています"

# テスト4: postgres-dataボリュームが正しいパスにマウントされているか
echo "テスト4: postgres-dataボリュームのマウントパス確認..."
VOLUME_CONFIG=$(docker compose config 2>/dev/null | grep -A 40 "database:" | grep -A 20 "volumes:")
if ! echo "$VOLUME_CONFIG" | grep -q "source: postgres-data"; then
    echo "❌ エラー: postgres-dataボリュームがdatabaseサービスで使用されていません"
    exit 1
fi
if ! echo "$VOLUME_CONFIG" | grep -q "target: /var/lib/postgresql/data"; then
    echo "❌ エラー: postgres-dataボリュームが/var/lib/postgresql/dataにマウントされていません"
    exit 1
fi
echo "✅ postgres-dataボリュームが/var/lib/postgresql/dataにマウントされています"

# テスト5: ボリュームドライバーがlocalか
echo "テスト5: ボリュームドライバーの確認..."
if ! docker compose config | grep -A 5 "postgres-data:" | grep -q "driver: local"; then
    echo "❌ エラー: postgres-dataのドライバーがlocalではありません"
    exit 1
fi
echo "✅ postgres-dataのドライバーがlocalです"

echo ""
echo "🎉 全てのテストが成功しました！"
echo "プロパティ4: ボリューム定義の完全性 - 検証完了"
