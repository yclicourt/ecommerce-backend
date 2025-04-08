import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSubcategoryDto } from './create-subcategory.dto';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @ApiPropertyOptional({
    description: 'subcategory name',
    example: 'Smartphone',
  })
  name?: string | undefined;
  @ApiPropertyOptional({
    description: 'subcategory url',
    example: 'http://localhost:4000/api/v1/subcategories/',
  })
  url: string | undefined;
}
