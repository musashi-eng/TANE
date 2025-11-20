# Swagger開発ガイドライン

このドキュメントでは、TamaプロジェクトにおけるSwagger（OpenAPI）の使用方法とベストプラクティスを定義します。

## 基本方針

### Swaggerの目的

- APIエンドポイントの自動ドキュメント化
- 開発者向けのインタラクティブなAPIテストインターフェースの提供
- OpenAPI 3.0仕様に準拠したAPI定義の生成
- フロントエンド開発者とバックエンド開発者のコミュニケーション促進

### 環境別の動作

- **開発環境**: Swaggerを有効化（`NODE_ENV=development`）
- **本番環境**: Swaggerを無効化（`NODE_ENV=production`）

## アクセス方法

開発環境でアプリケーションを起動後、以下のURLにアクセスできます：

- **Swagger UI**: `http://localhost:3000/api`
- **OpenAPI JSON**: `http://localhost:3000/api-json`

## コントローラーのドキュメント化

### 基本パターン

全てのコントローラーには、以下のデコレーターを適用してください：

```typescript
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')  // タグによるグループ化（必須）
@Controller('tasks')
export class TasksController {
  @Get()
  @ApiOperation({ 
    summary: 'タスク一覧取得',
    description: '全てのタスクを取得します'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'タスク一覧取得成功',
    type: [TaskDto]  // レスポンスの型を指定
  })
  findAll() {
    // 実装
  }
  
  @Post()
  @ApiOperation({ 
    summary: 'タスク作成',
    description: '新しいタスクを作成します'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'タスク作成成功',
    type: TaskDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'バリデーションエラー'
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    // 実装
  }
}
```

### 必須デコレーター

1. **@ApiTags()**: コントローラーレベルで必須
   - エンドポイントをグループ化
   - Swagger UIでの表示を整理

2. **@ApiOperation()**: 各エンドポイントで必須
   - エンドポイントの概要と説明を提供
   - `summary`は簡潔に、`description`は詳細に

3. **@ApiResponse()**: 各エンドポイントで必須
   - 成功レスポンス（200, 201など）
   - エラーレスポンス（400, 404, 500など）
   - レスポンスの型を指定

## DTOのドキュメント化

### 基本パターン

