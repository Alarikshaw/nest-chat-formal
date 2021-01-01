import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import 'console-color-mr';
import { logger } from './common/middleware/logger.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /**
   * 全局过滤器
   */
  app.use(logger);
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
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
  // 配置静态资源
  app.useStaticAssets(join(__dirname, '../public', '/'), {
    prefix: '/', 
  });
  await app.listen(3001);
}
bootstrap();
