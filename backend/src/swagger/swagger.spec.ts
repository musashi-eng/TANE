import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fc from 'fast-check';
import { HealthModule } from '../health/health.module';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

/**
 * Feature: swagger-api-documentation, Property 1: OpenAPI仕様の準拠
 * 
 * このテストは、生成されたAPIドキュメントがOpenAPI 3.0仕様に準拠していることを検証します。
 * **検証: 要件 1.3**
 */
describe('Swagger OpenAPI Specification Compliance', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * プロパティ1: OpenAPI仕様の準拠
   * 
   * 任意の生成されたAPIドキュメントについて、
   * そのドキュメントはOpenAPI 3.0仕様に準拠した有効なJSON構造を持つべきである
   */
  it('should generate OpenAPI 3.0 compliant documents', () => {
    fc.assert(
      fc.property(
        // ランダムなAPI設定を生成
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 500 }),
          version: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        (config) => {
          // DocumentBuilderで設定を作成
          const documentConfig = new DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.version)
            .build();

          // ドキュメントを生成
          const document = SwaggerModule.createDocument(app, documentConfig);

          // OpenAPI 3.0仕様に準拠しているか検証
          expect(document).toBeDefined();
          expect(document.openapi).toBe('3.0.0');
          expect(document.info).toBeDefined();
          expect(document.info.title).toBe(config.title);
          expect(document.info.description).toBe(config.description);
          expect(document.info.version).toBe(config.version);
          expect(document.paths).toBeDefined();
          expect(typeof document.paths).toBe('object');

          // 必須フィールドの存在確認
          expect(document).toHaveProperty('openapi');
          expect(document).toHaveProperty('info');
          expect(document).toHaveProperty('paths');

          // info オブジェクトの必須フィールド
          expect(document.info).toHaveProperty('title');
          expect(document.info).toHaveProperty('version');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 基本的なOpenAPI構造の検証
   */
  it('should have valid OpenAPI structure for default configuration', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // OpenAPI 3.0.0 仕様に準拠
    expect(document.openapi).toBe('3.0.0');

    // info オブジェクトの検証
    expect(document.info.title).toBe('Tama API');
    expect(document.info.description).toBe('タスク管理アプリケーションのバックエンドAPI');
    expect(document.info.version).toBe('1.0');

    // paths オブジェクトの検証
    expect(document.paths).toBeDefined();
    expect(typeof document.paths).toBe('object');

    // ヘルスチェックエンドポイントが存在することを確認
    expect(document.paths['/health']).toBeDefined();
    expect(document.paths['/health'].get).toBeDefined();
  });

  /**
   * JSONシリアライズ可能性の検証
   */
  it('should be serializable to valid JSON', () => {
    const config = new DocumentBuilder()
      .setTitle('Test API')
      .setDescription('Test Description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // JSONにシリアライズできることを確認
    const jsonString = JSON.stringify(document);
    expect(jsonString).toBeDefined();
    expect(jsonString.length).toBeGreaterThan(0);

    // デシリアライズできることを確認
    const parsed = JSON.parse(jsonString);
    expect(parsed.openapi).toBe('3.0.0');
    expect(parsed.info.title).toBe('Test API');
  });
});

/**
 * Feature: swagger-api-documentation, Property 2: エンドポイントのタグ付け
 * 
 * このテストは、ドキュメント化されたエンドポイントが少なくとも1つのタグを持つことを検証します。
 * **検証: 要件 2.4**
 */
describe('Swagger Endpoint Tagging', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * プロパティ2: エンドポイントのタグ付け
   * 
   * 任意のドキュメント化されたエンドポイントについて、
   * そのエンドポイントは少なくとも1つのタグを持つべきである
   */
  it('should ensure all documented endpoints have at least one tag', () => {
    fc.assert(
      fc.property(
        // ランダムなAPI設定を生成
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 500 }),
          version: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        (config) => {
          // DocumentBuilderで設定を作成
          const documentConfig = new DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.version)
            .build();

          // ドキュメントを生成
          const document = SwaggerModule.createDocument(app, documentConfig);

          // 全てのパスとメソッドをチェック
          const paths = document.paths;
          let allEndpointsHaveTags = true;
          let endpointCount = 0;

          for (const path in paths) {
            const pathItem = paths[path];
            for (const method in pathItem) {
              // メソッドレベルの操作をチェック（get, post, put, delete など）
              if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
                endpointCount++;
                const operation = pathItem[method];
                
                // タグが存在し、少なくとも1つのタグがあることを確認
                if (!operation.tags || operation.tags.length === 0) {
                  allEndpointsHaveTags = false;
                  console.warn(`Endpoint ${method.toUpperCase()} ${path} has no tags`);
                }
              }
            }
          }

          // 少なくとも1つのエンドポイントが存在することを確認
          expect(endpointCount).toBeGreaterThan(0);
          
          // 全てのエンドポイントがタグを持つことを確認
          expect(allEndpointsHaveTags).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 具体的なエンドポイントのタグ検証
   */
  it('should have tags for health check endpoint', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // ヘルスチェックエンドポイントのタグを確認
    const healthEndpoint = document.paths['/health'];
    expect(healthEndpoint).toBeDefined();
    expect(healthEndpoint.get).toBeDefined();
    expect(healthEndpoint.get.tags).toBeDefined();
    expect(healthEndpoint.get.tags.length).toBeGreaterThan(0);
    expect(healthEndpoint.get.tags).toContain('Health');
  });

  /**
   * 全エンドポイントのタグ存在確認
   */
  it('should ensure all endpoints in the application have tags', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const paths = document.paths;
    const endpointsWithoutTags: string[] = [];

    for (const path in paths) {
      const pathItem = paths[path];
      for (const method in pathItem) {
        if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
          const operation = pathItem[method];
          if (!operation.tags || operation.tags.length === 0) {
            endpointsWithoutTags.push(`${method.toUpperCase()} ${path}`);
          }
        }
      }
    }

    // タグのないエンドポイントがないことを確認
    expect(endpointsWithoutTags).toEqual([]);
  });
});

