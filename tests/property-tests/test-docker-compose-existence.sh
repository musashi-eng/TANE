#!/bin/bash

# Feature: docker-infrastructure, Property 1: Docker Compose設定ファイルの存在と配置
# 検証要件: 要件1.4, 1.5

set -e

echo "=== プロパティテスト: Docker Compose設定ファイルの存在と配置 ==="

# プロジェクトルートに移動
cd "$(dirname "$0")/../.."

# テスト1: docker-compose.ymlファイルが存在するか
echo "テスト1: docker-compose.ymlファイルの存在確認..."
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlファイルが存在しません"
    exit 1
fi
echo "✅ docker-compose.ymlファイルが存在します"

# テスト2: docker-compose.ymlがプロジェクトルートに配置されているか
echo "テスト2: docker-compose.ymlの配置確認..."
if [ ! -f "./docker-compose.yml" ]; then
    echo "❌ エラー: docker-compose.ymlがプロジェクトルートに配置されていません"
    exit 1
fi
echo "✅ docker-compose.ymlがプロジェクトルートに配置されています"

# テスト3: docker-compose.ymlの構文が正しいか（バージョン3.8以上）
echo "テスト3: docker-compose.ymlの構文確認..."
if ! docker compose config --quiet 2>/dev/null; then
    echo "❌ エラー: docker-compose.ymlの構文が正しくありません"
    exit 1
fi
echo "✅ docker-compose.ymlの構文が正しいです"

# テスト4: バージョンが3.8以上か確認
echo "テスト4: Docker Composeバージョンの確認..."
VERSION=$(grep -E "^version:" docker-compose.yml | sed "s/version: *['\"]//g" | sed "s/['\"]//g")
if [ -z "$VERSION" ]; then
    echo "❌ エラー: バージョン情報が見つかりません"
    exit 1
fi

# バージョン番号を比較（3.8以上）
MAJOR=$(echo "$VERSION" | cut -d. -f1)
MINOR=$(echo "$VERSION" | cut -d. -f2)

if [ "$MAJOR" -lt 3 ] || ([ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 8 ]); then
    echo "❌ エラー: Docker Composeのバージョンが3.8未満です（現在: $VERSION）"
    exit 1
fi
echo "✅ Docker Composeのバージョンが3.8以上です（現在: $VERSION）"

echo ""
echo "🎉 全てのテストが成功しました！"
echo "プロパティ1: Docker Compose設定ファイルの存在と配置 - 検証完了"
