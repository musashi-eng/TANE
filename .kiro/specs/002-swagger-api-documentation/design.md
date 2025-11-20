# 設計書

## 概要

本ドキュメントは、NestJS11バックエンドにSwagger（OpenAPI）ドキュメントを統合する設計を定義します。`@nestjs/swagger`パッケージを使用して、APIエンドポイントを自動的にドキュメント化し、開発者がSwagger UIを通じてAPIを視覚的に確認・テストできるようにします。

### 目的

- APIエンドポイントの自動ドキュメント化
- 開発者向けのインタラクティブなAPIテストインターフェースの提供
- OpenAPI 3.0仕様に準拠したAPI定義の生成
- 開発環境でのみSwaggerを有効化し、本番環境でのセキュリティを確保

### スコープ

**含まれるもの:**
- Swaggerの基本設定とセットアップ
- 既存のヘルスチェックエンドポイントのドキュメント化
- DTOクラスのドキュメント化サポート
- 環境別のSwagger有効化制御

**含まれないもの:**
- 認証・認可機能（将来の拡張として検討）
- カスタムテーマやスタイリング
- 複数バージョンのAPI管理

## アーキテクチャ

### システム構成

```
┌─────────────────────────────────────────┐
│         NestJS Application              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │         main.ts                   │ │
│  │  - Swagger設定                    │ │
│  │  - 環境別制御                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      Controllers                  │ │
│  │  - @ApiTags()                     │ │
│  │  - @ApiOperation()                │ │
│  │  - @ApiResponse()                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │          DTOs                     │ │
│  │  - @ApiProperty()                 │ │
│  │  - class-validator decorators     │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │   Swagger UI     │
    │   /api           │
    └──────────────────┘
              │
              ▼
    ┌──────────────────┐
    │  OpenAPI JSON    │
    │  /api-json       │
    └──────────────────┘
```


### レイヤー構成

#### 1. Swagger設定レイヤー（main.ts）

- **責務**: Swaggerの初期化と設定
- **主要機能**:
  - DocumentBuilderによるAPI基本情報の設定
  - SwaggerModuleによるドキュメント生成
  - 環境変数による有効化制御

#### 2. コントローラーレイヤー

- **責務**: エンドポイントのドキュメント化
- **主要機能**:
  - `@ApiTags()`: エンドポイントのグループ化
  - `@ApiOperation()`: エンドポイントの説明
  - `@ApiResponse()`: レスポンスの定義

#### 3. DTOレイヤー

- **責務**: データ構造のドキュメント化
- **主要機能**:
  - `@ApiProperty()`: フィールドの説明と例示
  - `class-validator`デコレーターとの統合

## コンポーネントとインターフェース

### 1. Swagger設定（main.ts）

```typescript
interface SwaggerConfig {
  title: string;           // APIタイトル
  description: string;     // API説明
  version: string;         // APIバージョン
  path: string;           // Swagger UIのパス
}
```

**設定内容:**
- タイトル: "Tama API"
- 説明: "タスク管理アプリケーションのバックエンドAPI"
- バージョン: "1.0"
- パス: "/api"

### 2. コントローラーデコレーター

```typescript
// タグによるグループ化
@ApiTags('Health')

// エンドポイントの説明
@ApiOperation({ 
  summary: 'ヘルスチェック',
  description: 'アプリケーションとデータベースの健全性を確認'
})

// レスポンスの定義
@ApiResponse({ 
  status: 200, 
  description: 'ヘルスチェック成功',
  type: HealthCheckResult
})
```

### 3. DTOデコレーター

```typescript
class ExampleDto {
  @ApiProperty({
    description: 'フィールドの説明',
    example: '例示値',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  field: string;
}
```


## データモデル

### OpenAPI仕様構造

```typescript
interface OpenAPIDocument {
  openapi: '3.0.0';
  info: {
    title: string;
    description: string;
    version: string;
  };
  paths: {
    [path: string]: {
      [method: string]: {
        tags: string[];
        summary: string;
        description: string;
        parameters?: Parameter[];
        requestBody?: RequestBody;
        responses: {
          [statusCode: string]: Response;
        };
      };
    };
  };
  components: {
    schemas: {
      [name: string]: Schema;
    };
  };
}
```

### ヘルスチェックレスポンスモデル

```typescript
interface HealthCheckResult {
  status: 'ok' | 'error' | 'shutting_down';
  info?: {
    [key: string]: {
      status: 'up' | 'down';
    };
  };
  error?: {
    [key: string]: {
      status: 'up' | 'down';
      message?: string;
    };
  };
  details: {
    [key: string]: {
      status: 'up' | 'down';
      message?: string;
    };
  };
}
```