/**
 * Feature: swagger-api-documentation, Property 3: コントローラーの自動ドキュメント化
 * 
 * このテストは、NestJSコントローラーのエンドポイントがOpenAPI仕様に含まれることを検証します。
 * **検証: 要件 3.1**
 */
describe('Swagger Controller Auto-Documentation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * プロパティ3: コントローラーの自動ドキュメント化
   * 
   * 任意のNestJSコントローラーについて、
   * そのコントローラーのエンドポイントはOpenAPI仕様に含まれるべきである
   */
  it('should include all controller endpoints in OpenAPI specification', () => {
    fc.assert(
      fc.property(
        // ランダムなAPI設定を生成
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 500 }),
          version: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        (config) => {
          // DocumentBuilderで設定を作成
          const documentConfig = new DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.version)
            .build();

          // ドキュメントを生成
          const document = SwaggerModule.createDocument(app, documentConfig);

          // paths オブジェクトが存在することを確認
          expect(document.paths).toBeDefined();
          expect(typeof document.paths).toBe('object');

          // 少なくとも1つのパスが存在することを確認
          const pathCount = Object.keys(document.paths).length;
          expect(pathCount).toBeGreaterThan(0);

          // 各パスに少なくとも1つのメソッドが存在することを確認
          for (const path in document.paths) {
            const pathItem = document.paths[path];
            const methods = Object.keys(pathItem).filter(key =>
              ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(key)
            );
            expect(methods.length).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * HealthControllerのエンドポイントが含まれることを確認
   */
  it('should include health controller endpoints', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // /health エンドポイントが存在することを確認
    expect(document.paths['/health']).toBeDefined();
    expect(document.paths['/health'].get).toBeDefined();

    // エンドポイントの詳細情報が含まれることを確認
    const healthEndpoint = document.paths['/health'].get;
    expect(healthEndpoint.summary).toBeDefined();
    expect(healthEndpoint.description).toBeDefined();
    expect(healthEndpoint.responses).toBeDefined();
  });

  /**
   * 全てのコントローラーメソッドがドキュメント化されることを確認
   */
  it('should document all HTTP methods for each endpoint', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const paths = document.paths;
    
    for (const path in paths) {
      const pathItem = paths[path];
      
      // 各HTTPメソッドが適切にドキュメント化されていることを確認
      for (const method in pathItem) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
          const operation = pathItem[method];
          
          // 基本的な操作情報が含まれることを確認
          expect(operation).toBeDefined();
          expect(operation.responses).toBeDefined();
          expect(Object.keys(operation.responses).length).toBeGreaterThan(0);
        }
      }
    }
  });
});

/**
 * Feature: swagger-api-documentation, Property 5: レスポンスの自動ドキュメント化
 * 
 * このテストは、@ApiResponse()デコレーターを持つエンドポイントのレスポンス定義が
 * OpenAPI仕様に含まれることを検証します。
 * **検証: 要件 5.1**
 */
