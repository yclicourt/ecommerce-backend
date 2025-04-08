import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'category name',
    example: 'electronic',
  })
  name: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'category description',
    example: 'Electronic categories',
  })
  description?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'category icon',
    example: 'Image Icon Category',
  })
  icon?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'subcategories by category',
    example: 'Smartphone is subcategory of Electronics Category',
  })
  subcategoryId: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'product id relation',
    example: '2',
  })
  productId: number;
}
