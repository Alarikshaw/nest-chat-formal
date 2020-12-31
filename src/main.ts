import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import 'console-color-mr';
import { logger } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * 全局过滤器
   */
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.use(logger);
  /**
   * 配置全局拦截器
   */
  // app.useGlobalInterceptors(new TransformInterceptor());

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
