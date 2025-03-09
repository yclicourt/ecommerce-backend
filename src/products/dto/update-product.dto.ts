import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  name?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
  image?: string | undefined;
}
