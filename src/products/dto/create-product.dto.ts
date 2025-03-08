import { Product } from '@prisma/client';

export type CreateProductDto = Omit<
  Product,
  'description | image | createdAt | updatedAt'
>;
