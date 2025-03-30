import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'product name',
    example: 'Laptop',
  })
  name?: string | undefined;
  @ApiPropertyOptional({
    description: 'product description',
    example: 'Laptop HP',
  })
  description?: string | undefined;
  @ApiPropertyOptional({
    description: 'product price',
    example: '3000',
  })
  price?: number | undefined;
  @ApiPropertyOptional({
    description: 'product image',
    example: 'image.com',
  })
  image?: string | undefined;
}
