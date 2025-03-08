import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ProductsModule,
    AuthModule,
    CategoriesModule,
    PaymentsModule,
    OrdersModule,
    CartModule,
    UsersModule,
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
