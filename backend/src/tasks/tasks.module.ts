import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';

/**
 * タスク管理モジュール
 */
@Module({
  controllers: [TasksController],
})
export class TasksModule {}
