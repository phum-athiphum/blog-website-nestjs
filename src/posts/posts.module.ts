import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { UsersModule } from 'src/users/users.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, CategoryModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
