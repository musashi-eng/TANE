# デプロイガイド

このガイドでは、TANEプロジェクトのデプロイ方法を説明します。

## デプロイ環境

TANEは以下の環境へのデプロイをサポートしています：

- **テスト環境** - 開発チームによる動作確認用
- **本番環境** - エンドユーザー向けの本番サービス

## 前提条件

### サーバー要件

- **OS**: Ubuntu 22.04 LTS以上
- **Docker**: 24.0以上
- **Docker Compose**: 2.0以上
- **メモリ**: 最低2GB（推奨4GB以上）
- **ディスク**: 最低10GB（推奨20GB以上）

### AWS要件

- **EC2インスタンス** - アプリケーションサーバー
- **RDS PostgreSQL** - データベース（推奨）
- **ALB** - ロードバランサー（推奨）
- **SSM** - デプロイ自動化用

### GitHub Secrets

以下のシークレットをGitHubリポジトリに設定する必要があります：

```
AWS_ACCESS_KEY_ID          # AWSアクセスキーID
AWS_SECRET_ACCESS_KEY      # AWSシークレットアクセスキー
AWS_REGION                 # AWSリージョン（例: ap-northeast-1）
TEST_EC2_INSTANCE_ID       # テスト環境のEC2インスタンスID
TEST_DEPLOY_PATH           # テスト環境のデプロイパス
PROD_EC2_INSTANCE_ID       # 本番環境のEC2インスタンスID
PROD_DEPLOY_PATH           # 本番環境のデプロイパス
```

詳細は[GitHub Template設定ガイド](github-template-setup.md)を参照してください。

## サーバーの初期セットアップ

### 1. Dockerのインストール

EC2インスタンスに初めてデプロイする場合は、Dockerをインストールしてください：

```bash
# Dockerの公式インストールスクリプトを使用
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 現在のユーザーをdockerグループに追加
sudo usermod -aG docker $USER

# ログアウトして再ログイン（グループ変更を反映）
```

### 2. リポジトリのクローン

```bash
# リポジトリをクローン
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

### 3. 環境変数ファイルの作成

サーバー上で環境変数ファイルを作成します：

```bash
# .envファイルを作成
nano .env
```

以下の内容を設定します：

```bash
# プロジェクト設定
PROJECT_NAME=your-project-name
NODE_ENV=production  # または test

# タイムゾーン設定
TZ=Asia/Tokyo

# データベース設定（RDS）
DATABASE_HOST=your-rds-endpoint.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name

# JWT設定
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=1d

# API設定
API_URL=https://your-domain.com

# ポート設定
BACKEND_PORT=3000
FRONTEND_PORT=80

# Swagger設定（本番環境では無効化）
SWAGGER_ENABLED=false
```

## デプロイ方法

### 手動デプロイ

サーバーにSSH接続して、デプロイスクリプトを実行します：

```bash
# テスト環境へのデプロイ
./scripts/deploy.sh test

# 本番環境へのデプロイ
./scripts/deploy.sh prod
```

デプロイスクリプトは以下を自動的に実行します：

1. Gitから最新コードを取得
2. 環境変数ファイルの存在確認
3. Dockerイメージのビルド（キャッシュなし）
4. コンテナの再作成と起動
5. ヘルスチェック（最大180秒待機）
6. 古いDockerイメージのクリーンアップ

### 自動デプロイ（GitHub Actions）

GitHub Actionsを使用した自動デプロイが設定されています：

#### テスト環境への自動デプロイ

```bash
# testブランチにプッシュ
git checkout test
git merge main
git push origin test
```

GitHub Actionsが自動的に以下を実行します：

1. AWS SSMを使用してEC2インスタンスに接続
2. リポジトリの最新コードを取得
3. デプロイスクリプトを実行
4. デプロイ結果を通知

#### 本番環境への自動デプロイ

```bash
# mainブランチにプッシュ
git checkout main
git push origin main
```

本番環境へのデプロイも同様に自動実行されます。

## デプロイ後の確認

### ヘルスチェック

```bash
# ヘルスチェックエンドポイントにアクセス
curl https://your-domain.com/health
```

正常な場合のレスポンス：

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

### コンテナの状態確認

```bash
# コンテナの状態を確認
docker compose -f docker-compose.prod.yml ps

