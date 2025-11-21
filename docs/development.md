# 開発ガイド

このドキュメントでは、TANEプロジェクトの開発に必要なコマンドとベストプラクティスを説明します。

## 開発環境

### 前提条件

- Docker Desktop 4.0以上
- Git 2.0以上
- Node.js 22以上（ローカル開発の場合）
- お好みのIDE（VS Code推奨）

### 推奨VS Code拡張機能

```json
{
  "recommendations": [
    "angular.ng-template",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "firsttris.vscode-jest-runner"
  ]
}
```

## プロジェクト構成

```
.
├── .github/              # GitHub Actions ワークフロー
├── .kiro/                # Kiro設定（ステアリングルール）
├── backend/              # NestJS バックエンド
├── frontend/             # Angular フロントエンド
├── docker/               # Dockerファイル
├── scripts/              # スクリプト
└── docs/                 # ドキュメント
```

## コマンド実行方法

**重要**: このプロジェクトはDocker環境で動作しています。全てのnpmコマンドは必ずDockerコンテナ内で実行してください。

### 基本パターン

```bash
# フロントエンドのコマンド実行
docker compose exec frontend <コマンド>

# バックエンドのコマンド実行
docker compose exec backend <コマンド>
```

## よく使うコマンド

### Docker操作

```bash
# コンテナの起動
docker compose up -d

# コンテナの停止
docker compose down

# コンテナの再起動
docker compose restart

# コンテナの状態確認
docker compose ps

# ログの確認（リアルタイム）
docker compose logs -f

# 特定のコンテナのログ確認
docker compose logs -f backend
docker compose logs -f frontend

# 最新100行のログを表示
docker compose logs --tail=100 backend
```

### フロントエンド開発

#### 開発サーバー

```bash
# 開発サーバーは自動起動されます
# 手動で起動する場合:
docker compose exec frontend npm start

# アクセス: http://localhost:4200
```

#### ビルド

```bash
# 開発ビルド
docker compose exec frontend npm run build

# 本番ビルド
docker compose exec frontend npm run build -- --configuration production
```

#### テスト

```bash
# TypeScriptコンパイラで型チェック
docker compose exec frontend npx tsc --noEmit

# Lintチェック
docker compose exec frontend npx eslint "src/**/*.ts"

# コードフォーマット
docker compose exec frontend npx prettier --write "src/**/*.{ts,html,css,scss}"
```

#### コンポーネント生成

```bash
# 新しいコンポーネントを生成
docker compose exec frontend npx ng generate component features/example

# 新しいサービスを生成
docker compose exec frontend npx ng generate service core/services/example

# 新しいモジュールを生成
docker compose exec frontend npx ng generate module features/example
```

### バックエンド開発

#### 開発サーバー

```bash
# 開発モード（ホットリロード）
docker compose exec backend npm run start:dev

# 通常起動
docker compose exec backend npm start

# アクセス: http://localhost:3000
```

#### ビルド

```bash
# ビルド
docker compose exec backend npm run build

# ビルド後に実行
docker compose exec backend npm run start:prod
```

#### テスト

```bash
# 全テスト実行
docker compose exec backend npm test

# 特定のテストファイル実行
docker compose exec backend npm test -- swagger.spec.ts

# カバレッジなしで実行
docker compose exec backend npm test -- --no-coverage

# Lintチェック
docker compose exec backend npm run lint

# 型チェック
docker compose exec backend npx tsc --noEmit
```

#### モジュール生成

```bash
# 新しいモジュールを生成
docker compose exec backend npx nest generate module users

# 新しいコントローラーを生成
docker compose exec backend npx nest generate controller users

# 新しいサービスを生成
docker compose exec backend npx nest generate service users

# リソース一式を生成（CRUD）
docker compose exec backend npx nest generate resource users
```

### データベース操作

```bash
# データベースに接続
docker compose exec database psql -U postgres -d app_db

# マイグレーションの生成
docker compose exec backend npm run migration:generate -- -n CreateUsersTable

# マイグレーションの実行
docker compose exec backend npm run migration:run

# マイグレーションの取り消し
docker compose exec backend npm run migration:revert

# データベースのリセット
docker compose exec backend npm run migration:drop
```

### パッケージ管理

```bash
# パッケージのインストール
docker compose exec backend npm install <パッケージ名>
docker compose exec frontend npm install <パッケージ名>

# 開発用パッケージのインストール
docker compose exec backend npm install -D <パッケージ名>
docker compose exec frontend npm install -D <パッケージ名>

# パッケージのアンインストール
docker compose exec backend npm uninstall <パッケージ名>
docker compose exec frontend npm uninstall <パッケージ名>

# パッケージの更新
docker compose exec backend npm update
docker compose exec frontend npm update
```

## 開発ワークフロー

### 1. 新機能の開発

```bash
# 1. 新しいブランチを作成
git checkout -b feature/new-feature

# 2. コードを編集

# 3. 型チェック
docker compose exec backend npx tsc --noEmit
docker compose exec frontend npx tsc --noEmit

# 4. Lintチェック
docker compose exec backend npm run lint
docker compose exec frontend npx eslint "src/**/*.ts"

# 5. テスト実行
docker compose exec backend npm test

# 6. コミット
git add .
git commit -m "feat: 新機能を追加"

# 7. プッシュ
git push origin feature/new-feature
```

