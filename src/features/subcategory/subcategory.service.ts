import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SubcategoryService {
  constructor(private readonly prisma: PrismaService) {}

  createSubcategoryItem(data: Prisma.SubCategoryCreateInput) {
    return this.prisma.subCategory.create({
      data,
    });
  }

  getAllSubcategoryItems() {
    return this.prisma.subCategory.findMany({});
  }

  getSubcategoryItem(id: number) {
    return this.prisma.subCategory.findUnique({
      where: {
        id,
      },
    });
  }

  async updateSubcategoryItem(id: number, data: Prisma.SubCategoryUpdateInput) {
    const categoryFound = await this.getSubcategoryItem(id);
    if (!categoryFound) throw new HttpException('Subcategory not found', 404);

    return this.prisma.subCategory.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteSubcategoryItem(id: number) {
    const categoryFound = await this.getSubcategoryItem(id);
    if (!categoryFound) throw new HttpException('Subcategory not found', 404);

    return this.prisma.subCategory.delete({
      where: {
        id,
      },
    });
  }
}
