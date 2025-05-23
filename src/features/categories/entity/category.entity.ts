import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/features/products/entity/product.entity';
import { Subcategory } from 'src/features/subcategory/entities/subcategory.entity';

@ObjectType()
export class Category {
  @Field((type) => Int)
  id?: number;
  @Field()
  name: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  icon?: string;
  @Field(() => Product)
  product: Product;
  @Field(() => Subcategory)
  subcategory: Subcategory;
}
