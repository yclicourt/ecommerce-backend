import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
  .setTitle('Ecommerce NestJS')
  .setDescription('Ecommerce API NESTJS')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
