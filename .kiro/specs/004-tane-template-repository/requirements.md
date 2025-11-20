# TANE テンプレートリポジトリ化

## 概要

現在のTAMAプロジェクトを、再利用可能なテンプレートリポジトリ「TANE (Template for Angular NestJS Environment)」として整備します。

## 目的

- Angular 20 + NestJS + PostgreSQL + Dockerの環境を簡単に再利用できるようにする
- 新規プロジェクト作成時の初期セットアップ時間を大幅に削減する
- ベストプラクティスに基づいた開発環境を提供する
- プロジェクト固有のコードを削除し、汎用的なテンプレートにする

## TANE とは

**TANE** = **T**emplate for **A**ngular **N**estJS **E**nvironment

プロジェクトの「種（たね）」という意味を込めた、フルスタックTypeScriptアプリケーションのテンプレートリポジトリです。

## 技術スタック

- **フロントエンド**: Angular 20 (Zoneless + Signals)
- **UIライブラリ**: ng-zorro-antd (Ant Design)
- **バックエンド**: NestJS
- **データベース**: PostgreSQL
- **コンテナ**: Docker + Docker Compose
- **言語**: TypeScript
- **テスト**: Jasmine + Karma (Frontend), Jest (Backend)
- **API ドキュメント**: Swagger/OpenAPI

## 受入基準

### AC1: プロジェクト名の変更

- [ ] すべてのファイルで「TAMA」「Tama」「tama」を「TANE」に変更
- [ ] package.json の name フィールドを更新
- [ ] docker-compose.yml のサービス名を更新
- [ ] README.md のプロジェクト名を更新
- [ ] 環境変数のプレフィックスを更新

### AC2: README の整備

- [ ] テンプレートリポジトリとしての使い方を明記
- [ ] TANE の説明（略語の意味）を追加
- [ ] クイックスタートガイドを作成
- [ ] 機能一覧を記載
- [ ] 技術スタックの詳細を記載
- [ ] ライセンス情報を追加

### AC3: 環境変数のテンプレート化

- [ ] .env.example を汎用的な内容に更新
- [ ] プロジェクト固有の値を削除
- [ ] 必須の環境変数を明記
- [ ] 各環境変数の説明をコメントで追加

### AC4: 初期化スクリプトの作成

- [ ] setup.sh スクリプトを作成
- [ ] プロジェクト名の一括置換機能
- [ ] 環境変数ファイルの自動生成
- [ ] Docker コンテナの初期化
- [ ] データベースのマイグレーション実行
- [ ] 依存パッケージのインストール

### AC5: サンプルコードの整理

- [ ] フロントエンドのサンプルコンポーネントを最小限に
- [ ] バックエンドのサンプルエンドポイントを最小限に
- [ ] Health Check エンドポイントは残す
- [ ] Swagger 設定は残す
- [ ] 基本的なCRUD操作のサンプルを残す

### AC6: ドキュメントの整備

- [ ] CONTRIBUTING.md を作成
- [ ] CHANGELOG.md を作成
- [ ] docs/ ディレクトリを作成
- [ ] アーキテクチャ図を追加
- [ ] デプロイガイドを作成

### AC7: CI/CD 設定

- [ ] GitHub Actions ワークフローを作成
  - [ ] .github/workflows/ci.yml（ビルド・テスト）
  - [ ] .github/workflows/deploy-test.yml（テスト環境デプロイ）
  - [ ] .github/workflows/deploy-production.yml（本番環境デプロイ）
- [ ] フロントエンドのビルド・テストを自動化
- [ ] バックエンドのビルド・テストを自動化
- [ ] Lintチェックを自動化
- [ ] 型チェックを自動化
- [ ] AWS SSM を使用したデプロイ設定（kuraプロジェクトを参考）

### AC8: デプロイ設定のサンプル

- [ ] 本番環境用の docker-compose.prod.yml を作成
  - [ ] PostgreSQLコンテナは含めない（既存DBを使用）
  - [ ] フロントエンドとバックエンドのみ
- [ ] テスト環境用の docker-compose.test.yml を作成
  - [ ] PostgreSQLコンテナは含めない（既存DBを使用）
  - [ ] フロントエンドとバックエンドのみ
- [ ] 開発環境用の docker-compose.yml
  - [ ] PostgreSQLコンテナを含める（開発用）
  - [ ] フロントエンド、バックエンド、PostgreSQL
- [ ] scripts/deploy.sh スクリプトを作成
  - [ ] 環境別デプロイ（prod/test）
  - [ ] ヘルスチェック機能
  - [ ] 自動ロールバック機能
  - [ ] ログ出力機能
- [ ] Dockerfile.prod を作成（フロントエンド・バックエンド）
- [ ] ヘルスチェックエンドポイントの実装
- [ ] データベース接続設定
  - [ ] .env から環境変数で接続情報を取得
  - [ ] 開発環境：Dockerコンテナ内のPostgreSQL
  - [ ] テスト・本番環境：既存の外部PostgreSQL

### AC9: GitHub Template 設定

- [ ] .github/ISSUE_TEMPLATE/ を作成
- [ ] .github/PULL_REQUEST_TEMPLATE.md を作成
- [ ] リポジトリをテンプレートとして設定する手順を記載

### AC10: クリーンアップ

- [ ] Tama 固有のコード・ファイルを削除
- [ ] 不要な依存パッケージを削除
- [ ] .gitignore を見直し
- [ ] 未使用のファイルを削除

## 制約条件

- 既存の開発ガイドライン（Angular、Swagger、プロジェクト規約）は維持する
- Docker 環境での動作を保証する
- 日本語ドキュメントを維持する
- Zoneless + Signals アーキテクチャを維持する
- **データベース環境の分離**
  - 開発環境：PostgreSQLコンテナを使用
  - テスト・本番環境：既存の外部PostgreSQLを使用（コンテナ不要）
  - すべての環境で.envファイルから接続情報を取得

## 非機能要件

- 初期化スクリプトは5分以内に完了すること
- README は初心者でも理解できる内容にすること
- すべてのスクリプトは bash で動作すること
- ドキュメントは日本語で記述すること

## 成功の定義

1. 新規プロジェクトを10分以内に立ち上げられる
2. README を読めば、初心者でもセットアップできる
3. GitHub でテンプレートリポジトリとして使用できる
4. CI/CD が正常に動作する
5. すべてのドキュメントが整備されている

## 参考資料

- [GitHub Template Repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)
- [Angular 20 Documentation](https://angular.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)
