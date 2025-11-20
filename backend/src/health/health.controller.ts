import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

/**
 * ヘルスチェックコントローラー
 * アプリケーションとデータベースの健全性を確認
 */
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
  check() {
    return this.health.check([
      // データベース接続の確認
      () => this.db.pingCheck('database'),
    ]);
  }
}
