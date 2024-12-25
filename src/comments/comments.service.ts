import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { PostsService } from 'src/posts/posts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UsersService,
    private readonly postService: PostsService,
  ) {}
  async createComment(
    commentData: CreateCommentDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userService.getUserById(commentData.userId);
      if (!user) {
        throw new NotFoundException(
          `User with ID ${commentData.userId} not found`,
        );
      }
      const post = (await this.postService.getPostById(commentData.postId))
        .data;

      if (!post) {
        throw new NotFoundException(
          `Post with ID ${commentData.postId} not found`,
        );
      }

      const newComment = this.commentRepository.create({
        ...commentData,
        post,
      });

      await this.commentRepository.save(newComment);

      // Save the Comment entity
      return {
        message: 'Create comment successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
