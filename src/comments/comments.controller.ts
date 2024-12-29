import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() commentData: CreateCommentDto) {
    return await this.commentService.createComment(commentData);
  }
}
