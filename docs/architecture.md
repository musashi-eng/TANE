# アーキテクチャ

このドキュメントでは、TANEプロジェクトのアーキテクチャと設計思想を説明します。

## 概要

TANEは、モダンなフルスタックTypeScriptアプリケーションのテンプレートです。以下の設計原則に基づいています：

- **型安全性** - TypeScriptによる厳格な型チェック
- **スケーラビリティ** - マイクロサービス化を見据えた設計
- **保守性** - 明確な責任分離とモジュール化
- **パフォーマンス** - Zoneless + Signalsによる高速レンダリング
- **開発体験** - Docker環境による簡単なセットアップ

## システム構成

```
┌─────────────────────────────────────────────────────────┐
│                        ユーザー                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    ALB (ロードバランサー)                 │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ↓                       ↓
┌───────────────────────┐   ┌───────────────────────┐
│   Frontend Container  │   │   Backend Container   │
│   (Angular 20)        │   │   (NestJS 11)         │
│   - Nginx             │   │   - Node.js 22        │
│   - Port: 80          │   │   - Port: 3000        │
└───────────────────────┘   └───────────────────────┘
                                        │
                                        ↓
                            ┌───────────────────────┐
                            │   RDS PostgreSQL 17   │
                            │   - Port: 5432        │
                            └───────────────────────┘
```

## フロントエンド（Angular 20）

### アーキテクチャの特徴

#### Zoneless モード

従来のZone.jsを使用せず、Angularの新しい変更検知メカニズムを採用：

- **パフォーマンス向上** - Zone.jsのオーバーヘッドがない
- **バンドルサイズ削減** - 約50KB削減
- **予測可能性** - 明示的な変更検知

#### Signals ベースの状態管理

RxJSの代わりにSignalsを主要な状態管理手法として使用：

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    <h1>{{ title() }}</h1>
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
  `
})
export class ExampleComponent {
  // Signal の定義
  title = signal('Example');
  count = signal(0);
  
  // Computed Signal（派生値）
  doubleCount = computed(() => this.count() * 2);
  
  // Signal の更新
  increment() {
    this.count.update(value => value + 1);
  }
}
```

### ディレクトリ構造

```
frontend/src/app/
├── core/              # コアモジュール（シングルトン）
│   ├── services/      # グローバルサービス
│   ├── guards/        # ルートガード
│   └── interceptors/  # HTTPインターセプター
├── features/          # 機能モジュール
│   ├── auth/          # 認証機能
│   ├── dashboard/     # ダッシュボード
│   └── tasks/         # タスク管理
├── shared/            # 共有モジュール
│   ├── components/    # 共有コンポーネント
│   ├── directives/    # 共有ディレクティブ
│   └── pipes/         # 共有パイプ
└── app.component.ts   # ルートコンポーネント
```

### UIライブラリ

- **ng-zorro-antd** - Ant Design UIコンポーネント
- **angular-fontawesome** - アイコンライブラリ

## バックエンド（NestJS 11）

### アーキテクチャの特徴

#### レイヤードアーキテクチャ

```
┌─────────────────────────────────────┐
│         Controller Layer            │  ← HTTPリクエストの受付
│  - ルーティング                      │
│  - バリデーション                    │
│  - Swagger定義                       │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│          Service Layer              │  ← ビジネスロジック
│  - ドメインロジック                  │
│  - トランザクション管理              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│        Repository Layer             │  ← データアクセス
│  - TypeORM                          │
│  - データベース操作                  │
└─────────────────────────────────────┘
```

#### 依存性注入（DI）

NestJSの強力なDIコンテナを活用：

```typescript
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}
  
  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }
}
```

### ディレクトリ構造

```
backend/src/
├── config/            # 設定ファイル
│   └── database.config.ts
├── database/          # データベース関連
│   └── database.module.ts
├── health/            # ヘルスチェック
│   ├── health.controller.ts
│   └── health.module.ts
├── swagger/           # Swagger設定
│   └── swagger.spec.ts
├── tasks/             # タスク機能（サンプル）
│   ├── dto/           # データ転送オブジェクト
│   ├── tasks.controller.ts
│   └── tasks.module.ts
├── app.module.ts      # ルートモジュール
└── main.ts            # エントリーポイント
```

### API設計

#### RESTful API

```
GET    /api/tasks       # タスク一覧取得
GET    /api/tasks/:id   # タスク詳細取得
POST   /api/tasks       # タスク作成
PUT    /api/tasks/:id   # タスク更新
DELETE /api/tasks/:id   # タスク削除
```

#### Swagger/OpenAPI

すべてのエンドポイントは自動的にドキュメント化されます：