全てのDTOクラスには、`@ApiProperty()`デコレーターを適用してください：

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional,
  MinLength, 
  MaxLength,
  IsEnum,
  IsInt,
  Min,
  Max
} from 'class-validator';

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
  @IsOptional()
  description?: string;
  
  @ApiProperty({
    description: '優先度',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  @IsEnum(['low', 'medium', 'high'])
  priority: string;
  
  @ApiProperty({
    description: '見積もり時間（時間）',
    minimum: 1,
    maximum: 100,
    example: 8,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  estimatedHours: number;
}
```

### @ApiProperty()の必須項目

1. **description**: フィールドの説明（日本語で記述）
2. **example**: 例示値（実際の使用例を示す）
3. **required**: 任意フィールドの場合は`false`を指定

### バリデーションとの統合

`class-validator`のデコレーターは、自動的にSwaggerのスキーマに反映されます：

| class-validator | Swagger反映内容 |
|----------------|----------------|
| `@IsString()` | type: string |
| `@IsInt()` | type: integer |
| `@IsBoolean()` | type: boolean |
| `@MinLength(n)` | minLength: n |
| `@MaxLength(n)` | maxLength: n |
| `@Min(n)` | minimum: n |
| `@Max(n)` | maximum: n |
| `@IsEnum(values)` | enum: values |
| `@IsOptional()` | required: false |


## レスポンスDTOのドキュメント化

レスポンス用のDTOも同様にドキュメント化します：

```typescript
export class TaskDto {
  @ApiProperty({
    description: 'タスクID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  
  @ApiProperty({
    description: 'タスク名',
    example: 'プロジェクト計画書の作成',
  })
  name: string;
  
  @ApiProperty({
    description: '作成日時',
    example: '2025-01-01T00:00:00Z',
  })
  createdAt: Date;
}
```

## 正確性プロパティ

Swagger統合では、以下の正確性プロパティを保証する必要があります：

### プロパティ1: OpenAPI仕様の準拠

*任意の*生成されたAPIドキュメントについて、そのドキュメントはOpenAPI 3.0仕様に準拠した有効なJSON構造を持つべきである

**実装での注意点**:
- DocumentBuilderで正しい設定を行う
- 生成されたJSONがOpenAPI 3.0スキーマに準拠することを確認

### プロパティ2: エンドポイントのタグ付け

*任意の*ドキュメント化されたエンドポイントについて、そのエンドポイントは少なくとも1つのタグを持つべきである

**実装での注意点**:
- 全てのコントローラーに`@ApiTags()`を適用
- タグ名は機能ごとにグループ化（例: 'Tasks', 'Users', 'Health'）

### プロパティ3: コントローラーの自動ドキュメント化

*任意の*NestJSコントローラーについて、そのコントローラーのエンドポイントはOpenAPI仕様に含まれるべきである

**実装での注意点**:
- 全てのエンドポイントに`@ApiOperation()`を適用
- プライベートエンドポイントも明示的にドキュメント化

### プロパティ4: DTOの自動ドキュメント化

*任意の*`@ApiProperty()`デコレーターを持つDTOクラスについて、そのDTOはOpenAPI仕様のcomponents/schemasに含まれるべきである

**実装での注意点**:
- 全てのDTOフィールドに`@ApiProperty()`を適用
- ネストされたオブジェクトも適切にドキュメント化

### プロパティ5: レスポンスの自動ドキュメント化

*任意の*`@ApiResponse()`デコレーターを持つエンドポイントについて、そのレスポンス定義はOpenAPI仕様に含まれるべきである

**実装での注意点**:
- 全てのステータスコード（成功・エラー）を定義
- レスポンスの型を明示的に指定

### プロパティ6: バリデーションルールのドキュメント化

*任意の*`class-validator`デコレーターを持つDTOフィールドについて、そのバリデーション制約はOpenAPI仕様のスキーマに反映されるべきである

**実装での注意点**:
- `class-validator`と`@ApiProperty()`を併用
- バリデーションルールが自動的にスキーマに反映されることを確認

## ベストプラクティス

### 1. 日本語での記述

- `description`は日本語で記述
- `summary`も日本語で記述
- `example`は実際の使用例を示す

### 2. 例示値の選択

- 実際のユースケースを反映した例示値を使用
- テストデータではなく、実際のデータに近い値を使用
- 機密情報（APIキー、パスワードなど）は含めない

### 3. エラーレスポンスの定義

全てのエンドポイントで、以下のエラーレスポンスを定義：

```typescript
@ApiResponse({ status: 400, description: 'バリデーションエラー' })
@ApiResponse({ status: 404, description: 'リソースが見つかりません' })
@ApiResponse({ status: 500, description: 'サーバーエラー' })
```

### 4. 型の再利用

レスポンスDTOを作成し、複数のエンドポイントで再利用：

```typescript
// ✅ 推奨: DTOを定義して再利用
@ApiResponse({ status: 200, type: TaskDto })
@ApiResponse({ status: 200, type: [TaskDto] })  // 配列の場合

// ❌ 非推奨: インラインで定義
@ApiResponse({ status: 200, schema: { ... } })
```

### 5. ネストされたオブジェクト

ネストされたオブジェクトも適切にドキュメント化：

```typescript
export class TaskWithUserDto {
  @ApiProperty({
    description: 'タスク情報',
    type: TaskDto,
  })
  task: TaskDto;
  
  @ApiProperty({
    description: '担当者情報',
    type: UserDto,
  })
  assignee: UserDto;
}
```

## テスト戦略

### プロパティベーステスト

Swagger統合では、以下のプロパティベーステストを実装します：

**使用ライブラリ**: fast-check

**テスト設定**: 各テストは最低100回の反復を実行

**テスト形式**:
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

Swagger UIとOpenAPI JSONの取得をテスト：

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

## トラブルシューティング

### Swagger UIが表示されない

**原因**: 環境変数が正しく設定されていない

**解決方法**:
```bash
# .envファイルを確認
NODE_ENV=development

# docker-compose.ymlを確認
services:
  backend:
    environment:
      - NODE_ENV=development
```

### DTOがドキュメントに表示されない

**原因**: `@ApiProperty()`デコレーターが適用されていない

**解決方法**:
```typescript
// ❌ 間違い
export class CreateTaskDto {
  name: string;  // デコレーターなし
}

// ✅ 正しい
export class CreateTaskDto {
  @ApiProperty({ description: 'タスク名', example: 'タスク1' })
  name: string;
}
```

### バリデーションルールが反映されない

**原因**: `class-validator`デコレーターと`@ApiProperty()`の両方が必要

**解決方法**:
```typescript
// ✅ 正しい
@ApiProperty({ description: 'タスク名', minLength: 1, maxLength: 100 })
@IsString()
@MinLength(1)
@MaxLength(100)
name: string;
```

## 参考リンク

- [NestJS Swagger公式ドキュメント](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0仕様](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

## まとめ

Swaggerを使用することで、以下のメリットが得られます：

- **自動ドキュメント生成**: コードからドキュメントを自動生成
- **開発効率の向上**: インタラクティブなAPIテスト
- **コミュニケーション改善**: フロントエンドとバックエンドの連携が容易
- **品質向上**: 正確性プロパティによる検証

このガイドラインに従うことで、一貫性のある高品質なAPIドキュメントを維持できます。