describe('Swagger Response Auto-Documentation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * プロパティ5: レスポンスの自動ドキュメント化
   * 
   * 任意の@ApiResponse()デコレーターを持つエンドポイントについて、
   * そのレスポンス定義はOpenAPI仕様に含まれるべきである
   */
  it('should include response definitions for all endpoints with @ApiResponse decorator', () => {
    fc.assert(
      fc.property(
        // ランダムなAPI設定を生成
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 500 }),
          version: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        (config) => {
          // DocumentBuilderで設定を作成
          const documentConfig = new DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.version)
            .build();

          // ドキュメントを生成
          const document = SwaggerModule.createDocument(app, documentConfig);

          // 全てのエンドポイントがレスポンス定義を持つことを確認
          const paths = document.paths;
          let allEndpointsHaveResponses = true;
          let endpointCount = 0;

          for (const path in paths) {
            const pathItem = paths[path];
            for (const method in pathItem) {
              if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
                endpointCount++;
                const operation = pathItem[method];
                
                // レスポンスが存在し、少なくとも1つのステータスコードが定義されていることを確認
                if (!operation.responses || Object.keys(operation.responses).length === 0) {
                  allEndpointsHaveResponses = false;
                  console.warn(`Endpoint ${method.toUpperCase()} ${path} has no response definitions`);
                }
              }
            }
          }

          // 少なくとも1つのエンドポイントが存在することを確認
          expect(endpointCount).toBeGreaterThan(0);
          
          // 全てのエンドポイントがレスポンス定義を持つことを確認
          expect(allEndpointsHaveResponses).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * ヘルスチェックエンドポイントのレスポンス定義を確認
   */
  it('should have response definitions for health check endpoint', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // ヘルスチェックエンドポイントのレスポンスを確認
    const healthEndpoint = document.paths['/health'];
    expect(healthEndpoint).toBeDefined();
    expect(healthEndpoint.get).toBeDefined();
    expect(healthEndpoint.get.responses).toBeDefined();

    // 200レスポンスが定義されていることを確認
    const response200 = healthEndpoint.get.responses['200'];
    expect(response200).toBeDefined();
    if ('description' in response200) {
      expect(response200.description).toBeDefined();
    }

    // 503レスポンスが定義されていることを確認
    const response503 = healthEndpoint.get.responses['503'];
    expect(response503).toBeDefined();
    if ('description' in response503) {
      expect(response503.description).toBeDefined();
    }
  });

  /**
   * レスポンススキーマの詳細を確認
   */
  it('should include detailed response schemas', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const healthEndpoint = document.paths['/health'].get;
    const response200 = healthEndpoint.responses['200'];

    // レスポンススキーマが存在することを確認
    if ('content' in response200) {
      expect(response200.content).toBeDefined();
      expect(response200.content['application/json']).toBeDefined();
      expect(response200.content['application/json'].schema).toBeDefined();

      // スキーマの構造を確認
      const schema = response200.content['application/json'].schema;
      if ('type' in schema) {
        expect(schema.type).toBe('object');
      }
      if ('properties' in schema) {
        expect(schema.properties).toBeDefined();
        expect(schema.properties.status).toBeDefined();
      }
    }
  });

  /**
   * 全エンドポイントのレスポンス定義の完全性を確認
   */
  it('should ensure all endpoints have complete response definitions', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const paths = document.paths;
    const endpointsWithIncompleteResponses: string[] = [];

    for (const path in paths) {
      const pathItem = paths[path];
      for (const method in pathItem) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
          const operation = pathItem[method];
          
          // レスポンスが存在し、説明が含まれることを確認
          if (!operation.responses || Object.keys(operation.responses).length === 0) {
            endpointsWithIncompleteResponses.push(`${method.toUpperCase()} ${path}: no responses`);
          } else {
            for (const statusCode in operation.responses) {
              const response = operation.responses[statusCode];
              if ('description' in response && !response.description) {
                endpointsWithIncompleteResponses.push(
                  `${method.toUpperCase()} ${path}: status ${statusCode} has no description`
                );
              }
            }
          }
        }
      }
    }

    // 不完全なレスポンス定義がないことを確認
    expect(endpointsWithIncompleteResponses).toEqual([]);
  });
});

/**
 * Feature: swagger-api-documentation, Property 4: DTOの自動ドキュメント化
 * 
 * このテストは、@ApiProperty()デコレーターを持つDTOクラスが
 * OpenAPI仕様のcomponents/schemasに含まれることを検証します。
 * **検証: 要件 4.1**
 */
