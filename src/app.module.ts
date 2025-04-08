import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SubcategoryModule } from './subcategory/subcategory.module';

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
    SubcategoryModule,
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
