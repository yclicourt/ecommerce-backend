import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { toPrismaCartItems } from './mappers/cart.mapper';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItemToCart(createCartDto: CreateCartDto) {
    const { items, ...cartData } = createCartDto;
    return await this.prisma.cart.create({
      data: {
        ...cartData,
        items: {
          createMany: toPrismaCartItems(items, cartData.userId),
        },
      },
      include: { items: true },
    });
  }
}
