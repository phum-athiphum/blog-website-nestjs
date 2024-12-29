import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { ILike, Repository } from 'typeorm';
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

  async getPosts(
    categoryId?: number,
    title?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ message: string; data: Post[] }> {
    const whereCondition = {
      ...(categoryId && { category: { id: categoryId } }),
      ...(title && { title: ILike(`%${title}%`) }),
    };

    const posts = await this.postRepository.find({
      where: whereCondition,
      order: { created_date: sortOrder },
    });

    return {
      message: 'Posts retrieved successfully',
      data: posts,
    };
  }

  async getPostById(id: number): Promise<{ message: string; data: Post }> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['comments'],
        order: {
          comments: {
            created_date: 'DESC',
          },
        },
      });

      return {
        message: 'Post retrieved successfully',
        data: post,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPost(
    postData: CreatePostDto,
  ): Promise<{ message: string; data: Post }> {
    try {
      // Fetch the related User entity
      const user = await this.userService.getUserById(postData.userId);
      if (!user) {
        throw new NotFoundException(
          `User with ID ${postData.userId} not found`,
        );
      }

      // Fetch the related Category entity
      const category = await this.categoryService.getCategoryById(
        postData.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${postData.categoryId} not found`,
        );
      }

      // Create a new Post entity and assign relations
      const newPost = this.postRepository.create({
        ...postData,
        user,
        category,
      });

      const savePost = await this.postRepository.save(newPost);

      // Save the Post entity
      return {
        message: 'Create post successfully',
        data: savePost,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePost(
    postId: number,
    postData: UpdatePostDto,
  ): Promise<{ message: string; data: Post }> {
    try {
      const post = await this.postRepository.findOne({ where: { id: postId } });

      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
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

      const postUpdated = await this.postRepository.save(post);

      return {
        message: 'Post updated successfully',
        data: postUpdated,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePost(postId: number): Promise<{
    message: string;
    data: {
      id: number;
      title: string;
    };
  }> {
    try {
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }
      const deletedPost = await this.postRepository.remove(post);
      return {
        message: 'Deleted post successfully',
        data: {
          id: deletedPost.id,
          title: deletedPost.title,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