## 正確性プロパティ

*プロパティとは、システムの全ての有効な実行において真であるべき特性や振る舞いのことです。本質的には、システムが何をすべきかについての形式的な記述です。プロパティは、人間が読める仕様と機械が検証可能な正確性保証との橋渡しとなります。*

### プロパティ1: OpenAPI仕様の準拠

*任意の*生成されたAPIドキュメントについて、そのドキュメントはOpenAPI 3.0仕様に準拠した有効なJSON構造を持つべきである

**検証: 要件 1.3**

### プロパティ2: エンドポイントのタグ付け

*任意の*ドキュメント化されたエンドポイントについて、そのエンドポイントは少なくとも1つのタグを持つべきである

**検証: 要件 2.4**

### プロパティ3: コントローラーの自動ドキュメント化

*任意の*NestJSコントローラーについて、そのコントローラーのエンドポイントはOpenAPI仕様に含まれるべきである

**検証: 要件 3.1**

### プロパティ4: DTOの自動ドキュメント化

*任意の*`@ApiProperty()`デコレーターを持つDTOクラスについて、そのDTOはOpenAPI仕様のcomponents/schemasに含まれるべきである

**検証: 要件 4.1**

### プロパティ5: レスポンスの自動ドキュメント化

*任意の*`@ApiResponse()`デコレーターを持つエンドポイントについて、そのレスポンス定義はOpenAPI仕様に含まれるべきである

**検証: 要件 5.1**

### プロパティ6: バリデーションルールのドキュメント化

*任意の*`class-validator`デコレーターを持つDTOフィールドについて、そのバリデーション制約はOpenAPI仕様のスキーマに反映されるべきである

**検証: 要件 6.1**


## エラーハンドリング

### 1. Swagger初期化エラー

**シナリオ**: Swaggerの設定や初期化に失敗した場合

**対応**:
- エラーログを出力
- アプリケーションの起動は継続（Swaggerなしで動作）
- 開発者に明確なエラーメッセージを提供

```typescript
try {
  // Swagger設定
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('📚 Swagger UI: http://localhost:3000/api');
} catch (error) {
  console.error('❌ Swagger initialization failed:', error);
  // アプリケーションは継続
}
```

### 2. 本番環境でのアクセス

**シナリオ**: 本番環境でSwaggerパスにアクセスした場合

**対応**:
- 404エラーを返す
- Swaggerは初期化されないため、パスが存在しない

### 3. 不正なデコレーター使用

**シナリオ**: デコレーターが正しく適用されていない場合

**対応**:
- NestJSのビルド時にエラーを検出
- TypeScriptの型チェックで事前に防止
- 開発時にSwagger UIで確認可能

## テスト戦略

### 単体テスト

**目的**: 個別のコンポーネントの動作を検証

**対象**:
- Swagger設定の生成
- デコレーターの適用
- 環境変数による制御

**ツール**: Jest

**例**:
```typescript
describe('Swagger Configuration', () => {
  it('should create valid OpenAPI document', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();
    
    expect(config.info.title).toBe('Tama API');
    expect(config.info.version).toBe('1.0');
  });
});
```

### プロパティベーステスト

**目的**: 正確性プロパティを検証

**ツール**: fast-check（JavaScriptのプロパティベーステストライブラリ）

**設定**: 各プロパティテストは最低100回の反復を実行

**テスト対象プロパティ**:

1. **プロパティ1: OpenAPI仕様の準拠**
   - ランダムなAPI設定を生成
   - 生成されたドキュメントがOpenAPI 3.0スキーマに準拠することを検証

2. **プロパティ2: エンドポイントのタグ付け**
   - ランダムなコントローラーを生成
   - 全てのエンドポイントが少なくとも1つのタグを持つことを検証

3. **プロパティ3: コントローラーの自動ドキュメント化**
   - ランダムなコントローラーを生成
   - 全てのエンドポイントがOpenAPI仕様に含まれることを検証

4. **プロパティ4: DTOの自動ドキュメント化**
   - ランダムなDTOクラスを生成
   - 全てのDTOがcomponents/schemasに含まれることを検証

5. **プロパティ5: レスポンスの自動ドキュメント化**
   - ランダムなレスポンス定義を生成
   - 全てのレスポンスがOpenAPI仕様に含まれることを検証

6. **プロパティ6: バリデーションルールのドキュメント化**
   - ランダムなバリデーション付きDTOを生成
   - 全てのバリデーション制約がスキーマに反映されることを検証


