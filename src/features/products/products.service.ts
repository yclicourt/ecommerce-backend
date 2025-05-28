import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterProductPayload } from './interfaces/register-product-payload.interface';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  createProductItem(productPayload: RegisterProductPayload) {
    return this.prisma.product.create({
      data: {
        ...productPayload,
        price: Number(productPayload.price),
      },
    });
  }

  async getAllProductsItems() {
    const productsFounds = await this.prisma.product.findMany({});
    return productsFounds;
  }

  async getProductItem(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }
  async updateProductItem(id: number, data: UpdateProductDto) {
    const productFound = await this.getProductItem(id);
    if (!productFound) throw new HttpException('Product not found', 404);

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...data,
        price: Number(data.price),
      },
    });
  }

  async deleteProductItem(id: number) {
    try {
      const productFound = await this.getProductItem(id);

      if (!productFound) throw new HttpException('Product not Found', 404);

      return await this.prisma.product.delete({
        where: {
          id,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2003') {
        throw new NotFoundException('Product not found');
      } else {
        throw err;
      }
    }
  }
}
