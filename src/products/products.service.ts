import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProductItem(createProductDto: CreateProductDto) {
    const productFound = await this.prisma.product.findFirst({
      where: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        image: createProductDto.image,
      },
    });

    if (!productFound) {
      throw new BadRequestException(
        'The product to be inserted already exists',
      );
    }
    const productInserted = await this.prisma.product.create({
      data: createProductDto,
    });
    return productInserted;
  }

  async getAllProductsItems() {
    const productsFounds = await this.prisma.product.findMany({});
    return productsFounds;
  }

  async getProductItem(id: number) {
    const productFound = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });
    return productFound;
  }

  async updateProductItem(id: number, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });

    return updatedProduct;
  }

  async deleteProductItem(id: number) {
    const deletedProduct = await this.prisma.product.delete({
      where: {
        id,
      },
    });
    return deletedProduct;
  }
}
