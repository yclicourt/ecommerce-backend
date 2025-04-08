import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async createCategoryItem(
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        icon: createCategoryDto.icon,
        product: {
          connect: {
            id: createCategoryDto.productId,
          },
        },
        subcategory: {
          connect:{
            id: createCategoryDto.subcategoryId
          },
        },
      },
    });
  }

  getAllCategoriesItems() {
    return this.prisma.category.findMany({
      include: {
        subcategory: {
          select: {
            name: true,
            url: true,
          },
        },
        product: {
          select: {
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
  }

  async getCategoryItem(id: number) {
    const categoryFound = await this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        subcategory: {
          select: {
            name: true,
            url: true,
          },
        },
        product: {
          select: {
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
    if (!categoryFound) throw new HttpException('Category not found', 404);
    return categoryFound;
  }

  async updateCategoryItem(id: number, data: Prisma.CategoryUpdateInput) {
    const categoryFound = await this.getCategoryItem(id);
    if (!categoryFound) throw new HttpException('Category not found', 404);

    return await this.prisma.category.update({
      where: {
        id: categoryFound.id,
      },
      data,
    });
  }

  async deleteCategoryItem(id: number) {
    const categoryFound = await this.getCategoryItem(id);
    if (!categoryFound) throw new HttpException('Category not found', 404);

    return this.prisma.category.delete({
      where: {
        id: categoryFound.id,
      },
    });
  }
}
