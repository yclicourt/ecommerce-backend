import { Prisma } from '@prisma/client';
import { CartItemDto } from '../dto/cart-item.dto';

export function toPrismaCartItems(
  items: CartItemDto[],
  cartId: number,
): Prisma.CartItemCreateManyCartInputEnvelope {
  return {
    data: items.map((item) => ({
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
      cartId,
    })),
  };
}
