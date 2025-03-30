import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
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
