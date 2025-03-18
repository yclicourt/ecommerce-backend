import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsNumber()
  @IsOptional()
  productId: number | undefined;

  @IsNumber()
  @IsOptional()
  paymentId?: number | undefined;

  @IsNumber()
  @IsOptional()
  method_sentId?: number | undefined;

  @IsNumber()
  @IsOptional()
  userId?: number | undefined;

  @IsNumber()
  @IsOptional()
  orderId?: number | undefined;
}
