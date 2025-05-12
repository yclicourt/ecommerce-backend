import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'category name',
    example: 'electronic',
  })
  @Field()
  name: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'category description',
    example: 'Electronic categories',
  })
  @Field({ nullable: true })
  description?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'category icon',
    example: 'Image Icon Category',
  })
  @Field({ nullable: true })
  icon?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'subcategories by category',
    example: 'Smartphone is subcategory of Electronics Category',
  })
  @Field()
  subcategoryId: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'product id relation',
    example: '2',
  })
  @Field()
  productId: number;
}
