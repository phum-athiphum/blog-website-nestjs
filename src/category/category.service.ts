import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryReprository: Repository<Category>,
  ) {}
  async getCategoryById(id: number): Promise<Category> {
    return this.categoryReprository.findOne({
      where: { id },
    });
  }

  async getAllCategory(): Promise<{ message: string; data: Category[] }> {
    const categories = await this.categoryReprository.find();
    return {
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }
}