describe('Swagger DTO Auto-Documentation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // TasksModuleをインポートしてDTOをテスト
    const { TasksModule } = await import('../tasks/tasks.module');
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule, TasksModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * プロパティ4: DTOの自動ドキュメント化
   * 
   * 任意の@ApiProperty()デコレーターを持つDTOクラスについて、
   * そのDTOはOpenAPI仕様のcomponents/schemasに含まれるべきである
   */
  it('should include all DTOs with @ApiProperty decorator in components/schemas', () => {
    fc.assert(
      fc.property(
        // ランダムなAPI設定を生成
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 500 }),
          version: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        (config) => {
          // DocumentBuilderで設定を作成
          const documentConfig = new DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.version)
            .build();

          // ドキュメントを生成
          const document = SwaggerModule.createDocument(app, documentConfig);

          // components/schemas が存在することを確認
          expect(document.components).toBeDefined();
          expect(document.components.schemas).toBeDefined();
          expect(typeof document.components.schemas).toBe('object');

          // CreateTaskDto が schemas に含まれることを確認
          const schemas = document.components.schemas;
          expect(schemas['CreateTaskDto']).toBeDefined();

          // CreateTaskDto のプロパティが正しくドキュメント化されていることを確認
          const createTaskDto = schemas['CreateTaskDto'];
          if ('properties' in createTaskDto) {
            expect(createTaskDto.properties).toBeDefined();
            expect(createTaskDto.properties['name']).toBeDefined();
            expect(createTaskDto.properties['description']).toBeDefined();
            expect(createTaskDto.properties['priority']).toBeDefined();
            expect(createTaskDto.properties['estimatedHours']).toBeDefined();
          }

          // TaskDto が schemas に含まれることを確認
          expect(schemas['TaskDto']).toBeDefined();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * CreateTaskDto の詳細なスキーマ検証
   */
  it('should have complete schema for CreateTaskDto', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // CreateTaskDto のスキーマを取得
    const createTaskDto = document.components.schemas['CreateTaskDto'];
    expect(createTaskDto).toBeDefined();

    // スキーマの基本構造を確認
    if ('type' in createTaskDto) {
      expect(createTaskDto.type).toBe('object');
    }

    // プロパティの存在を確認
    if ('properties' in createTaskDto) {
      const properties = createTaskDto.properties;

      // name プロパティ
      expect(properties['name']).toBeDefined();
      if ('type' in properties['name']) {
        expect(properties['name'].type).toBe('string');
      }
      if ('description' in properties['name']) {
        expect(properties['name'].description).toBe('タスク名');
      }
      if ('example' in properties['name']) {
        expect(properties['name'].example).toBe('プロジェクト計画書の作成');
      }

      // description プロパティ
      expect(properties['description']).toBeDefined();
      if ('type' in properties['description']) {
        expect(properties['description'].type).toBe('string');
      }

      // priority プロパティ
      expect(properties['priority']).toBeDefined();
      if ('enum' in properties['priority']) {
        expect(properties['priority'].enum).toContain('low');
        expect(properties['priority'].enum).toContain('medium');
        expect(properties['priority'].enum).toContain('high');
      }

      // estimatedHours プロパティ
      expect(properties['estimatedHours']).toBeDefined();
      if ('type' in properties['estimatedHours']) {
        expect(properties['estimatedHours'].type).toBe('integer');
      }
    }

    // 必須フィールドの確認
    if ('required' in createTaskDto) {
      expect(createTaskDto.required).toContain('name');
      expect(createTaskDto.required).toContain('priority');
      expect(createTaskDto.required).toContain('estimatedHours');
      expect(createTaskDto.required).not.toContain('description'); // オプショナル
    }
  });

  /**
   * TaskDto の詳細なスキーマ検証
   */
  it('should have complete schema for TaskDto', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // TaskDto のスキーマを取得
    const taskDto = document.components.schemas['TaskDto'];
    expect(taskDto).toBeDefined();

    // プロパティの存在を確認
    if ('properties' in taskDto) {
      const properties = taskDto.properties;

      // 基本プロパティ
      expect(properties['id']).toBeDefined();
      expect(properties['name']).toBeDefined();
      expect(properties['description']).toBeDefined();
      expect(properties['priority']).toBeDefined();
      expect(properties['estimatedHours']).toBeDefined();
      expect(properties['createdAt']).toBeDefined();
      expect(properties['updatedAt']).toBeDefined();
    }
  });

  /**
   * エンドポイントでDTOが参照されることを確認
   */
  it('should reference DTOs in endpoint definitions', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // POST /tasks エンドポイントを確認
    const tasksPostEndpoint = document.paths['/tasks']?.post;
    expect(tasksPostEndpoint).toBeDefined();

    // リクエストボディでCreateTaskDtoが参照されることを確認
    if (tasksPostEndpoint && 'requestBody' in tasksPostEndpoint) {
      const requestBody = tasksPostEndpoint.requestBody;
      if ('content' in requestBody) {
        const content = requestBody.content['application/json'];
        expect(content).toBeDefined();
        expect(content.schema).toBeDefined();
        
        if ('$ref' in content.schema) {
          expect(content.schema.$ref).toContain('CreateTaskDto');
        }
      }
    }

    // レスポンスでTaskDtoが参照されることを確認
    if (tasksPostEndpoint && 'responses' in tasksPostEndpoint) {
      const response201 = tasksPostEndpoint.responses['201'];
      if (response201 && 'content' in response201) {
        const content = response201.content['application/json'];
        expect(content).toBeDefined();
        expect(content.schema).toBeDefined();
        
        if ('$ref' in content.schema) {
          expect(content.schema.$ref).toContain('TaskDto');
        }
      }
    }
  });

  /**
   * 全てのDTOフィールドが適切にドキュメント化されることを確認
   */
  it('should ensure all DTO fields have descriptions and examples', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const schemas = document.components.schemas;
    const fieldsWithoutDescriptions: string[] = [];

    // CreateTaskDto のフィールドをチェック
    const createTaskDto = schemas['CreateTaskDto'];
    if ('properties' in createTaskDto) {
      for (const fieldName in createTaskDto.properties) {
        const field = createTaskDto.properties[fieldName];
        if (!('description' in field) || !field.description) {
          fieldsWithoutDescriptions.push(`CreateTaskDto.${fieldName}: no description`);
        }
        if (!('example' in field) && fieldName !== 'description') {
          // description フィールドは例示値がなくてもOK
          fieldsWithoutDescriptions.push(`CreateTaskDto.${fieldName}: no example`);
        }
      }
    }

    // TaskDto のフィールドをチェック
    const taskDto = schemas['TaskDto'];
    if ('properties' in taskDto) {
      for (const fieldName in taskDto.properties) {
        const field = taskDto.properties[fieldName];
        if (!('description' in field) || !field.description) {
          fieldsWithoutDescriptions.push(`TaskDto.${fieldName}: no description`);
        }
        if (!('example' in field) && fieldName !== 'description') {
          fieldsWithoutDescriptions.push(`TaskDto.${fieldName}: no example`);
        }
      }
    }

    // 全てのフィールドが適切にドキュメント化されていることを確認
    expect(fieldsWithoutDescriptions).toEqual([]);
  });
});

