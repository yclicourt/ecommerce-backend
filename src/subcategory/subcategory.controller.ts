import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('subcategories')
@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create subcategories' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createSubcategoryController(
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    return await this.subcategoryService.createSubcategoryItem(
      createSubcategoryDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAllSubcategoriesController() {
    return await this.subcategoryService.getAllSubcategoriesItems();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subcategory' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getSubcategoryController(@Param('id', ParseIntPipe) id: string) {
    return await this.subcategoryService.getSubcategoryItem(parseInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subcategory' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateSubcatgoryController(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return await this.subcategoryService.updateSubcategoryItem(
      parseInt(id),
      updateSubcategoryDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteSubcategoryController(@Param('id', ParseIntPipe) id: string) {
    return this.subcategoryService.deleteSubcategoryItem(parseInt(id));
  }
}
