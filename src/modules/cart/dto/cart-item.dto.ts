import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartItemDto {
  @IsNumber()
  @IsNotEmpty()
  cartId: number;
  @IsNumber()
  @IsNotEmpty()
  productId: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
