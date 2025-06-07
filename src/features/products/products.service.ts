import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterProductPayload } from './interfaces/register-product-payload.interface';
import { CategoryName, Prisma } from '@prisma/client';
import { UpdateProductPayload } from './interfaces/update-product-payload.interface';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}


  // Method to create product item
  createProductItem(productPayload: RegisterProductPayload) {
    return this.prisma.product.create({
      data: {
        name: productPayload.name,
        description: productPayload.description,
        price: parseFloat(productPayload.price),
        image: productPayload.image,
        categories: Array.isArray(productPayload.categories)
          ? {
              create: (
                productPayload.categories as Array<{
                  name: CategoryName;
                  description?: string;
                }>
              ).map((cat) => ({
                name: cat.name,
                description: cat.description || null, // Usar null en lugar de undefined
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Method to get all products items
  async getAllProductsItems() {
    const productsFounds = await this.prisma.product.findMany({
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
    });
    return productsFounds;
  }

  // Method to get a product
  async getProductItem(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });
  }

  // Method to update product item
  async updateProductItem(
    id: number,
    updateProductPayload: UpdateProductPayload,
  ) {
    const productFound = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
      },
    });
    if (!productFound) throw new HttpException('Product not found', 404);
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name: updateProductPayload.name,
        description: updateProductPayload.description,
        price: Number(updateProductPayload.price),
        image: updateProductPayload.image,
        categories: Array.isArray(updateProductPayload.categories)
          ? {
              deleteMany: {},
              create: (
                updateProductPayload.categories as Array<{
                  name: CategoryName;
                  description?: string;
                }>
              ).map((cat) => ({
                name: cat.name,
                description: cat.description || null,
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Method to delete product item
  async deleteProductItem(id: number) {
    try {
      const productFound = await this.getProductItem(id);

      if (!productFound) throw new HttpException('Product not Found', 404);

      return await this.prisma.product.delete({
        where: {
          id,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new ConflictException('The Field dont not exist in the table');
        }
      }
      throw err;
    }
  }
}
