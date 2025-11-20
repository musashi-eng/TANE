import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

/**
 * アプリケーションのルートモジュール
 * 全てのモジュールをここで統合
 */
@Module({
  imports: [
    DatabaseModule, // データベース接続
    HealthModule,   // ヘルスチェック
  ],
})
export class AppModule {}
