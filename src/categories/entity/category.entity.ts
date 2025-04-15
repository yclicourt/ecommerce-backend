import { Field, Int, ObjectType } from '@nestjs/graphql';

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
  @Field((type) => Int)
  productId: number;
  @Field((type) => Int)
  subcategoryId: number;
}
