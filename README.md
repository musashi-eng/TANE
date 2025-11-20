# TAMA プロジェクト

Angular 20、NestJS 11、PostgreSQL 17を使用したコンテナベースのアプリケーション基盤です。

## プロジェクト概要

このプロジェクトは、Docker Composeを使用して3層アーキテクチャ（フロントエンド、バックエンド、データベース）を提供します。

### 技術スタック

- **フロントエンド**: Angular 20 (Zoneless + Signals)
- **バックエンド**: NestJS 11
- **データベース**: PostgreSQL 17
- **開発環境**: Docker Compose
- **言語**: TypeScript 5.8+

### Angular 20の特徴

このプロジェクトは、Angular 20の最新機能を採用しています：

- ✨ **Zonelessモード**: Zone.jsを使用せず、パフォーマンスを最適化
- 🎯 **Signalsベース**: 状態管理にSignalsを使用し、細かい粒度の変更検知
- 🚀 **スタンドアロンコンポーネント**: NgModuleを使用しない新しいアーキテクチャ
- 📝 **新しい制御フロー構文**: `@if`, `@for`, `@switch`を使用
- 📦 **バンドルサイズ削減**: Zone.jsの削除により約50KB削減

## クイックスタート

### 前提条件

- Docker Desktop がインストールされていること
- Git がインストールされていること

### 環境構築

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd TAMA.new
```

### 2. 環境変数ファイルを作成

プロジェクトルートに`.env`ファイルを作成します。サンプルファイルをコピーして使用できます。

```bash
cp .env.example .env
```

`.env`ファイルの内容を必要に応じて編集してください：

```env
# Node環境
NODE_ENV=development

# タイムゾーン設定
TZ=Asia/Tokyo

# データベース接続情報
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db

# API設定
API_URL=http://localhost:3000
```

### 3. コンテナを起動

単一のコマンドで全ての開発環境を起動できます。

```bash
docker compose up -d
```

初回起動時は、イメージのビルドと依存パッケージのインストールに数分かかります。

### 4. 起動確認

コンテナの状態を確認します。

```bash
docker compose ps
```

全てのコンテナが`Up`または`healthy`状態になっていることを確認してください。

### 5. アプリケーションにアクセス

各コンテナへのアクセス方法：

| サービス | URL | 説明 |
|---------|-----|------|
| **フロントエンド** | http://localhost:4200 | Angularアプリケーション |
| **バックエンドAPI** | http://localhost:3000 | NestJS RESTful API |
| **ヘルスチェック** | http://localhost:3000/health | バックエンドの健全性確認 |
| **Swagger UI** | http://localhost:3000/api | APIドキュメント（開発環境のみ） |
| **OpenAPI JSON** | http://localhost:3000/api-json | OpenAPI仕様（開発環境のみ） |
| **データベース** | localhost:5432 | PostgreSQL（psqlやGUIツールで接続） |
| **デバッグポート** | localhost:9229 | Node.jsデバッガー（バックエンド） |

### コンテナの管理

#### 基本コマンド

```bash
# コンテナの起動（バックグラウンド）
docker compose up -d

# コンテナの起動（フォアグラウンド、ログ表示）
docker compose up

# コンテナの停止
docker compose down

# コンテナの停止（ボリュームも削除）
docker compose down -v

# コンテナの再起動
docker compose restart

# 特定のサービスのみ再起動
docker compose restart frontend
```

#### 状態確認

```bash
# コンテナの状態確認
docker compose ps

# リアルタイムでログを確認
docker compose logs -f

# 特定のサービスのログを確認
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f database

# 最新100行のログを表示
docker compose logs --tail=100
```

#### コンテナ内でコマンドを実行

```bash
# フロントエンドコンテナでコマンドを実行
docker compose exec frontend <コマンド>

# バックエンドコンテナでコマンドを実行
docker compose exec backend <コマンド>

# データベースコンテナでコマンドを実行
docker compose exec database <コマンド>

# 例: フロントエンドでnpmコマンドを実行
docker compose exec frontend npm install
docker compose exec frontend npm run build
```

#### コンテナへのシェルアクセス

```bash
# フロントエンドコンテナに入る
docker compose exec frontend sh

# バックエンドコンテナに入る
docker compose exec backend sh

# データベースコンテナに入る
docker compose exec database bash
```

## 開発ガイド

### フロントエンド開発

フロントエンドはAngular 20を使用しています。

```bash
# コンテナ内でコマンドを実行
docker compose exec frontend npm install
docker compose exec frontend npm run build

