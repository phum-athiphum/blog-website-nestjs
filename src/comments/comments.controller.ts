import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Post()
  @HttpCode(201)
  async createComment(@Body() commentData: CreateCommentDto) {
    return await this.commentService.createComment(commentData);
  }
}
