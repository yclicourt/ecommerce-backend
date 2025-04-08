import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'subcategory name',
    example: 'Smartphone',
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'subcategory url',
    example: 'http://localhost:4000/api/v1/subcategories/',
  })
  url: string;
}
