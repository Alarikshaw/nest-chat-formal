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




import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';

import { UserModule } from './modules/user/user.module';
import { FriendModule } from './modules/friend/friend.module';
import { GroupModule } from './modules/group/group.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'chat1',
      charset: "utf8mb4", // 设置chatset编码为utf8mb4
      autoLoadEntities: true,
      synchronize: true
    }),
    PostsModule, UserModule, FriendModule, GroupModule,
    AuthModule
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware); 
  }
}