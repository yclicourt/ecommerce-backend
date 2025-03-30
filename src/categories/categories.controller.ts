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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create categories' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createCategoryController(
    @Body() { productId, ...data }: CreateCategoryDto,
  ) {
    return await this.categoriesService.createCategoryItem(productId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAllCategoryController() {
    return await this.categoriesService.getAllCategoriesItems();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getCategoryController(@Param('id', ParseIntPipe) id: string) {
    return await this.categoriesService.getCategoryItem(parseInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteCategoryController(@Param('id', ParseIntPipe) id: string) {
    return await this.categoriesService.deleteCategoryItem(parseInt(id));
  }
}