### 2. バグ修正

```bash
# 1. バグ修正用ブランチを作成
git checkout -b fix/bug-description

# 2. バグを修正

# 3. テストを追加・修正

# 4. テスト実行
docker compose exec backend npm test

# 5. コミット
git add .
git commit -m "fix: バグを修正"

# 6. プッシュ
git push origin fix/bug-description
```

## コーディング規約

### TypeScript

```typescript
// ✅ 推奨: 明示的な型定義
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ 非推奨: 型推論に頼りすぎない
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Angular（Signals）

```typescript
// ✅ 推奨: Signalsを使用
export class ExampleComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(v => v + 1);
  }
}

// ❌ 非推奨: 通常のプロパティ
export class ExampleComponent {
  count = 0;
  
  get doubleCount() {
    return this.count * 2;
  }
  
  increment() {
    this.count++;
  }
}
```

### NestJS

```typescript
// ✅ 推奨: 依存性注入を使用
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
}

// ❌ 非推奨: 直接インスタンス化
export class UsersService {
  private usersRepository = new Repository<User>();
}
```

## デバッグ

### フロントエンド

```bash
# ブラウザの開発者ツールを使用
# 1. http://localhost:4200 を開く
# 2. F12キーで開発者ツールを開く
# 3. Consoleタブでログを確認
# 4. Sourcesタブでブレークポイントを設定
```

### バックエンド

```bash
# ログを確認
docker compose logs -f backend

# デバッグモードで起動
docker compose exec backend npm run start:debug

# VS Codeのデバッガーを接続
# launch.jsonに設定を追加
```

## トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のプロセスを確認
lsof -i :4200
lsof -i :3000
lsof -i :5432

# コンテナを再起動
docker compose restart
```

### node_modulesの問題

```bash
# フロントエンドのnode_modulesを削除して再インストール
docker compose exec frontend rm -rf node_modules package-lock.json
docker compose exec frontend npm install

# バックエンドのnode_modulesを削除して再インストール
docker compose exec backend rm -rf node_modules package-lock.json
docker compose exec backend npm install
```

### コンテナの完全リセット

```bash
# コンテナとボリュームを削除
docker compose down -v

# イメージを再ビルド
docker compose build --no-cache

# コンテナを起動
docker compose up -d
```

### データベース接続エラー

```bash
# データベースコンテナのログを確認
docker compose logs database

# データベースコンテナの状態を確認
docker compose ps database

# データベースに直接接続して確認
docker compose exec database psql -U postgres -d app_db
```

## ベストプラクティス

### 1. Docker環境でのコマンド実行

```bash
# ✅ 正しい: Dockerコンテナ内で実行
docker compose exec backend npm test

# ❌ 間違い: ローカル環境で直接実行
npm test
```

### 2. コミット前のチェック

```bash
# 型チェック
docker compose exec backend npx tsc --noEmit
docker compose exec frontend npx tsc --noEmit

# Lintチェック
docker compose exec backend npm run lint
docker compose exec frontend npx eslint "src/**/*.ts"

# テスト実行
docker compose exec backend npm test
```

### 3. コミットメッセージ

```bash
# ✅ 推奨: Conventional Commits形式
git commit -m "feat: ユーザー登録機能を追加"
git commit -m "fix: ログイン時のバリデーションエラーを修正"
git commit -m "docs: READMEを更新"

# ❌ 非推奨: 曖昧なメッセージ
git commit -m "update"
git commit -m "fix bug"
```

### 4. ブランチ戦略

```
main        # 本番環境
  ↑
test        # テスト環境
  ↑
feature/*   # 機能開発
fix/*       # バグ修正
```

## API開発

### Swagger UI

開発環境では、Swagger UIを使用してAPIをテストできます：

- **URL**: http://localhost:3000/api
- **機能**:
  - 全エンドポイントの確認
  - リクエスト/レスポンスの構造確認
  - 「Try it out」で直接APIをテスト

### エンドポイントの追加

```typescript
// 1. DTOを定義
export class CreateUserDto {
  @ApiProperty({ description: 'ユーザー名' })
  @IsString()
  @IsNotEmpty()
  username: string;
}

// 2. コントローラーにエンドポイントを追加
@Post()
@ApiOperation({ summary: 'ユーザー作成' })
@ApiResponse({ status: 201, type: UserDto })
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

## パフォーマンス最適化

### フロントエンド

```typescript
// ✅ 推奨: Computed Signalsでメモ化
const expensiveResult = computed(() => {
  return heavyCalculation(data());
});

// ❌ 非推奨: メソッドで毎回計算
getExpensiveResult() {
  return heavyCalculation(this.data());
}
```

### バックエンド

```typescript
// ✅ 推奨: 非同期処理
async findAll(): Promise<User[]> {
  return await this.usersRepository.find();
}

// ❌ 非推奨: 同期処理
findAll(): User[] {
  return this.usersRepository.findSync();
}
```

## 参考リンク

- [Angular公式ドキュメント](https://angular.dev/)
- [NestJS公式ドキュメント](https://docs.nestjs.com/)
- [TypeORM公式ドキュメント](https://typeorm.io/)
- [Docker公式ドキュメント](https://docs.docker.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## サポート

開発に関する質問や問題は、[イシュー](https://github.com/musashi-eng/TANE/issues)を作成してください。
