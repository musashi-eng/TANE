import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';

/**
 * データベースモジュール
 * TypeORMを使用してPostgreSQLに接続
 */
@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
