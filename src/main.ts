import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import 'console-color-mr';
import { logger } from './common/middleware/logger.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /**
   * 全局过滤器
   */
  app.use(logger);
  /**
   * 配置全局拦截器
   */
  app.useGlobalInterceptors(new ResponseInterceptor());

  const options = new DocumentBuilder()
    .setTitle('Nest-Chat-Formal Api')
    .setDescription('Chat-Formal Api')
    .setVersion('1.2')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('chat-formal-api', app, document);

  await app.listen(3001);
}
bootstrap();
