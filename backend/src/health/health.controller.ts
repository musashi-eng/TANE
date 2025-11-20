import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * ヘルスチェックコントローラー
 * アプリケーションとデータベースの健全性を確認
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  /**
   * ヘルスチェックエンドポイント
   * GET /health
   * 
   * @returns ヘルスチェック結果
   */
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'ヘルスチェック',
    description: 'アプリケーションとデータベースの健全性を確認します',
  })
  @ApiResponse({
    status: 200,
    description: 'ヘルスチェック成功',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['ok', 'error', 'shutting_down'],
          example: 'ok',
        },
        info: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['up', 'down'],
                  example: 'up',
                },
              },
            },
          },
        },
        error: {
          type: 'object',
        },
        details: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['up', 'down'],
                  example: 'up',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'サービス利用不可',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['error', 'shutting_down'],
          example: 'error',
        },
        error: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['down'],
                  example: 'down',
                },
                message: {
                  type: 'string',
                  example: 'Connection failed',
                },
              },
            },
          },
        },
      },
    },
  })
  check() {
    return this.health.check([
      // データベース接続の確認
      () => this.db.pingCheck('database'),
    ]);
  }
}