```typescript
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  @Get()
  @ApiOperation({ summary: 'タスク一覧取得' })
  @ApiResponse({ status: 200, type: [TaskDto] })
  findAll(): TaskDto[] {
    // 実装
  }
}
```

## データベース（PostgreSQL 17）

### スキーマ設計

TypeORMを使用したエンティティ定義：

```typescript
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 100 })
  name: string;
  
  @Column({ type: 'text', nullable: true })
  description: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
```

### マイグレーション

TypeORMのマイグレーション機能を使用：

```bash
# マイグレーションの生成
npm run migration:generate -- -n CreateTasksTable

# マイグレーションの実行
npm run migration:run

# マイグレーションの取り消し
npm run migration:revert
```

## Docker環境

### コンテナ構成

#### 開発環境（docker-compose.yml）

```yaml
services:
  frontend:    # Angular開発サーバー
  backend:     # NestJS開発サーバー
  database:    # PostgreSQL
```

#### 本番環境（docker-compose.prod.yml）

```yaml
services:
  frontend:    # Nginx + ビルド済みAngular
  backend:     # Node.js + ビルド済みNestJS
  # database:  # 外部RDSを使用
```

### マルチステージビルド

本番環境では、マルチステージビルドを使用してイメージサイズを最小化：

```dockerfile
# ビルドステージ
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 実行ステージ
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main"]
```

## CI/CD

### GitHub Actions ワークフロー

#### CI（ビルド・テスト）

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    - Lintチェック
    - 型チェック
    - ビルド
    - テスト実行
```

#### CD（デプロイ）

```yaml
name: Deploy
on:
  push:
    branches: [test, main]
jobs:
  deploy:
    - AWS SSM経由でEC2に接続
    - デプロイスクリプト実行
    - ヘルスチェック
```

## セキュリティ

### 認証・認可

JWT（JSON Web Token）を使用した認証：

```typescript
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  
  async login(user: User) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### バリデーション

class-validatorを使用した入力検証：

```typescript
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;
  
  @IsEnum(['low', 'medium', 'high'])
  priority: string;
}
```

### 環境変数

機密情報は環境変数で管理：

```bash
# .env（Gitにコミットしない）
DATABASE_PASSWORD=secret
JWT_SECRET=secret-key
```

## パフォーマンス最適化

### フロントエンド

- **Lazy Loading** - ルートベースのコード分割
- **OnPush変更検知** - 不要な再レンダリングを削減
- **Signals** - 細かい粒度の変更検知
- **Production Build** - AOTコンパイル、Tree Shaking

### バックエンド

- **コネクションプーリング** - データベース接続の再利用
- **キャッシング** - Redis等を使用（今後追加予定）
- **非同期処理** - async/awaitの活用
- **インデックス** - データベースクエリの最適化

## スケーラビリティ

### 水平スケーリング

- **ステートレス設計** - セッション情報をRedisに保存
- **ロードバランサー** - ALBによる負荷分散
- **オートスケーリング** - EC2 Auto Scaling Group

### 垂直スケーリング

- **インスタンスタイプの変更** - より大きなEC2インスタンス
- **RDSのスケールアップ** - より大きなDBインスタンス

## モニタリング

### ヘルスチェック

```typescript
@Controller('health')
export class HealthController {
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

### ログ

- **構造化ログ** - JSON形式のログ出力
- **ログレベル** - ERROR, WARN, INFO, DEBUG
- **CloudWatch Logs** - AWS環境でのログ集約

## テスト戦略

### フロントエンド

- **単体テスト** - Jasmine + Karma
- **E2Eテスト** - Playwright（今後追加予定）

### バックエンド

- **単体テスト** - Jest
- **統合テスト** - Supertest
- **プロパティベーステスト** - fast-check

## 今後の拡張

### 予定されている機能

- [ ] 認証・認可機能の実装
- [ ] Redisキャッシング
- [ ] WebSocket対応
- [ ] ファイルアップロード機能
- [ ] メール送信機能
- [ ] バッチ処理
- [ ] マイクロサービス化

### 技術的な改善

- [ ] E2Eテストの追加
- [ ] パフォーマンステストの追加
- [ ] セキュリティスキャンの自動化
- [ ] コードカバレッジの向上

## 参考資料

- [Angular公式ドキュメント](https://angular.dev/)
- [NestJS公式ドキュメント](https://docs.nestjs.com/)
- [TypeORM公式ドキュメント](https://typeorm.io/)
- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/)
- [Docker公式ドキュメント](https://docs.docker.com/)

## まとめ

TANEは、モダンなフルスタックTypeScriptアプリケーションのベストプラクティスを集約したテンプレートです。このアーキテクチャをベースに、プロジェクトの要件に応じてカスタマイズしてください。
