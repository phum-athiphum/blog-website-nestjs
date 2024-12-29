import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HttpCode } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  @HttpCode(200)
  async getPosts(
    @Query('categoryId') categoryId?: number,
    @Query('title') title?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    return await this.postService.getPosts(categoryId, title, sortOrder);
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id') id: number) {
    return await this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createPost(@Body() postData: CreatePostDto) {
    return await this.postService.createPost(postData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
