import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'product name',
    example: 'Laptop',
  })
  name: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'product description',
    example: 'Laptop HP',
  })
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'product price',
    example: '3000',
  })
  price: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'product image',
    example: 'image.com',
  })
  image?: string;
}