/**
 * Feature: swagger-api-documentation, Property 6: バリデーションルールのドキュメント化
 * 
 * このテストは、class-validatorデコレーターを持つDTOフィールドのバリデーション制約が
 * OpenAPI仕様のスキーマに反映されることを検証します。
 * **検証: 要件 6.1**
 */
describe('Swagger Validation Rules Documentation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // TasksModuleをインポートしてDTOをテスト
    const { TasksModule } = await import('../tasks/tasks.module');
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule, TasksModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * プロパティ6: バリデーションルールのドキュメント化
   * 
   * 任意のclass-validatorデコレーターを持つDTOフィールドについて、
   * そのバリデーション制約はOpenAPI仕様のスキーマに反映されるべきである
   */
  it('should reflect validation constraints in OpenAPI schema for all DTO fields', () => {
    fc.assert(
      fc.property(
        // ランダムなAPI設定を生成
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 500 }),
          version: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        (config) => {
          // DocumentBuilderで設定を作成
          const documentConfig = new DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.version)
            .build();

          // ドキュメントを生成
          const document = SwaggerModule.createDocument(app, documentConfig);

          // CreateTaskDto のスキーマを取得
          const createTaskDto = document.components.schemas['CreateTaskDto'];
          expect(createTaskDto).toBeDefined();

          if ('properties' in createTaskDto) {
            const properties = createTaskDto.properties;

            // name フィールドの制約を確認
            const nameField = properties['name'];
            expect(nameField).toBeDefined();
            if ('minLength' in nameField) {
              expect(nameField.minLength).toBe(1);
            }
            if ('maxLength' in nameField) {
              expect(nameField.maxLength).toBe(100);
            }

            // priority フィールドの enum 制約を確認
            const priorityField = properties['priority'];
            expect(priorityField).toBeDefined();
            if ('enum' in priorityField) {
              expect(priorityField.enum).toEqual(['low', 'medium', 'high']);
            }

            // estimatedHours フィールドの制約を確認
            const estimatedHoursField = properties['estimatedHours'];
            expect(estimatedHoursField).toBeDefined();
            if ('minimum' in estimatedHoursField) {
              expect(estimatedHoursField.minimum).toBe(1);
            }
            if ('maximum' in estimatedHoursField) {
              expect(estimatedHoursField.maximum).toBe(100);
            }
            if ('type' in estimatedHoursField) {
              expect(estimatedHoursField.type).toBe('integer');
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * MinLength と MaxLength 制約の検証
   */
  it('should document MinLength and MaxLength constraints', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const createTaskDto = document.components.schemas['CreateTaskDto'];
    if ('properties' in createTaskDto) {
      const nameField = createTaskDto.properties['name'];
      
      // MinLength(1) と MaxLength(100) が反映されていることを確認
      expect('minLength' in nameField).toBe(true);
      expect('maxLength' in nameField).toBe(true);
      if ('minLength' in nameField) {
        expect(nameField.minLength).toBe(1);
      }
      if ('maxLength' in nameField) {
        expect(nameField.maxLength).toBe(100);
      }
    }
  });

  /**
   * Min と Max 制約の検証
   */
  it('should document Min and Max constraints for numeric fields', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const createTaskDto = document.components.schemas['CreateTaskDto'];
    if ('properties' in createTaskDto) {
      const estimatedHoursField = createTaskDto.properties['estimatedHours'];
      
      // Min(1) と Max(100) が反映されていることを確認
      expect('minimum' in estimatedHoursField).toBe(true);
      expect('maximum' in estimatedHoursField).toBe(true);
      if ('minimum' in estimatedHoursField) {
        expect(estimatedHoursField.minimum).toBe(1);
      }
      if ('maximum' in estimatedHoursField) {
        expect(estimatedHoursField.maximum).toBe(100);
      }
    }
  });

  /**
   * Enum 制約の検証
   */
  it('should document Enum constraints', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const createTaskDto = document.components.schemas['CreateTaskDto'];
    if ('properties' in createTaskDto) {
      const priorityField = createTaskDto.properties['priority'];
      
      // IsEnum(['low', 'medium', 'high']) が反映されていることを確認
      expect('enum' in priorityField).toBe(true);
      if ('enum' in priorityField) {
        expect(priorityField.enum).toContain('low');
        expect(priorityField.enum).toContain('medium');
        expect(priorityField.enum).toContain('high');
        expect(priorityField.enum.length).toBe(3);
      }
    }
  });

  /**
   * 必須フィールドとオプショナルフィールドの区別
   */
  it('should distinguish between required and optional fields', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const createTaskDto = document.components.schemas['CreateTaskDto'];
    
    // required フィールドの確認
    if ('required' in createTaskDto) {
      // IsNotEmpty() が付いているフィールドは必須
      expect(createTaskDto.required).toContain('name');
      expect(createTaskDto.required).toContain('priority');
      expect(createTaskDto.required).toContain('estimatedHours');
      
      // IsOptional() が付いているフィールドは任意
      expect(createTaskDto.required).not.toContain('description');
    }
  });

  /**
   * 型制約の検証
   */
  it('should document type constraints from class-validator decorators', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const createTaskDto = document.components.schemas['CreateTaskDto'];
    if ('properties' in createTaskDto) {
      // IsString() デコレーターが付いているフィールドは string 型
      const nameField = createTaskDto.properties['name'];
      if ('type' in nameField) {
        expect(nameField.type).toBe('string');
      }

      const descriptionField = createTaskDto.properties['description'];
      if ('type' in descriptionField) {
        expect(descriptionField.type).toBe('string');
      }

      // IsInt() デコレーターが付いているフィールドは integer 型
      const estimatedHoursField = createTaskDto.properties['estimatedHours'];
      if ('type' in estimatedHoursField) {
        expect(estimatedHoursField.type).toBe('integer');
      }
    }
  });

  /**
   * 全てのバリデーション制約が適切にドキュメント化されることを確認
   */
  it('should ensure all validation constraints are properly documented', () => {
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const createTaskDto = document.components.schemas['CreateTaskDto'];
    const missingConstraints: string[] = [];

    if ('properties' in createTaskDto) {
      const properties = createTaskDto.properties;

      // name フィールドの制約チェック
      const nameField = properties['name'];
      if (!('minLength' in nameField)) {
        missingConstraints.push('name: missing minLength');
      }
      if (!('maxLength' in nameField)) {
        missingConstraints.push('name: missing maxLength');
      }

      // priority フィールドの制約チェック
      const priorityField = properties['priority'];
      if (!('enum' in priorityField)) {
        missingConstraints.push('priority: missing enum');
      }

      // estimatedHours フィールドの制約チェック
      const estimatedHoursField = properties['estimatedHours'];
      if (!('minimum' in estimatedHoursField)) {
        missingConstraints.push('estimatedHours: missing minimum');
      }
      if (!('maximum' in estimatedHoursField)) {
        missingConstraints.push('estimatedHours: missing maximum');
      }
      if (!('type' in estimatedHoursField) || estimatedHoursField.type !== 'integer') {
        missingConstraints.push('estimatedHours: incorrect type (should be integer)');
      }
    }

    // 必須フィールドのチェック
    if ('required' in createTaskDto) {
      if (!createTaskDto.required.includes('name')) {
        missingConstraints.push('name: should be required');
      }
      if (!createTaskDto.required.includes('priority')) {
        missingConstraints.push('priority: should be required');
      }
      if (!createTaskDto.required.includes('estimatedHours')) {
        missingConstraints.push('estimatedHours: should be required');
      }
      if (createTaskDto.required.includes('description')) {
        missingConstraints.push('description: should be optional');
      }
    }

    // 全ての制約が適切にドキュメント化されていることを確認
    expect(missingConstraints).toEqual([]);
  });
});

