import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { CategoryService } from 'src/category/category.service';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UsersService,
    private readonly categoryService: CategoryService,
  ) {}
  async createPost(postData: CreatePostDto): Promise<Post> {
    try {
      // เช๊กก่อนว่า user มีจริงไหม
      const user = await this.userService.getUserById(postData.userId);
      if (!user) {
        throw new NotFoundException(
          `User with ID ${postData.userId} not found`,
        );
      }

      const category = await this.categoryService.getCategoryById(
        postData.categoryId,
      );

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${postData.categoryId} not found`,
        );
      }

      const newPost = this.postRepository.create(postData);
      return await this.postRepository.save(newPost);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
