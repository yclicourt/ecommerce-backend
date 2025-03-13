import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
  ConflictException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategoryController(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const data =
        await this.categoriesService.createCategoryItem(createCategoryDto);
      res.status(HttpStatus.CREATED).json({ data });
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  @Get()
  async getAllCategoryController(@Res() res: Response) {
    try {
      return res
        .status(HttpStatus.OK)
        .json(await this.categoriesService.getAllCategoriesItems());
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  @Get(':id')
  async getCategoryController(@Param('id') id: string, @Res() res: Response) {
    try {
      res
        .status(HttpStatus.OK)
        .json(await this.categoriesService.getCategoryItem(parseInt(id)));
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  @Put(':id')
  async updateCategoryController(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      res
        .status(HttpStatus.OK)
        .json(
          await this.categoriesService.updateCategoryItem(
            parseInt(id),
            updateCategoryDto,
          ),
        );
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  @Delete(':id')
  async deleteCategoryController(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      return await this.categoriesService.deleteCategoryItem(parseInt(id));
      res
        .status(HttpStatus.NO_CONTENT)
        .json({ message: 'Has been eliminated succefully that product' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new ConflictException('There is not record with that product');
        }
      }
    }
  }
}
