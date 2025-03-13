import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async createCategoryItem(createCategoryDto: CreateCategoryDto) {
    const categoryFound = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
        description: createCategoryDto.description!,
        productId: createCategoryDto.productId,
      },
    });

    if (categoryFound) {
      throw new ConflictException('That exist a category with that records ');
    }
    const categoryCreated = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description!,
        productId: createCategoryDto.productId,
      },
    });
    return categoryCreated;
  }

  async getAllCategoriesItems() {
    const categoriesFounded = await this.prisma.category.findMany({});
    return categoriesFounded;
  }

  async getCategoryItem(id: number) {
    const categoryFounded = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!categoryFounded) {
      throw new HttpException(
        'That is not record with that product',
        HttpStatus.NOT_FOUND,
      );
    }
    return categoryFounded;
  }

  async updateCategoryItem(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categoriesUpdated = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
        productId: updateCategoryDto.productId,
      },
    });
    return categoriesUpdated;
  }

  async deleteCategoryItem(id: number) {
    const deletedCategory = await this.prisma.category.delete({
      where: {
        id,
      },
    });
    if (!deletedCategory) {
      throw new NotFoundException(`There not product with that ${id}`);
    }

    return deletedCategory;
  }
}
