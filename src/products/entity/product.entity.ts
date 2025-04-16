import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Cart } from 'src/cart/entity/cart.entity';
import { Category } from 'src/categories/entity/category.entity';

@ObjectType()
export class Product {
  @Field((type) => Int, { description: 'Product Id' })
  id: number;

  @Field({ description: 'Product name' })
  name: string;

  @Field({ nullable: true, description: 'Product description' })
  description?: string;

  @Field((type) => Float, { description: 'Product price' })
  price: number;

  @Field({ nullable: true, description: 'Product Image' })
  image?: string;

  @Field((type) => [Category])
  categories: Category[];

}