# TypeScriptの型チェック
docker compose exec frontend npx tsc --noEmit
```

詳細は[開発ガイド](.kiro/steering/development-guide.md)を参照してください。

### Angular開発ガイドライン

このプロジェクトでは、Zoneless + Signalsアーキテクチャを採用しています。

詳細なガイドラインは[Angularガイドライン](.kiro/steering/angular-guidelines.md)を参照してください。

**重要なポイント:**

- 状態管理には必ずSignalsを使用する
- Zone.jsは使用しない
- 新しい制御フロー構文（`@if`, `@for`, `@switch`）を使用する
- テンプレートでSignalを使用する際は`()`を付けて呼び出す

### バックエンド開発

バックエンドはNestJS 11を使用しています。

```bash
# コンテナ内でコマンドを実行
docker compose exec backend npm install
docker compose exec backend npm run build
```

### データベース

PostgreSQL 17を使用しています。

#### データベースへの接続

```bash
# psqlで接続（環境変数のデフォルト値を使用）
docker compose exec database psql -U postgres -d app_db

# 環境変数で指定したユーザー名とデータベース名で接続
docker compose exec -e PGPASSWORD=${DATABASE_PASSWORD} database psql -U ${DATABASE_USER} -d ${DATABASE_NAME}

# SQLクエリを直接実行
docker compose exec database psql -U postgres -d app_db -c "SELECT version();"
```

#### データベース操作

```bash
# データベース一覧を表示
docker compose exec database psql -U postgres -c "\l"

# テーブル一覧を表示
docker compose exec database psql -U postgres -d app_db -c "\dt"

# テーブルの構造を表示
docker compose exec database psql -U postgres -d app_db -c "\d table_name"
```

#### バックアップとリストア

```bash
# データベースのバックアップ
docker compose exec database pg_dump -U postgres app_db > backup.sql

# 日付付きバックアップ
docker compose exec database pg_dump -U postgres app_db > backup_$(date +%Y%m%d_%H%M%S).sql

# バックアップからリストア
docker compose exec -T database psql -U postgres -d app_db < backup.sql

# データベースを再作成してリストア
docker compose exec database psql -U postgres -c "DROP DATABASE IF EXISTS app_db;"
docker compose exec database psql -U postgres -c "CREATE DATABASE app_db;"
docker compose exec -T database psql -U postgres -d app_db < backup.sql
```

#### GUIツールでの接続

pgAdmin、DBeaver、TablePlusなどのGUIツールで接続できます。

**接続情報**:
- ホスト: `localhost`
- ポート: `5432`
- ユーザー名: `.env`ファイルの`DATABASE_USER`
- パスワード: `.env`ファイルの`DATABASE_PASSWORD`
- データベース名: `.env`ファイルの`DATABASE_NAME`

## プロジェクト構造

```
TAMA.new/
├── .kiro/                      # Kiro設定ファイル
│   ├── specs/                  # 仕様書
│   └── steering/               # 開発ガイドライン
├── docker/                     # Docker関連ファイル
│   ├── frontend/               # Frontend用Dockerfile
│   ├── backend/                # Backend用Dockerfile
│   └── postgres/               # PostgreSQL設定
├── frontend/                   # Angularソースコード
│   ├── src/
│   ├── angular.json
│   └── package.json
├── backend/                    # NestJSソースコード
│   ├── src/
│   └── package.json
├── tests/                      # テストファイル
│   └── property-tests/         # プロパティベーステスト
├── docker-compose.yml          # Docker Compose設定
├── .env                        # 環境変数（gitignore対象）
└── .env.example                # 環境変数のサンプル
```

## テスト

### プロパティベーステスト

```bash
# すべてのプロパティテストを実行
./tests/property-tests/test-*.sh

# 特定のテストを実行
./tests/property-tests/test-docker-compose-services.sh
```

### フロントエンドのテスト

```bash
# 単体テストの実行
docker compose exec frontend npm test

# TypeScriptの型チェック
docker compose exec frontend npx tsc --noEmit
```

## 環境変数の説明

### 必須の環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `NODE_ENV` | development | Node.js実行環境（development: Swagger有効、production: Swagger無効） |
| `TZ` | Asia/Tokyo | タイムゾーン設定 |
| `DATABASE_HOST` | database | データベースホスト名（コンテナ名） |
| `DATABASE_PORT` | 5432 | データベースポート |
| `DATABASE_USER` | postgres | データベースユーザー名 |
| `DATABASE_PASSWORD` | postgres | データベースパスワード |
| `DATABASE_NAME` | app_db | データベース名 |
| `API_URL` | http://localhost:3000 | バックエンドAPIのURL |

### 環境変数の変更方法

1. `.env`ファイルを編集
2. コンテナを再起動

```bash
docker compose down
docker compose up -d
```

## トラブルシューティング

### 1. ポートが既に使用されている

**症状**: コンテナが起動できない、ポート競合のエラーが表示される

**原因**: 4200、3000、5432のいずれかのポートが既に使用されている

**解決方法**:

```bash
# 使用中のプロセスを確認
lsof -i :4200  # フロントエンド
lsof -i :3000  # バックエンド
lsof -i :5432  # データベース