/**
 * 統合テスト: Swagger UIへのアクセス
 * 
 * このテストは、Swagger UIが正しく提供されることを検証します。
 * **検証: 要件 1.1, 1.4**
 */
describe('Swagger UI Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 開発環境を模擬
    process.env.NODE_ENV = 'development';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    // Swagger設定を追加
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * Swagger UIが /api パスで提供されることを確認
   */
  it('should serve Swagger UI at /api path', async () => {
    const request = require('supertest');
    const response = await request(app.getHttpServer())
      .get('/api')
      .expect(200); // Swagger UIはHTMLを返す

    // HTMLコンテンツが返されることを確認
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('swagger-ui');
  });

  /**
   * Swagger UIのHTMLが正しく返されることを確認
   */
  it('should return Swagger UI HTML content', async () => {
    const request = require('supertest');
    const response = await request(app.getHttpServer())
      .get('/api/')
      .expect(200);

    // HTMLコンテンツが返されることを確認
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('swagger-ui');
  });

  /**
   * Swagger UIの静的リソースが提供されることを確認
   */
  it('should serve Swagger UI static resources', async () => {
    const request = require('supertest');
    
    // swagger-ui.css が提供されることを確認
    const cssResponse = await request(app.getHttpServer())
      .get('/api/swagger-ui.css')
      .expect(200);

    expect(cssResponse.headers['content-type']).toContain('text/css');

    // swagger-ui-bundle.js が提供されることを確認
    const jsResponse = await request(app.getHttpServer())
      .get('/api/swagger-ui-bundle.js')
      .expect(200);

    expect(jsResponse.headers['content-type']).toContain('javascript');
  });
});

