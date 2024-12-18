import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { HttpCode } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Post()
  @HttpCode(201)
  async createPost(@Body() postData: CreatePostDto) {
    return this.postService.createPost(postData);
  }

  @Patch(':id')
  @HttpCode(200)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }
}
