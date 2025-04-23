import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { toPrismaCartItems } from './mappers/cart.mapper';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItemToCart(createCartDto: CreateCartDto) {
    const { items, ...cartData } = createCartDto;
    const { tax, discounts } = this.calculateTotalTaxes(createCartDto);
    return await this.prisma.cart.create({
      data: {
        ...cartData,
        items: {
          createMany: toPrismaCartItems(items, cartData.userId),
        },
        discountAmount: discounts,
        taxAmount: tax,
      },
    });
  }

  calculateTotalTaxes({ items, taxAmount }: CreateCartDto) {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discounts = items.reduce((sum, discount) => sum + discount.price, 0);

    const tax = subtotal + taxAmount;

    const totals = subtotal + tax - discounts;

    return { totals, discounts, tax, subtotal };
  }

  async checkInStock(productId: number) {
    const stockProduct = await this.prisma.cartItem.findUnique({
      where: {
        id: productId,
      },
    });

    if (!stockProduct)
      throw new HttpException('This product is not available in stock', 404);
    return stockProduct;
  }

  async validateDisponibilityStock(
    { items }: CreateCartDto,
    { productId, quantity }: CartItemDto,
  ) {
    const productFound = await this.checkInStock(productId);

    if (!productFound) {
      throw new HttpException('This product is not available in stock', 404);
    }

    if (quantity >= 0) {
      items.push(productFound);
    } else {
      throw new Error('Insufficient stock');
    }

    return items;
  }
}
