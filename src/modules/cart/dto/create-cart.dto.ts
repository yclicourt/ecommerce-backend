import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
  @IsNotEmpty()
  @IsArray()
  items: CartItemDto[];
  @IsNumber()
  @IsNotEmpty()
  discountAmount: number;
  @IsNumber()
  @IsNotEmpty()
  taxAmount: number;
  @IsNumber()
  @IsNotEmpty()
  shippingAmount: number;
  @IsString()
  @IsNotEmpty()
  currency: string;
}
