-- PostgreSQL初期化スクリプト
-- このスクリプトはデータベースコンテナの初回起動時に自動的に実行されます

-- データベースの存在確認（既に作成されている場合はスキップ）
-- POSTGRES_DB環境変数で指定されたデータベースは自動的に作成されます

-- 基本的なスキーマの作成
CREATE SCHEMA IF NOT EXISTS public;

-- スキーマのコメント
COMMENT ON SCHEMA public IS 'アプリケーションのメインスキーマ';

-- 拡張機能の有効化（必要に応じて）
-- UUID生成用の拡張機能
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- タイムゾーンの設定（全データベースに適用）
ALTER SYSTEM SET timezone = 'Asia/Tokyo';

-- 初期化完了のログ
DO $$
BEGIN
    RAISE NOTICE 'データベース初期化が完了しました';
END $$;
