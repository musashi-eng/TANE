# GitHubテンプレートリポジトリの設定方法

このドキュメントでは、TANEをGitHubのテンプレートリポジトリとして設定する方法を説明します。

## 前提条件

- GitHubアカウントを持っていること
- TANEリポジトリをGitHubにプッシュ済みであること

## 設定手順

### 1. GitHubリポジトリにアクセス

ブラウザでGitHubリポジトリを開きます。

```
https://github.com/your-username/tane
```

### 2. Settings（設定）を開く

リポジトリページの上部にある「**Settings**」タブをクリックします。

### 3. Template repository を有効化

1. Settingsページの「**General**」セクションを開きます
2. 「**Template repository**」セクションを見つけます
3. 「**Template repository**」のチェックボックスにチェックを入れます
4. 変更が自動的に保存されます

### 4. 確認

リポジトリのトップページに戻ると、「**Use this template**」ボタンが表示されるようになります。

## テンプレートの使用方法

### 新しいプロジェクトを作成する

1. リポジトリページで「**Use this template**」ボタンをクリック
2. 「**Create a new repository**」を選択
3. 新しいリポジトリ名を入力
4. Public/Privateを選択
5. 「**Create repository**」をクリック

### ローカルで開発を開始する

```bash
# 新しいリポジトリをクローン
git clone https://github.com/your-username/your-new-project.git
cd your-new-project

# 初期化スクリプトを実行
./scripts/setup.sh
```

プロジェクト名を入力すると、自動的に以下が実行されます：
- プロジェクト名の置換
- 環境変数ファイルの生成
- Dockerコンテナの起動
- 依存パッケージのインストール
- ヘルスチェック

## GitHub Secretsの設定（デプロイ用）

CI/CDを使用する場合は、以下のSecretsを設定してください。

### 設定手順

1. リポジトリの「**Settings**」→「**Secrets and variables**」→「**Actions**」を開く
2. 「**New repository secret**」をクリック
3. 以下のSecretsを追加

### 必要なSecrets

#### AWS認証情報

- `AWS_ACCESS_KEY_ID` - AWSアクセスキーID
- `AWS_SECRET_ACCESS_KEY` - AWSシークレットアクセスキー
- `AWS_REGION` - AWSリージョン（例: ap-northeast-1）

#### テスト環境

- `TEST_EC2_INSTANCE_ID` - テスト環境のEC2インスタンスID
- `TEST_DEPLOY_PATH` - テスト環境のデプロイパス（例: /home/ubuntu/app）

#### 本番環境

- `PROD_EC2_INSTANCE_ID` - 本番環境のEC2インスタンスID
- `PROD_DEPLOY_PATH` - 本番環境のデプロイパス（例: /home/ubuntu/app）

## ブランチ戦略

### 推奨ブランチ構成

- `main` - 本番環境（mainへのプッシュで自動デプロイ）
- `test` - テスト環境（testへのプッシュで自動デプロイ）
- `develop` - 開発環境（CI/CDのみ実行）
- `feature/*` - 機能開発ブランチ

### ワークフロー

1. `feature/*`ブランチで開発
2. `develop`にマージしてCI/CDを確認
3. `test`にマージしてテスト環境で動作確認
4. `main`にマージして本番環境にデプロイ

## トラブルシューティング

### "Use this template"ボタンが表示されない

- リポジトリがPublicであることを確認
- Settings で Template repository が有効になっていることを確認
- ブラウザのキャッシュをクリアして再読み込み

### CI/CDが失敗する

- GitHub Secretsが正しく設定されているか確認
- EC2インスタンスにSSM Agentがインストールされているか確認
- IAMロールに必要な権限があるか確認

## 参考リンク

- [GitHub Template Repositories 公式ドキュメント](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)
- [GitHub Actions 公式ドキュメント](https://docs.github.com/en/actions)
- [AWS Systems Manager 公式ドキュメント](https://docs.aws.amazon.com/systems-manager/)
