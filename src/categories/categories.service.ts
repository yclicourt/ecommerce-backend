import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async createCategoryItem(
    productId: number,
    data: Prisma.CategoryCreateWithoutProductInput,
  ) {
    return await this.prisma.category.create({
      data: {
        ...data,
        productId,
      },
    });
  }

  getAllCategoriesItems() {
    return this.prisma.category.findMany({
      include: {
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
