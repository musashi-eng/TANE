# 要件定義書

## はじめに

本ドキュメントは、Angular20、NestJS11、PostgreSQL17を使用したコンテナベースのアプリケーション基盤の要件を定義します。この基盤は、フロントエンド、バックエンド、データベースの3層アーキテクチャを提供し、開発環境の迅速な立ち上げと一貫性のある実行環境を実現します。

## 用語集

- **Docker Compose**: 複数のDockerコンテナを定義・実行するためのツール
- **Frontend Container**: Angular20アプリケーションを実行するコンテナ
- **Backend Container**: NestJS11アプリケーションを実行するコンテナ
- **Database Container**: PostgreSQL17データベースを実行するコンテナ
- **Volume**: コンテナのデータを永続化するためのDocker機能
- **Network**: コンテナ間の通信を可能にするDocker機能
- **Hot Reload**: コード変更時に自動的にアプリケーションを再起動する機能
- **Docker Directory**: プロジェクトルートのdockerディレクトリで、各コンテナの設定ファイルを格納する

## 要件

### 要件1: Docker Compose設定

**ユーザーストーリー:** 開発者として、単一のコマンドで全てのコンテナを起動できるようにしたい。そうすることで、環境構築の手間を削減し、開発に集中できる。

#### 受入基準

1. WHEN 開発者が `docker compose up -d` コマンドを実行する THEN システムは3つのコンテナ（Frontend、Backend、Database）を起動する
2. WHEN 開発者が `docker compose down` コマンドを実行する THEN システムは全てのコンテナを停止し、ネットワークを削除する
3. WHEN 開発者が `docker compose ps` コマンドを実行する THEN システムは全てのコンテナの状態を表示する
4. THE Docker Compose設定ファイルはプロジェクトルートに配置される
5. THE Docker Compose設定ファイルはバージョン3.8以上の構文を使用する

### 要件2: Frontendコンテナ

**ユーザーストーリー:** 開発者として、Angular20アプリケーションを実行するコンテナが必要である。そうすることで、フロントエンド開発を行える。

#### 受入基準

1. THE Frontend Containerはポート4200でホストマシンにバインドされる
2. WHEN Frontend Containerが起動する THEN システムはAngular開発サーバーを自動的に起動する
3. WHEN ソースコードが変更される THEN システムはHot Reload機能により自動的にアプリケーションを再読み込みする
4. THE Frontend Containerはプロジェクトルートのfrontendディレクトリをマウントする
5. THE Frontend Containerはバックエンドコンテナと通信できる

### 要件3: Backendコンテナ

**ユーザーストーリー:** 開発者として、NestJS11アプリケーションを実行するコンテナが必要である。そうすることで、バックエンドAPI開発を行える。

#### 受入基準

1. THE Backend Containerはポート3000でホストマシンにバインドされる
2. WHEN Backend Containerが起動する THEN システムはNestJS開発サーバーを自動的に起動する
3. WHEN ソースコードが変更される THEN システムはHot Reload機能により自動的にアプリケーションを再起動する
4. THE Backend Containerはプロジェクトルートのbackendディレクトリをマウントする
5. THE Backend ContainerはDatabase Containerと通信できる
6. THE Backend Containerはデータベース接続情報を環境変数から取得する

### 要件4: Databaseコンテナ

**ユーザーストーリー:** 開発者として、PostgreSQL17データベースを実行するコンテナが必要である。そうすることで、データの永続化とクエリ実行を行える。

#### 受入基準

1. THE Database Containerはポート5432でホストマシンにバインドされる
2. THE Database Containerはデータベースデータを永続化ボリュームに保存する
3. WHEN Database Containerが初回起動する THEN システムは指定されたデータベース名でデータベースを作成する
4. THE Database Containerは認証情報を環境変数から取得する
5. WHEN コンテナが削除される THEN システムはデータベースデータをボリュームに保持する

### 要件5: ネットワーク構成

**ユーザーストーリー:** 開発者として、コンテナ間で安全に通信できるネットワークが必要である。そうすることで、各サービスが連携して動作できる。

#### 受入基準