# 使用中のプロセスを停止するか、docker-compose.ymlのポート設定を変更
```

### 2. コンテナが起動しない

**症状**: `docker compose up -d`が失敗する

**解決方法**:

```bash
# ログを確認
docker compose logs

# 特定のサービスのログを確認
docker compose logs frontend
docker compose logs backend
docker compose logs database

# コンテナを再起動
docker compose restart
```

### 3. データベース接続エラー

**症状**: バックエンドがデータベースに接続できない

**解決方法**:

```bash
# データベースのヘルスチェックを確認
docker compose ps

# データベースコンテナが"healthy"になるまで待つ
# 環境変数を確認
docker compose exec backend env | grep DATABASE

# データベースに直接接続して確認
docker compose exec database psql -U postgres -d app_db -c "SELECT 1"
```

### 4. Hot Reloadが動作しない

**症状**: ソースコード変更が反映されない

**解決方法**:

```bash
# コンテナを再起動
docker compose restart frontend
docker compose restart backend

# ボリュームマウントを確認
docker compose config | grep volumes
```

### 5. node_modulesの問題

**症状**: パッケージが見つからない、依存関係のエラー

**解決方法**:

```bash
# フロントエンドのnode_modulesを再インストール
docker compose exec frontend rm -rf node_modules package-lock.json
docker compose exec frontend npm install

# バックエンドのnode_modulesを再インストール
docker compose exec backend rm -rf node_modules package-lock.json
docker compose exec backend npm install
```

### 6. コンテナの完全リセット

**症状**: 上記の方法で解決しない場合

**解決方法**:

```bash
# 全てのコンテナとボリュームを削除
docker compose down -v

# イメージを再ビルド（キャッシュなし）
docker compose build --no-cache

# コンテナを起動
docker compose up -d
```

### 7. データベースデータの消失

**症状**: データベースのデータが失われた

**原因**: `docker compose down -v`を実行してボリュームを削除した

**予防方法**:

```bash
# ボリュームを保持してコンテナを停止
docker compose down  # -vオプションを付けない

# 定期的にバックアップを作成
docker compose exec database pg_dump -U postgres app_db > backup_$(date +%Y%m%d).sql
```

### 8. パフォーマンスが遅い

**症状**: コンテナの動作が遅い、ビルドに時間がかかる

**解決方法**:

```bash
# Dockerのリソース割り当てを確認・増やす
# Docker Desktop > Settings > Resources

# 不要なコンテナとイメージを削除
docker system prune -a

# ボリュームを削除（データは失われます）
docker volume prune
```

### 9. ログが表示されない

**症状**: `docker compose logs`でログが表示されない

**解決方法**:

```bash
# リアルタイムでログを表示
docker compose logs -f

# 最新100行のログを表示
docker compose logs --tail=100

# 特定のサービスのログのみ表示
docker compose logs -f frontend
```

### 10. TypeScriptのエラー

**症状**: TypeScriptのコンパイルエラーが発生する

**解決方法**:

```bash
# フロントエンドの型チェック
docker compose exec frontend npx tsc --noEmit

# バックエンドの型チェック
docker compose exec backend npx tsc --noEmit

