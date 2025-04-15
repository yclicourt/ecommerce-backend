import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSubcategoryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
