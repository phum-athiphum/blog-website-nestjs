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
import { UpdatePostDto } from './dtos/update-post.dto';
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

  async updatePost(postId: string, postData: UpdatePostDto): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({ where: { id: postId } });

      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      // Check if user exists (if userId is provided)
      if (postData.userId) {
        const user = await this.userService.getUserById(postData.userId);
        if (!user) {
          throw new NotFoundException(
            `User with ID ${postData.userId} not found`,
          );
        }
        post.user = user;
      }

      // Check if category exists (if categoryId is provided)
      if (postData.categoryId) {
        const category = await this.categoryService.getCategoryById(
          postData.categoryId,
        );
        if (!category) {
          throw new NotFoundException(
            `Category with ID ${postData.categoryId} not found`,
          );
        }
        post.category = category;
      }

      // Update other fields
      if (postData.title) post.title = postData.title;
      if (postData.description) post.description = postData.description;

      return await this.postRepository.save(post);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePost(postId: string): Promise<{ message: string }> {
    try {
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      await this.postRepository.remove(post);

      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
