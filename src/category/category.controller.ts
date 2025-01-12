import { Controller, Get, HttpCode } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  @HttpCode(200)
  async getCategory() {
    return await this.categoryService.getAllCategory();
  }
}
