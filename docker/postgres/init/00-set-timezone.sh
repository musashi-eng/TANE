#!/bin/bash
# タイムゾーン設定スクリプト
# このスクリプトはデータベースコンテナの初回起動時に自動的に実行されます

set -e

# postgresql.confにタイムゾーン設定を追加
echo "timezone = 'Asia/Tokyo'" >> ${PGDATA}/postgresql.conf

echo "タイムゾーンをAsia/Tokyoに設定しました"
