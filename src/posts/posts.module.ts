import { Module } from '@nestjs/common';
import { PostsController, TestPostController } from './posts.controller';

@Module({
  controllers: [PostsController, TestPostController],
})
export class PostsModule {}
