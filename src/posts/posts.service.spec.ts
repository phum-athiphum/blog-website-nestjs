import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { UsersService } from '../users/users.service';
import { CategoryService } from '../category/category.service';
import { HttpException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let userService: UsersService;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            getCategoryById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    userService = module.get<UsersService>(UsersService);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPosts', () => {
    it('should retrieve posts based on filters', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      jest.spyOn(postRepository, 'find').mockResolvedValue(mockPosts as any);

      const result = await service.getPosts(1, 'Test', 2, 'ASC');
      expect(postRepository.find).toHaveBeenCalledWith({
        where: {
          category: { id: 1 },
          title: ILike('%Test%'),
          user: { id: 2 },
        },
        order: { created_date: 'ASC' },
      });
      expect(result).toEqual({
        message: 'Posts retrieved successfully',
        data: mockPosts,
      });
    });
  });

  describe('getPostById', () => {
    it('should retrieve a post by ID', async () => {
      const mockPost = { id: 1, title: 'Test Post', comments: [] };
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as any);

      const result = await service.getPostById(1);
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['comments'],
        order: { comments: { created_date: 'DESC' } },
      });
      expect(result).toEqual({
        message: 'Post retrieved successfully',
        data: mockPost,
      });
    });

    it('should throw an exception if post not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getPostById(1)).rejects.toThrow(HttpException);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const mockPost = { id: 1, title: 'Test Post' };
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as any);
      jest.spyOn(postRepository, 'remove').mockResolvedValue(mockPost as any);

      const result = await service.deletePost(1);

      expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
      expect(result).toEqual({
        message: 'Deleted post successfully',
        data: {
          id: mockPost.id,
          title: mockPost.title,
        },
      });
    });
  });
});
