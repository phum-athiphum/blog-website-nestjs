import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpCode } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  @HttpCode(200)
  async getPosts(
    @Query('categoryId') categoryId?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    return await this.postService.getPosts(categoryId, sortOrder);
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id') id: string) {
    return await this.postService.getPostById(id);
  }

  @Post()
  @HttpCode(201)
  async createPost(@Body() postData: CreatePostDto) {
    return await this.postService.createPost(postData);
  }

  @Patch(':id')
  @HttpCode(200)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