# node_modulesを再インストール
docker compose exec frontend npm install
docker compose exec backend npm install
```

## よくある質問（FAQ）

### Q1. 初回起動に時間がかかるのはなぜですか？

A. 初回起動時は以下の処理が実行されるため、数分かかります：
- Dockerイメージのビルド
- Node.jsの依存パッケージのインストール（npm install）
- データベースの初期化

2回目以降は、キャッシュが使用されるため高速に起動します。

### Q2. コンテナを停止するとデータは消えますか？

A. `docker compose down`でコンテナを停止しても、データベースのデータは保持されます。ボリュームに永続化されているためです。

ただし、`docker compose down -v`を実行すると、ボリュームも削除されるためデータが失われます。

### Q3. ソースコードを変更したら自動的に反映されますか？

A. はい、Hot Reload機能により自動的に反映されます：
- **フロントエンド**: ファイル保存時に自動的にブラウザがリロードされます
- **バックエンド**: ファイル保存時に自動的にサーバーが再起動されます

### Q4. 本番環境にデプロイできますか？

A. 現在の設定は開発環境用です。本番環境にデプロイする場合は、以下の対応が必要です：
- 環境変数の見直し（強力なパスワード、適切なホスト名）
- docker-compose.prod.ymlの作成
- セキュリティ設定の強化
- SSL/TLS証明書の設定
- ログ管理とモニタリングの設定

### Q5. Dockerを使わずに開発できますか？

A. 可能ですが、推奨しません。Dockerを使用することで：
- 環境の一貫性が保証される
- セットアップが簡単
- チーム全体で同じ環境を共有できる

ローカル開発する場合は、Node.js 22とPostgreSQL 17を手動でインストールする必要があります。

### Q6. コンテナのリソース使用量を確認するには？

A. 以下のコマンドで確認できます：

```bash
# リアルタイムでリソース使用量を表示
docker stats

# 特定のコンテナのみ表示
docker stats tama-frontend tama-backend tama-database
```

### Q7. 複数の開発者で同時に開発できますか？

A. はい、各開発者が自分のマシンでコンテナを起動できます。ポート番号が競合しないように注意してください。

### Q8. テストはどのように実行しますか？

A. プロパティベーステストとフロントエンドのテストがあります：

```bash
# プロパティベーステスト
./tests/property-tests/test-*.sh

# フロントエンドのテスト
docker compose exec frontend npm test
```

詳細は[開発ガイド](.kiro/steering/development-guide.md)を参照してください。

## ドキュメント

### プロジェクトドキュメント

- [要件定義書](.kiro/specs/001-docker-infrastructure/requirements.md) - システム要件の詳細
- [設計書](.kiro/specs/001-docker-infrastructure/design.md) - アーキテクチャと設計の詳細
- [実装計画](.kiro/specs/001-docker-infrastructure/tasks.md) - 実装タスクの一覧

### 開発ガイドライン

- [開発ガイド](.kiro/steering/development-guide.md) - 開発コマンドとテスト方法
- [Angularガイドライン](.kiro/steering/angular-guidelines.md) - Angular 20の開発ガイドライン
- [Swaggerガイドライン](.kiro/steering/swagger-guidelines.md) - Swagger/OpenAPIの使用方法
- [プロジェクト規約](.kiro/steering/project-conventions.md) - コーディング規約とプロジェクトルール

## 参考リンク

### 公式ドキュメント

- [Angular公式ドキュメント](https://angular.dev/) - Angular 20の最新機能とAPI
- [NestJS公式ドキュメント](https://nestjs.com/) - NestJS 11のガイドとチュートリアル
- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/) - PostgreSQL 17のリファレンス
- [Docker公式ドキュメント](https://docs.docker.com/) - Dockerの使い方とベストプラクティス
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/) - Docker Composeのリファレンス

### 学習リソース

- [Angular Signals](https://angular.dev/guide/signals) - Signalsの詳細ガイド
- [Angular Zoneless](https://angular.dev/guide/experimental/zoneless) - Zonelessモードの説明
- [NestJS Fundamentals](https://docs.nestjs.com/first-steps) - NestJSの基礎
- [TypeORM Documentation](https://typeorm.io/) - データベースORMの使い方

## 貢献ガイド

このプロジェクトへの貢献を歓迎します！

### 開発フロー

1. 機能ブランチを作成
2. 変更を実装
3. テストを実行して確認
4. コミットメッセージは日本語で記述
5. プルリクエストを作成

### コーディング規約

- コード内の変数名、関数名、クラス名は英語を使用
- コメントとドキュメントは日本語で記述
- TypeScriptの型を適切に使用
- Angularコンポーネントは必ずSignalsを使用
- コミット前に型チェックとフォーマットを実行

詳細は[プロジェクト規約](.kiro/steering/project-conventions.md)を参照してください。

## サポート

### 問題が発生した場合

1. まず[トラブルシューティング](#トラブルシューティング)セクションを確認
2. [よくある質問](#よくある質問faq)を確認
3. ログを確認: `docker compose logs -f`
4. それでも解決しない場合は、Issueを作成

### 有用なコマンド

```bash
# システム情報の確認
docker version
docker compose version
node --version

# Dockerのクリーンアップ
docker system prune -a
docker volume prune

# コンテナの詳細情報
docker compose config
docker inspect tama-frontend
```

## ライセンス

このプロジェクトは私的利用のためのものです。

---

**最終更新**: 2025年11月20日  
**バージョン**: 1.0.0  
**メンテナー**: TAMA開発チーム
