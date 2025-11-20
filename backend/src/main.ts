import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * アプリケーションのエントリーポイント
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS設定（開発環境用）
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  // グローバルプレフィックス（オプション）
  // app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
}

bootstrap();