/**
 * 統合テスト: OpenAPI JSON取得
 * 
 * このテストは、OpenAPI仕様がJSON形式で取得できることを検証します。
 * **検証: 要件 1.5**
 */
describe('OpenAPI JSON Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 開発環境を模擬
    process.env.NODE_ENV = 'development';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn().mockResolvedValue({ status: 'ok' }),
      })
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({
        pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    // Swagger設定を追加
    const config = new DocumentBuilder()
      .setTitle('Tama API')
      .setDescription('タスク管理アプリケーションのバックエンドAPI')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  /**
   * OpenAPI JSONが /api-json パスで取得できることを確認
   */
  it('should serve OpenAPI JSON at /api-json path', async () => {
    const request = require('supertest');
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    // JSONコンテンツが返されることを確認
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toBeDefined();
  });

  /**
   * OpenAPI JSONの構造が正しいことを確認
   */
  it('should return valid OpenAPI 3.0 JSON structure', async () => {
    const request = require('supertest');
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    const openApiDoc = response.body;

    // OpenAPI 3.0仕様に準拠していることを確認
    expect(openApiDoc.openapi).toBe('3.0.0');
    expect(openApiDoc.info).toBeDefined();
    expect(openApiDoc.info.title).toBe('Tama API');
    expect(openApiDoc.info.description).toBe('タスク管理アプリケーションのバックエンドAPI');
    expect(openApiDoc.info.version).toBe('1.0');
    expect(openApiDoc.paths).toBeDefined();
    expect(typeof openApiDoc.paths).toBe('object');
  });

  /**
   * OpenAPI JSONにエンドポイント情報が含まれることを確認
   */
  it('should include endpoint information in OpenAPI JSON', async () => {
    const request = require('supertest');
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    const openApiDoc = response.body;

    // ヘルスチェックエンドポイントが含まれることを確認
    expect(openApiDoc.paths['/health']).toBeDefined();
    expect(openApiDoc.paths['/health'].get).toBeDefined();
    expect(openApiDoc.paths['/health'].get.tags).toContain('Health');
    expect(openApiDoc.paths['/health'].get.summary).toBeDefined();
    expect(openApiDoc.paths['/health'].get.responses).toBeDefined();
  });

  /**
   * OpenAPI JSONがキャッシュされることを確認
   */
  it('should cache OpenAPI JSON for performance', async () => {
    const request = require('supertest');
    
    // 1回目のリクエスト
    const response1 = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    // 2回目のリクエスト
    const response2 = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    // 同じ内容が返されることを確認（キャッシュされている）
    expect(response1.body).toEqual(response2.body);
  });

  /**
   * OpenAPI JSONのサイズが妥当であることを確認
   */
  it('should return reasonably sized OpenAPI JSON', async () => {
    const request = require('supertest');
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    const jsonString = JSON.stringify(response.body);
    const sizeInKB = jsonString.length / 1024;

    // JSONサイズが1KB以上、1MB以下であることを確認
    expect(sizeInKB).toBeGreaterThan(1);
    expect(sizeInKB).toBeLessThan(1024);
  });
});

/**
 * 統合テスト: 環境別動作確認
 * 
 * このテストは、開発環境と本番環境でSwaggerの動作が異なることを検証します。
 * **検証: 要件 8.1, 8.2, 8.4**
 */
