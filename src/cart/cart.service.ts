import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItemToCart(data: Prisma.CartUncheckedCreateInput) {
    return await this.prisma.cart.create({
      data,
    });
  }
}
