import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';

/**
 * アプリケーションのルートモジュール
 * 全てのモジュールをここで統合
 */
@Module({
  imports: [
    DatabaseModule, // データベース接続
    HealthModule,   // ヘルスチェック
    TasksModule,    // タスク管理
  ],
})
export class AppModule {}
