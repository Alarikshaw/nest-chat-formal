// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';

// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       port: 3306,
//       username: 'root',
//       password: '123456',
//       database: 'formal',
//       charset: 'utf8mb4', // 设置chatset编码为utf8mb4
//       autoLoadEntities: true,
//       synchronize: true,
//     }),
//     // 设置user表
//   ]
// })


// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware); 
//   }
// }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}