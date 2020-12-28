import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局中间件
  app.use(LoggerMiddleware);
  const options = new DocumentBuilder()
    .setTitle('Nest-Chat-Formal Api')
    .setDescription('Chat-Formal Api')
    .setVersion('1.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('chat-formal-api', app, document);

  await app.listen(3001);
}
bootstrap();