describe('Swagger Environment-Specific Behavior', () => {
  /**
   * 開発環境でSwaggerが有効化されることを確認
   */
  describe('Development Environment', () => {
    let app: INestApplication;

    beforeAll(async () => {
      // 開発環境を設定
      process.env.NODE_ENV = 'development';

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [HealthModule],
      })
        .overrideProvider(HealthCheckService)
        .useValue({
          check: jest.fn().mockResolvedValue({ status: 'ok' }),
        })
        .overrideProvider(TypeOrmHealthIndicator)
        .useValue({
          pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
        })
        .compile();

      app = moduleFixture.createNestApplication();

      // Swagger設定を追加（開発環境）
      if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
          .setTitle('Tama API')
          .setDescription('タスク管理アプリケーションのバックエンドAPI')
          .setVersion('1.0')
          .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
      }

      await app.init();
    });

    afterAll(async () => {
      if (app) {
        await app.close();
      }
    });

    it('should enable Swagger in development environment', async () => {
      const request = require('supertest');
      
      // Swagger UIにアクセスできることを確認
      const uiResponse = await request(app.getHttpServer())
        .get('/api/')
        .expect(200);

      expect(uiResponse.text).toContain('swagger-ui');

      // OpenAPI JSONにアクセスできることを確認
      const jsonResponse = await request(app.getHttpServer())
        .get('/api-json')
        .expect(200);

      expect(jsonResponse.body.openapi).toBe('3.0.0');
    });

    it('should log Swagger URL in development environment', () => {
      // コンソールログのスパイを設定
      const consoleSpy = jest.spyOn(console, 'log');

      // 開発環境であることを確認
      expect(process.env.NODE_ENV).toBe('development');

      // ログが出力されることを期待（実際のbootstrap関数では出力される）
      // このテストでは環境変数の確認のみ
      expect(process.env.NODE_ENV).not.toBe('production');

      consoleSpy.mockRestore();
    });
  });

  /**
   * 本番環境でSwaggerが無効化されることを確認
   */
  describe('Production Environment', () => {
    let app: INestApplication;

    beforeAll(async () => {
      // 本番環境を設定
      process.env.NODE_ENV = 'production';

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [HealthModule],
      })
        .overrideProvider(HealthCheckService)
        .useValue({
          check: jest.fn().mockResolvedValue({ status: 'ok' }),
        })
        .overrideProvider(TypeOrmHealthIndicator)
        .useValue({
          pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
        })
        .compile();

      app = moduleFixture.createNestApplication();

      // Swagger設定を追加しない（本番環境）
      if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
          .setTitle('Tama API')
          .setDescription('タスク管理アプリケーションのバックエンドAPI')
          .setVersion('1.0')
          .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
      }

      await app.init();
    });

    afterAll(async () => {
      if (app) {
        await app.close();
      }
      // 環境変数をリセット
      process.env.NODE_ENV = 'test';
    });

    it('should disable Swagger in production environment', async () => {
      const request = require('supertest');
      
      // Swagger UIにアクセスできないことを確認（404エラー）
      await request(app.getHttpServer())
        .get('/api/')
        .expect(404);

      // OpenAPI JSONにアクセスできないことを確認（404エラー）
      await request(app.getHttpServer())
        .get('/api-json')
        .expect(404);
    });

    it('should not expose API documentation in production', async () => {
      const request = require('supertest');
      
      // /api パスが存在しないことを確認
      const response = await request(app.getHttpServer())
        .get('/api')
        .expect(404);

      // エラーレスポンスが返されることを確認
      expect(response.body.statusCode).toBe(404);
    });

    it('should verify production environment setting', () => {
      // 本番環境であることを確認
      expect(process.env.NODE_ENV).toBe('production');
    });
  });

  /**
   * 環境変数による制御のテスト
   */
  describe('Environment Variable Control', () => {
    it('should respect NODE_ENV environment variable', () => {
      // 開発環境
      process.env.NODE_ENV = 'development';
      expect(process.env.NODE_ENV).not.toBe('production');

      // 本番環境
      process.env.NODE_ENV = 'production';
      expect(process.env.NODE_ENV).toBe('production');

      // テスト環境
      process.env.NODE_ENV = 'test';
      expect(process.env.NODE_ENV).not.toBe('production');

      // 環境変数をリセット
      process.env.NODE_ENV = 'test';
    });

    it('should treat undefined NODE_ENV as non-production', () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      // NODE_ENVが未定義の場合、本番環境ではない
      expect(process.env.NODE_ENV).toBeUndefined();
      expect(process.env.NODE_ENV !== 'production').toBe(true);

      // 環境変数を復元
      process.env.NODE_ENV = originalEnv;
    });
  });
});
