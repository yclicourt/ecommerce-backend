import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'product id relation',
    example: '2',
  })
  productId: number;
}
