import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  createCategoryItem(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
      },
    });
  }

  getAllCategoriesItems() {
    return this.prisma.category.findMany({});
  }

  getCategoryItem(id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async updateCategoryItem(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categoryFound = await this.getCategoryItem(id);

    if (!categoryFound) throw new HttpException('Category not found', 404);

    const categoryUpdated = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...updateCategoryDto,
      },
    });
    return categoryUpdated;
  }

  async deleteCategory(id: number) {
    const categoryFound = await this.getCategoryItem(id);

    if (!categoryFound) throw new HttpException('Category not found', 404);

    await this.prisma.category.delete({
      where: {
        id,
      },
    });

    return 'Category deleted successfully';
  }
}