# ログを確認
docker compose -f docker-compose.prod.yml logs -f
```

### ALBヘルスチェック

ALBを使用している場合、以下を確認してください：

- ターゲットグループのヘルスチェックが成功している
- ヘルスチェックパス: `/health`
- ヘルスチェック間隔: 30秒
- 正常しきい値: 2回
- 異常しきい値: 2回

## サーバー再起動時の自動起動

コンテナは`restart: unless-stopped`ポリシーで設定されているため、サーバー再起動時に自動的に起動します。

```bash
# サーバーを再起動
sudo reboot

# 再起動後、コンテナが自動起動することを確認
docker compose -f docker-compose.prod.yml ps
```

## トラブルシューティング

### デプロイが失敗する

```bash
# ログを確認
docker compose -f docker-compose.prod.yml logs --tail=100

# コンテナの状態を確認
docker compose -f docker-compose.prod.yml ps

# 環境変数を確認
cat .env
```

### データベース接続エラー

```bash
# RDSへの接続を確認
docker compose -f docker-compose.prod.yml exec backend \
  psql -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME

# セキュリティグループを確認
# - EC2からRDSへの5432ポートが開いているか確認
```

### ヘルスチェックが失敗する

```bash
# バックエンドコンテナのログを確認
docker compose -f docker-compose.prod.yml logs backend

# ヘルスチェックエンドポイントに直接アクセス
curl http://localhost:3000/health

# ポート設定を確認
echo $BACKEND_PORT
```

### コンテナが起動しない

```bash
# イメージを再ビルド
docker compose -f docker-compose.prod.yml build --no-cache

# コンテナを再作成
docker compose -f docker-compose.prod.yml up -d --force-recreate

# ディスク容量を確認
df -h

# 不要なイメージを削除
docker image prune -a
```

## ロールバック

問題が発生した場合は、以前のバージョンにロールバックできます：

```bash
# 以前のコミットに戻す
git checkout <previous-commit-hash>

# デプロイスクリプトを実行
./scripts/deploy.sh prod
```

## セキュリティ

### 環境変数の管理

- `.env`ファイルは絶対にGitにコミットしない
- 本番環境のシークレットは定期的に更新する
- AWS Secrets Managerの使用を検討する

### ファイアウォール設定

```bash
# UFWを有効化
sudo ufw enable

# 必要なポートのみ開放
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# 状態を確認
sudo ufw status
```

### SSL/TLS証明書

本番環境では必ずHTTPSを使用してください：

- Let's Encryptを使用した無料SSL証明書
- AWS Certificate Managerを使用したALB経由のSSL

## モニタリング

### ログの確認

```bash
# リアルタイムでログを確認
docker compose -f docker-compose.prod.yml logs -f

# 特定のコンテナのログを確認
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend

# 最新100行のログを確認
docker compose -f docker-compose.prod.yml logs --tail=100
```

### リソース使用状況

```bash
# コンテナのリソース使用状況を確認
docker stats

# ディスク使用状況を確認
df -h

# メモリ使用状況を確認
free -h
```

## バックアップ

### データベースバックアップ

```bash
# RDSの自動バックアップを有効化
# - バックアップ保持期間: 7日以上推奨
# - バックアップウィンドウ: 低トラフィック時間帯

# 手動バックアップ
docker compose -f docker-compose.prod.yml exec backend \
  pg_dump -h $DATABASE_HOST -U $DATABASE_USER $DATABASE_NAME > backup.sql
```

## パフォーマンス最適化

### Dockerイメージの最適化

- マルチステージビルドを使用（既に実装済み）
- 不要なファイルを除外（.dockerignore）
- レイヤーキャッシュを活用

### データベースの最適化

- インデックスの適切な設定
- クエリの最適化
- コネクションプーリングの設定

## 次のステップ

- [開発ガイド](development.md) - 開発方法とよく使うコマンド
- [アーキテクチャ](architecture.md) - プロジェクトの構造と設計
- [GitHub Template設定ガイド](github-template-setup.md) - CI/CD設定

## サポート

デプロイに関する問題が発生した場合は、[イシュー](https://github.com/musashi-eng/TANE/issues)を作成してください。
