import { CreateProductDto } from '../dto/create-product.dto';

export type RegisterProductPayload = CreateProductDto & { image?: string };
