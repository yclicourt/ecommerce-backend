import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryInputDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryInputDto extends PartialType(CreateCategoryInputDto) {
  @ApiPropertyOptional({
    description: 'category name',
    example: 'electronic',
  })
  name?: string | undefined;
  @ApiPropertyOptional({
    description: 'category description',
    example: 'electronic categories',
  })
  description?: string | undefined;
  @ApiPropertyOptional({
    description: 'product id relation',
    example: '1',
  })
  productId?: number | undefined;
}
