import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryReprository: Repository<Category>,
  ) {}
  async getCategoryById(id: string): Promise<Category> {
    return this.categoryReprository.findOne({
      where: { id },
    });
  }
}
