import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategoryController(
    @Body() { productId, ...data }: CreateCategoryDto,
  ) {
    return await this.categoriesService.createCategoryItem(productId, data);
  }

  @Get()
  async getAllCategoryController() {
    return await this.categoriesService.getAllCategoriesItems();
  }

  @Get(':id')
  async getCategoryController(@Param('id', ParseIntPipe) id: string) {
    return await this.categoriesService.getCategoryItem(parseInt(id));
  }

  @Patch(':id')
  async updateCategoryController(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategoryItem(
      parseInt(id),
      updateCategoryDto,
    );
  }

  @Delete(':id')
  async deleteCategoryController(@Param('id', ParseIntPipe) id: string) {
    return await this.categoriesService.deleteCategoryItem(parseInt(id));
  }
}
