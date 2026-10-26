# Changelog

このファイルには、プロジェクトの重要な変更がすべて記録されます。

フォーマットは[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)に基づいており、
このプロジェクトは[セマンティックバージョニング](https://semver.org/lang/ja/)に準拠しています。

## [Unreleased]

### 変更
- Angular 20 → 22 へアップグレード（Zoneless + Signals は維持）
- NestJS 11 → 12 へアップグレード
- バックエンドのテスト基盤を Jest から Vitest へ移行（フロントエンドと統一）
- TypeScript: フロント 5.9 / バック 6、@types/node を 24 系へ更新

### 削除
- ng-zorro-antd を廃止（プロジェクト独自のデザインシステムを利用する方針へ）

### 追加
- 初回リリースに向けた準備

## [1.0.0] - 2025-11-21

### 追加
- Angular 20 (Zoneless + Signals) フロントエンド
- NestJS 11 バックエンド
- PostgreSQL 17 データベース
- Docker + Docker Compose 環境
- GitHub Actions CI/CD
- Swagger/OpenAPI ドキュメント
- ヘルスチェックエンドポイント
- 初期化スクリプト (setup.sh)
- デプロイスクリプト (deploy.sh)
- 環境別設定 (開発・テスト・本番)
- イシュー・PRテンプレート
- 日本語ドキュメント

### 技術スタック
- **フロントエンド**: Angular 20, ng-zorro-antd, TypeScript 5.8
- **バックエンド**: NestJS 11, TypeORM, Swagger
- **データベース**: PostgreSQL 17
- **インフラ**: Docker, GitHub Actions, AWS SSM

[Unreleased]: https://github.com/your-username/your-project-name/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-username/your-project-name/releases/tag/v1.0.0