1. THE システムは全てのコンテナを同一のDockerネットワークに配置する
2. WHEN Backend ContainerがDatabase Containerに接続する THEN システムはコンテナ名による名前解決を提供する
3. WHEN Frontend ContainerがBackend Containerに接続する THEN システムはコンテナ名による名前解決を提供する
4. THE システムは外部からのアクセスを必要なポートのみに制限する

### 要件6: 環境変数管理

**ユーザーストーリー:** 開発者として、環境固有の設定を環境変数で管理したい。そうすることで、異なる環境での設定変更が容易になる。

#### 受入基準

1. THE システムは環境変数を.envファイルから読み込む
2. THE システムはデータベース接続情報（ホスト、ポート、ユーザー名、パスワード、データベース名）を環境変数として提供する
3. THE システムはNode環境（development/production）を環境変数として提供する
4. WHEN .envファイルが存在しない THEN システムはデフォルト値を使用する
5. THE .envファイルはバージョン管理から除外される

### 要件7: ボリューム管理

**ユーザーストーリー:** 開発者として、データを適切に管理したい。そうすることで、データの永続性を確保できる。

#### 受入基準

1. THE システムはPostgreSQLデータ用の名前付きボリュームを作成する
2. WHEN コンテナが再起動される THEN システムはボリュームのデータを保持する
3. WHEN 開発者がボリュームを削除する THEN システムは `docker compose down -v` コマンドで全てのボリュームを削除する

### 要件8: ヘルスチェック

**ユーザーストーリー:** 開発者として、各コンテナの健全性を確認したい。そうすることで、問題を早期に発見できる。

#### 受入基準

1. THE Database Containerはpg_isreadyコマンドによるヘルスチェックを実装する
2. WHEN Database Containerが起動する THEN システムは30秒間隔でヘルスチェックを実行する
3. WHEN ヘルスチェックが3回連続で失敗する THEN システムはコンテナを異常状態とマークする
4. THE Backend Containerはデータベースの準備完了を待機してから起動する

### 要件9: 開発環境の最適化

**ユーザーストーリー:** 開発者として、快適な開発体験を得たい。そうすることで、生産性を向上できる。

#### 受入基準

1. THE Frontend Containerはソースマップを有効化する
2. THE Backend Containerはデバッグポート9229を公開する
3. THE システムはコンテナログを標準出力に出力する
4. WHEN 開発者が `docker compose logs -f` コマンドを実行する THEN システムはリアルタイムでログを表示する
5. THE システムはコンテナの再起動ポリシーをunless-stoppedに設定する

### 要件10: Dockerfile構成

**ユーザーストーリー:** 開発者として、各サービスのDockerイメージを適切に構築したい。そうすることで、一貫性のある実行環境を提供できる。

#### 受入基準

1. THE Frontend ContainerはNode.js 20の公式イメージをベースとする
2. THE Backend ContainerはNode.js 20の公式イメージをベースとする
3. THE Database ContainerはPostgreSQL 17の公式イメージを使用する
4. THE Frontend DockerfileとBackend Dockerfileはマルチステージビルドを使用する
5. WHEN Dockerfileが実行される THEN システムは依存パッケージを自動的にインストールする

### 要件11: ディレクトリ構成

**ユーザーストーリー:** 開発者として、Docker関連ファイルとアプリケーションソースコードを明確に分離して管理したい。そうすることで、保守性と可読性を向上できる。

#### 受入基準

1. THE システムはプロジェクトルートにdockerディレクトリを配置する
2. THE Docker Directoryはfrontend、backend、postgresのサブディレクトリを含む
3. THE docker/frontendディレクトリはFrontend Container用のDockerfileと関連設定ファイルを格納する
4. THE docker/backendディレクトリはBackend Container用のDockerfileと関連設定ファイルを格納する
5. THE docker/postgresディレクトリはDatabase Container用の初期化スクリプトと設定ファイルを格納する
6. THE システムはプロジェクトルートにfrontendディレクトリを配置し、Angular20のソースコードを格納する
7. THE システムはプロジェクトルートにbackendディレクトリを配置し、NestJS11のソースコードを格納する
8. THE docker-compose.ymlファイルはプロジェクトルートに配置される
9. THE docker-compose.ymlファイルはルートのfrontendディレクトリとbackendディレクトリをコンテナにマウントする
