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
import { MailModule } from './integrations/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './common/file-upload/file-upload.service';

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
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
    SubcategoryModule,
    ConfigModule.forRoot(),
    MailModule,
  ],
  controllers: [],

  providers: [FileUploadService],
})
export class AppModule {}
