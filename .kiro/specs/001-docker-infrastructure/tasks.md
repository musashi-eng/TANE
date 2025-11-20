# 実装計画

- [x] 1. プロジェクト構造とGit設定の作成
  - ディレクトリ構造を作成（docker/frontend、docker/backend、docker/postgres、frontend、backend）
  - .gitignoreファイルを作成し、.envファイルを除外対象に追加
  - .env.exampleファイルを作成し、必要な環境変数のテンプレートを提供
  - _要件: 11.1, 11.2, 11.6, 11.7, 6.5_

- [x] 1.1 プロパティテスト: ディレクトリ構造の完全性
  - **プロパティ13: ディレクトリ構造の完全性**
  - **検証要件: 要件11.1, 11.2, 11.6, 11.7**

- [x] 1.2 プロパティテスト: .gitignore設定
  - **プロパティ14: .gitignore設定**
  - **検証要件: 要件6.5**

- [ ] 2. 環境変数ファイルの作成
  - .envファイルを作成し、開発環境用のデフォルト値を設定
  - データベース接続情報（HOST、PORT、USER、PASSWORD、NAME）を定義
  - Node環境変数（NODE_ENV）を定義
  - API URL設定を定義
  - _要件: 6.1, 6.2, 6.3, 6.4_

- [ ] 3. Docker Compose設定ファイルの作成
  - docker-compose.ymlファイルをプロジェクトルートに作成
  - バージョン3.8以上の構文を使用
  - 3つのサービス（frontend、backend、database）を定義
  - ネットワーク（app-network）を定義
  - ボリューム（postgres-data、frontend-node-modules、backend-node-modules）を定義
  - _要件: 1.1, 1.4, 1.5, 5.1, 7.1, 7.2, 7.3_

- [ ] 3.1 プロパティテスト: Docker Compose設定ファイルの存在と配置
  - **プロパティ1: Docker Compose設定ファイルの存在と配置**
  - **検証要件: 要件1.4, 1.5**

- [ ] 3.2 プロパティテスト: 3つのサービス定義
  - **プロパティ2: 3つのサービス定義**
  - **検証要件: 要件1.1**

- [ ] 3.3 プロパティテスト: ネットワーク設定の一貫性
  - **プロパティ6: ネットワーク設定の一貫性**
  - **検証要件: 要件5.1**

- [ ] 3.4 プロパティテスト: ボリューム定義の完全性
  - **プロパティ4: ボリューム定義の完全性**
  - **検証要件: 要件7.1, 7.2, 7.3**

- [ ] 4. Database Container設定
  - docker-compose.ymlにdatabaseサービスを設定
  - PostgreSQL 17の公式イメージ（postgres:17-alpine）を指定
  - ポート5432をホストにバインド
  - 環境変数（POSTGRES_USER、POSTGRES_PASSWORD、POSTGRES_DB）を.envから読み込み
  - postgres-dataボリュームをマウント
  - ヘルスチェック（pg_isready）を設定（30秒間隔、3回リトライ）
  - 再起動ポリシー（unless-stopped）を設定
  - _要件: 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3, 9.5, 10.3_

- [ ] 4.1 プロパティテスト: PostgreSQLイメージバージョン
  - **プロパティ12: PostgreSQLイメージバージョン**
  - **検証要件: 要件10.3**

- [ ] 4.2 プロパティテスト: データベースヘルスチェックの設定
  - **プロパティ8: データベースヘルスチェックの設定**
  - **検証要件: 要件8.1, 8.2, 8.3**

- [ ] 4.3 プロパティテスト: 再起動ポリシー
  - **プロパティ15: 再起動ポリシー**
  - **検証要件: 要件9.5**

- [ ] 5. PostgreSQL初期化スクリプトの作成
  - docker/postgres/init/ディレクトリを作成
  - 01-init.sqlファイルを作成し、基本的なスキーマを定義
  - docker-compose.ymlで初期化スクリプトをマウント
  - _要件: 11.5_

- [ ] 6. Frontend Dockerfileの作成
  - docker/frontend/Dockerfileを作成
  - Node.js 20の公式イメージ（node:20-alpine）をベースとする
  - マルチステージビルドを使用（開発ステージ）
  - 作業ディレクトリを/appに設定
  - package.jsonとpackage-lock.jsonをコピー
  - npm installで依存パッケージをインストール
  - ソースコードをコピー
  - ポート4200を公開
  - 起動コマンド（npm start）を設定
  - _要件: 10.1, 10.4, 10.5_

- [ ] 7. Frontend .dockerignoreの作成
  - docker/frontend/.dockerignoreを作成
  - node_modules、dist、.git、ログファイルを除外
  - _要件: 設計書の実装上の注意事項_

- [ ] 7.1 プロパティテスト: Dockerfileの存在と配置（Frontend）
  - **プロパティ10: Dockerfileの存在と配置（Frontend部分）**
  - **検証要件: 要件11.3**

- [ ] 7.2 プロパティテスト: Dockerfileのベースイメージ（Frontend）
  - **プロパティ11: Dockerfileのベースイメージ（Frontend部分）**
  - **検証要件: 要件10.1**

- [ ] 8. Frontend Container設定
  - docker-compose.ymlにfrontendサービスを設定
  - docker/frontend/Dockerfileからビルド
  - ポート4200をホストにバインド
  - ./frontendディレクトリを/appにマウント
  - frontend-node-modulesボリュームを/app/node_modulesにマウント
  - 環境変数（NODE_ENV、API_URL）を設定
  - app-networkに接続
  - 再起動ポリシー（unless-stopped）を設定
  - _要件: 2.1, 2.2, 2.4, 2.5, 2.6, 9.1, 9.5_

