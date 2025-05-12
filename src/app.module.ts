import { Module } from '@nestjs/common';
import { ProductsModule } from './features/products/products.module';
import { AuthModule } from './features/auth/auth.module';
import { CategoriesModule } from './features/categories/categories.module';
import { PaymentsModule } from './features/payments/payments.module';
import { OrdersModule } from './integrations/paypal/orders/orders.module';
import { CartModule } from './features/cart/cart.module';
import { UsersModule } from './features/users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SubcategoryModule } from './features/subcategory/subcategory.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ProductsModule,
    AuthModule,
    CategoriesModule,
    PaymentsModule,
    OrdersModule,
    CartModule,
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 2,
        },
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    SubcategoryModule,
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