**各プロパティベーステストの形式**:
```typescript
/**
 * Feature: swagger-api-documentation, Property 1: OpenAPI仕様の準拠
 */
it('should generate OpenAPI 3.0 compliant documents', () => {
  fc.assert(
    fc.property(
      // ジェネレーター
      fc.record({
        title: fc.string(),
        description: fc.string(),
        version: fc.string(),
      }),
      // プロパティ検証
      (config) => {
        const document = createDocument(config);
        return isValidOpenAPI30(document);
      }
    ),
    { numRuns: 100 }
  );
});
```

### 統合テスト

**目的**: システム全体の動作を検証

**対象**:
- Swagger UIへのアクセス
- OpenAPI JSONの取得
- 環境別の動作確認

**ツール**: Supertest + Jest

**例**:
```typescript
describe('Swagger Integration', () => {
  it('should serve Swagger UI at /api', async () => {
    const response = await request(app.getHttpServer())
      .get('/api')
      .expect(200);
    
    expect(response.text).toContain('swagger-ui');
  });
  
  it('should serve OpenAPI JSON at /api-json', async () => {
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);
    
    expect(response.body.openapi).toBe('3.0.0');
    expect(response.body.info.title).toBe('Tama API');
  });
});
```

### E2Eテスト

**目的**: 実際の使用シナリオを検証

**シナリオ**:
1. アプリケーション起動
2. Swagger UIへのアクセス
3. Try it out機能でAPIテスト
4. レスポンスの確認

**手動テスト項目**:
- Swagger UIの表示確認
- エンドポイント一覧の確認
- Try it out機能の動作確認
- レスポンススキーマの確認

## 実装の詳細

### 1. パッケージのインストール

```bash
npm install --save @nestjs/swagger
```

### 2. main.tsでのSwagger設定

```typescript
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 開発環境でのみSwaggerを有効化
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    console.log('📚 Swagger UI: http://localhost:3000/api');
  }
  
  await app.listen(3000);
}

bootstrap();
```


### 3. コントローラーのドキュメント化

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ 
    summary: 'ヘルスチェック',
    description: 'アプリケーションとデータベースの健全性を確認'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'ヘルスチェック成功'
  })
  @ApiResponse({ 
    status: 503, 
    description: 'サービス利用不可'
  })
  check() {
    // 実装
  }
}
```

### 4. DTOのドキュメント化

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'タスク名',
    example: 'プロジェクト計画書の作成',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;
  
  @ApiProperty({
    description: 'タスクの説明',
    example: 'Q1のプロジェクト計画書を作成する',
    required: false,
  })
  @IsString()
  description?: string;
}
```

### 5. 環境変数の設定

**.env**:
```env
NODE_ENV=development
```

**docker-compose.yml**:
```yaml
services:
  backend:
    environment:
      - NODE_ENV=development
```

## セキュリティ考慮事項

### 1. 本番環境での無効化

- `NODE_ENV=production`の場合、Swaggerを完全に無効化
- Swaggerパスへのアクセスは404を返す
- OpenAPI仕様JSONも提供しない

### 2. 機密情報の除外

- APIキーやトークンなどの機密情報は例示値に含めない
- 環境変数や設定ファイルの内容を露出しない
- データベース接続情報などをドキュメントに含めない

### 3. CORS設定

- Swagger UIは既存のCORS設定を使用
- 開発環境でのみフロントエンドからのアクセスを許可

## パフォーマンス考慮事項

### 1. ドキュメント生成のタイミング

- アプリケーション起動時に1回だけ生成
- リクエストごとに再生成しない
- メモリ上にキャッシュ

### 2. 本番環境での影響

- 本番環境ではSwaggerを無効化するため、パフォーマンスへの影響なし
- バンドルサイズへの影響は最小限（devDependenciesとして管理可能）

## 拡張性

### 将来の拡張ポイント

1. **認証・認可のドキュメント化**
   - Bearer Token認証の追加
   - `@ApiBearerAuth()`デコレーターの使用

2. **APIバージョニング**
   - 複数バージョンのAPI管理
   - バージョン別のSwagger UI

3. **カスタムテーマ**
   - Swagger UIのカスタマイズ
   - ブランディングの適用

4. **追加のメタデータ**
   - レート制限情報
   - 非推奨エンドポイントのマーク
   - 外部ドキュメントへのリンク

## まとめ

本設計では、NestJS11バックエンドにSwaggerを統合し、以下を実現します：

- **自動ドキュメント生成**: デコレーターベースの簡単な実装
- **開発者体験の向上**: インタラクティブなAPI探索とテスト
- **標準準拠**: OpenAPI 3.0仕様に準拠
- **セキュリティ**: 本番環境での無効化
- **保守性**: 既存コードへの影響を最小限に抑えた実装

この設計により、開発者はAPIの構造を素早く理解し、効率的に開発を進めることができます。
