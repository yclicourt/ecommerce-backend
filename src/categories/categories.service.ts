import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryInputDto } from './dto/create-category.dto';
import { UpdateCategoryInputDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  
  async createCategoryItem(createCategoryInputDto: CreateCategoryInputDto) {
    return await this.prisma.category.create({
      data: {
        name: createCategoryInputDto.name,
        description: createCategoryInputDto.description,
        icon: createCategoryInputDto.icon,
        product: {
          connect: {
            id: createCategoryInputDto.productId,
          },
        },
        subcategory: {
          connect: {
            id: createCategoryInputDto.subcategoryId,
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

  async updateCategoryItem(id: number, data: UpdateCategoryInputDto) {
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