- [ ] 8.1 プロパティテスト: ポートマッピングの正確性（Frontend）
  - **プロパティ3: ポートマッピングの正確性（Frontend部分）**
  - **検証要件: 要件2.1**

- [ ] 8.2 プロパティテスト: ソースコードマウントの正確性（Frontend）
  - **プロパティ5: ソースコードマウントの正確性（Frontend部分）**
  - **検証要件: 要件2.5, 11.9**

- [ ] 9. Backend Dockerfileの作成
  - docker/backend/Dockerfileを作成
  - Node.js 20の公式イメージ（node:20-alpine）をベースとする
  - マルチステージビルドを使用（開発ステージ）
  - 作業ディレクトリを/appに設定
  - package.jsonとpackage-lock.jsonをコピー
  - npm installで依存パッケージをインストール
  - ソースコードをコピー
  - ポート3000と9229を公開
  - 起動コマンド（npm run start:dev）を設定
  - _要件: 10.2, 10.4, 10.5_

- [ ] 10. Backend .dockerignoreの作成
  - docker/backend/.dockerignoreを作成
  - node_modules、dist、.git、ログファイルを除外
  - _要件: 設計書の実装上の注意事項_

- [ ] 10.1 プロパティテスト: Dockerfileの存在と配置（Backend）
  - **プロパティ10: Dockerfileの存在と配置（Backend部分）**
  - **検証要件: 要件11.4**

- [ ] 10.2 プロパティテスト: Dockerfileのベースイメージ（Backend）
  - **プロパティ11: Dockerfileのベースイメージ（Backend部分）**
  - **検証要件: 要件10.2**

- [ ] 11. Backend Container設定
  - docker-compose.ymlにbackendサービスを設定
  - docker/backend/Dockerfileからビルド
  - ポート3000と9229をホストにバインド
  - ./backendディレクトリを/appにマウント
  - backend-node-modulesボリュームを/app/node_modulesにマウント
  - 環境変数（NODE_ENV、DATABASE_*）を設定
  - databaseサービスへの依存関係（depends_on）を設定
  - app-networkに接続
  - 再起動ポリシー（unless-stopped）を設定
  - _要件: 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 8.4, 9.2, 9.5_

- [ ] 11.1 プロパティテスト: ポートマッピングの正確性（Backend）
  - **プロパティ3: ポートマッピングの正確性（Backend部分）**
  - **検証要件: 要件3.1, 9.2**

- [ ] 11.2 プロパティテスト: ソースコードマウントの正確性（Backend）
  - **プロパティ5: ソースコードマウントの正確性（Backend部分）**
  - **検証要件: 要件3.5, 11.9**

- [ ] 11.3 プロパティテスト: 環境変数の提供
  - **プロパティ7: 環境変数の提供**
  - **検証要件: 要件3.7, 6.2**

- [ ] 11.4 プロパティテスト: サービス依存関係の定義
  - **プロパティ9: サービス依存関係の定義**
  - **検証要件: 要件8.4**

- [ ] 12. Angular20プロジェクトの初期化
  - frontendディレクトリにAngular20プロジェクトを作成
  - package.jsonを作成し、Angular 20の依存パッケージを定義
  - angular.jsonを作成し、ビルド設定を定義
  - tsconfig.jsonを作成し、TypeScript設定を定義
  - src/ディレクトリに基本的なアプリケーション構造を作成
  - ソースマップを有効化（angular.json）
  - _要件: 2.2, 9.1, 11.6_

- [ ] 13. NestJS11プロジェクトの初期化
  - backendディレクトリにNestJS11プロジェクトを作成
  - package.jsonを作成し、NestJS 11の依存パッケージを定義
  - nest-cli.jsonを作成し、CLI設定を定義
  - tsconfig.jsonを作成し、TypeScript設定を定義
  - src/ディレクトリに基本的なアプリケーション構造を作成
  - データベース接続モジュールを作成（環境変数から接続情報を取得）
  - ヘルスチェックエンドポイント（/health）を作成
  - _要件: 3.2, 3.7, 11.7_

- [ ] 14. チェックポイント - 全テストの実行と動作確認
  - 全てのプロパティテストを実行し、合格を確認
  - docker compose upコマンドで全てのコンテナを起動
  - docker compose psコマンドでコンテナの状態を確認
  - ブラウザでhttp://localhost:4200にアクセスし、Angularアプリケーションが表示されることを確認
  - http://localhost:3000/healthにアクセスし、NestJSのヘルスチェックが成功することを確認
  - docker compose logsコマンドでログを確認
  - docker compose downコマンドでコンテナを停止
  - 問題があれば、ユーザーに質問する
  - _要件: 1.1, 1.2, 1.3, 9.4_

- [ ] 14.1 統合テスト: コンテナ間通信の確認
  - Frontend → Backend の通信確認
  - Backend → Database の通信確認
  - _要件: 2.6, 3.6, 5.2, 5.3_

- [ ] 14.2 統合テスト: データ永続化の確認
  - コンテナ再起動後のデータ保持を確認
  - _要件: 4.5, 7.4_

- [ ] 15. READMEドキュメントの作成
  - README.mdファイルを作成
  - プロジェクト概要を記載
  - 環境構築手順を記載（docker compose up -d）
  - 各コンテナへのアクセス方法を記載
  - トラブルシューティングガイドを記載
  - 環境変数の説明を記載
  - _要件: 設計書の実装上の注意事項_
