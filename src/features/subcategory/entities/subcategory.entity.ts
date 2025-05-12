import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Subcategory {
  @Field(() => Int, { description: 'subcategory id' })
  id?: number;

  @Field()
  name: string;

  @Field()
  url: string;
}
