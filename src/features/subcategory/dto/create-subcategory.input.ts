import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateSubcategoryInput {
  @Field({ description: 'subcategory name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field({ description: 'subcategory url' })
  url: string;
}
