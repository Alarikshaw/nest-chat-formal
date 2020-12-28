import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * 全局过滤器
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * 配置全局拦截器
   */
  app.useGlobalInterceptors(new TransformInterceptor());

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
