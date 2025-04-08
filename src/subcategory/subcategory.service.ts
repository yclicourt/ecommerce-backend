import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubcategoryService {
  constructor(private prisma: PrismaService) {}

  async createSubcategoryItem(data: Prisma.SubCategoryCreateInput) {
    return await this.prisma.subCategory.create({
      data,
    });
  }

  async getAllSubcategoriesItems() {
    return await this.prisma.subCategory.findMany({});
  }

  async getSubcategoryItem(id: number) {
    const subcategoryFound = await this.prisma.subCategory.findUnique({
      where: {
        id,
      },
    });
    if (!subcategoryFound)
      throw new HttpException('Subcategory not found', 404);
    return subcategoryFound;
  }

  async updateSubcategoryItem(id: number, data: Prisma.SubCategoryUpdateInput) {
    const subcategoryFound = await this.getSubcategoryItem(id);
    if (!subcategoryFound)
      throw new HttpException('Subcategory not found', 404);

    return await this.prisma.subCategory.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteSubcategoryItem(id: number) {
    const subcategoryFound = await this.getSubcategoryItem(id);
    if (!subcategoryFound)
      throw new HttpException('Subcategory not found', 404);
    return this.prisma.subCategory.delete({
      where: {
        id,
      },
    });
  }
}
