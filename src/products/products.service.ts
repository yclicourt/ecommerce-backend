import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProductItem(createProductDto: CreateProductDto) {
    const productInserted = await this.prisma.product.create({
      data: {
        name:createProductDto.name,
        description:createProductDto.description,
        price:createProductDto.price,
        image:createProductDto.image!,
      },
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

    if (!productFound) {
      throw new BadRequestException(`The product by ${id} not found`);
    }
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

    if (!deletedProduct) {
      throw new NotFoundException(`There not product with that ${id}`);
    }
    return deletedProduct;
  }
}
