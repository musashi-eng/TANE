import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * アプリケーションのエントリーポイント
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // グローバルバリデーションパイプの設定
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOに定義されていないプロパティを削除
      forbidNonWhitelisted: true, // 不正なプロパティがある場合エラー
      transform: true, // 型変換を自動で行う
    }),
  );

  // CORS設定（開発環境用）
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  // グローバルプレフィックス（オプション）
  // app.setGlobalPrefix('api');

  // Swagger設定（開発環境でのみ有効化）
  if (process.env.NODE_ENV !== 'production') {
    try {
      const config = new DocumentBuilder()
        .setTitle('Tama API')
        .setDescription('タスク管理アプリケーションのバックエンドAPI')
        .setVersion('1.0')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      console.log('📚 Swagger UI: http://localhost:3000/api');
    } catch (error) {
      console.error('❌ Swagger initialization failed:', error);
      // アプリケーションは継続
    }
  } else {
    console.log('ℹ️  Swagger is disabled in production environment');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
}

bootstrap();
